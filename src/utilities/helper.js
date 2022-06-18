import { nest } from 'd3-collection';

(function () {
    if (typeof Object.defineProperty === 'function') {
        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();


export function SortBy(d, f) {
    d.sortBy(f);
}

export function ConvertGenzDataByCategory(data) {
    const mp = new Map();
    data.forEach(element => {
        if (!mp.has(element.category)) {
            mp.set(element.category, [element]);
        } else {
            var a = mp.get(element.category);
            mp.set(element.category, a.concat([element]));
        }
    });
    return mp;
}

export function GetNCategoryBySliceSize(data, skip, limit) {
    var dd = data.slice(skip, limit);
    var sumstat = nest()
        .key(function (d) { return d.category; })
        .entries(dd);

    return sumstat.length;
}

export function GetDataToDrawByNCategory(data, nCat) {
    var dd = data.slice(0, data.length);
    var sumstat = nest()
        .key(function (d) { return d.category; })
        .entries(dd);
    var dr = [];
    var counter = 0;
    sumstat.forEach((val, key) => {
        if (counter < nCat) {
            dr = dr.concat(val.values);
            counter++;
        }
    });
    return dr;
}