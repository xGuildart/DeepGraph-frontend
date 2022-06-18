import PouchDB from "pouchdb";
import { getGenZ } from "../utilities/restapiconsumer";


var db = new PouchDB('deeplabs', { auto_compaction: false });

export function StoreUser(id, pswd) {
    var user = {
        "_id": "current_user",
        "user": id,
        "pswd": pswd
    }
    db.put(user);
}

function initDB() {
    db = new PouchDB('deeplabs', { auto_compaction: false });
    var GenZ = {
        "_id": "genz",
        "data": [],
        "maxCategory": 0,
    }
    var BubbleChart = {
        '_id': "chart",
        'xAxisWidth': 0
    }
    //update or insert data
    db.get(GenZ._id).then((genz) => {
        genz.data = GenZ.data;
        genz.maxCategory = GenZ.maxCategory;
        db.put(genz);
    }, (_) => {
        db.put(GenZ);
    });

    db.get(BubbleChart._id).then((chart) => {
        chart.xAxisWidth = BubbleChart.xAxisWidth;
        db.put(chart);
    }, (_) => {
        db.put(BubbleChart);
    });

}

export async function StoreDataToDB(dataName, data) {

    return db.get(dataName).then((d) => {
        if (dataName == "genz") {
            d.data = data;
            // d.maxCategory = catm;
        }
        return db.put(d);
    }, (_) => {
        var x = {
            "_id": dataName,
            "data": data,
            "maxCategory": 0
        };
        return db.put(x);
    });

}

export async function SaveAxisWidth(width) {
    db.get("chart").then((d) => {
        d.xAxisWidth = width;
        db.put(d);
    }, (_) => {
        var x = {
            "_id": "chart",
            "xAxisWidth": width,
        };
        db.put(x);
    });


}


export async function GetAxisWidth() {
    var x = db.get("chart").then((chart) => {
        // console.log('getting value chart');
        // console.log(chart.xAxisWidth);
        return chart.xAxisWidth;
    }, (error) => {
        console.log(error);
        return 0;
    });

    return x;
}

export async function ForceDataReload() {
    return db.get("genz").then((d) => {
        if (d.data.length == 0) {
            return getGenZ().then((res) => {
                StoreDataToDB("genz", res.data);
                if (res.data.length > 0) {
                    return res.data;
                } else {
                    return ReloadFromLocal(res.data);
                }

            });
        } else {
            return d.data;
        }
    });
}

export async function ReloadFromLocal(data) {

    data = db.get('genz').then((d) => {
        if (d.data.length == 0) {
            getGenZ().then((res) => {
                return res.data;
            })
        } else {
            return d.data;
        }
    });

    return data;
}

// 1. get the changes of the documents by their ids.
// export async function ViaChanges() {
//     return db.changes({
//         live: true,
//         since: 0,
//         include_docs: true
//         //style: 'all_docs'
//     }).on('change'), function (change) {
//         if (change.deleted) {
//             console.log("the doc with id: " + change.id + ' and doc: ');
//             console.log(change.doc);
//             console.log("was deleted");
//         } else {
//             console.log("the doc with id: " + change.id);
//             console.log(change.doc);
//             console.log("was modified or added");
//         }
//     }
// }

// 2. then call pouch.get() to retrieve the document data for each document by its latest revision
// export async function DeletedDocumentsData() {
//     return ViaChanges().then((results) => {
//         console.log(results);
//         return results.map(async (result) => {
//             const firstDoc = await db.get(
//                 result.id,
//                 {
//                     rev: result.changes[0].rev,
//                     deleted: 'ok',
//                     style: 'all_docs'
//                 }
//             );
//             return firstDoc;
//         });
//     });
// }



initDB();

export default db;