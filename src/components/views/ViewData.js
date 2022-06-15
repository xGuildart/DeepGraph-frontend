import { useState, useEffect, useContext, forwardRef } from 'react';
import { useLocation } from "react-router-dom";
import db, { DeletedDocumentsData, StoreDataToDB, ViaChanges } from '../../storage/pouchdb';
import { checkUser, getGenZ } from '../../utilities/restapiconsumer';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import AppBar from '../components/AppBar';
import { Context, withContext } from '../../store/Store';
import { ConvertGenzDataByCategory } from '../../utilities/helper';
import BubbleChart from '../charts/BubbleChart';
import FormControls from '../components/FormControls';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const data = [
    { year: 1980, efficiency: 24.3, sales: 8949000 },
    { year: 1985, efficiency: 27.6, sales: 10979000 },
    { year: 1990, efficiency: 28, sales: 9303000 },
    { year: 1991, efficiency: 28.4, sales: 8185000 },
    { year: 1992, efficiency: 27.9, sales: 8213000 },
    { year: 1993, efficiency: 28.4, sales: 8518000 },
    { year: 1994, efficiency: 28.3, sales: 8991000 },
    { year: 1995, efficiency: 28.6, sales: 8620000 },
    { year: 1996, efficiency: 28.5, sales: 8479000 },
    { year: 1997, efficiency: 28.7, sales: 8217000 },
    { year: 1998, efficiency: 28.8, sales: 8085000 },
    { year: 1999, efficiency: 28.3, sales: 8638000 },
    { year: 2000, efficiency: 28.5, sales: 8778000 },
    { year: 2001, efficiency: 28.8, sales: 8352000 },
    { year: 2002, efficiency: 29, sales: 8042000 },
    { year: 2003, efficiency: 29.5, sales: 7556000 },
    { year: 2004, efficiency: 29.5, sales: 7483000 },
    { year: 2005, efficiency: 30.3, sales: 7660000 },
    { year: 2006, efficiency: 30.1, sales: 7762000 },
    { year: 2007, efficiency: 31.2, sales: 7562000 },
    { year: 2008, efficiency: 31.5, sales: 6769000 },
    { year: 2009, efficiency: 32.9, sales: 5402000 },
    { year: 2010, efficiency: 33.9, sales: 5636000 },
    { year: 2011, efficiency: 33.1, sales: 6093000 },
    { year: 2012, efficiency: 35.3, sales: 7245000 },
    { year: 2013, efficiency: 36.4, sales: 7586000 },
    { year: 2014, efficiency: 36.5, sales: 7708000 },
    { year: 2015, efficiency: 37.2, sales: 7517000 },
    { year: 2016, efficiency: 37.7, sales: 6873000 },
    { year: 2017, efficiency: 39.4, sales: 6081000 },
]

const View = (props) => {
    const [state, dispatch] = useContext(Context);


    // getGenZ().then((response) => {
    //     setGenZData(response.data);
    // }, (err) => console.log(err));

    // if (!state.authenticated) {
    //     console.log('Not Authenticted');
    //     props.history.push('/');
    // }

    // console.log(state.spinnerStat);
    // console.log(state.authenticated);
    // console.log(state.genzCollection);
    // var a = ConvertGenzDataByCategory(state.genzCollection);

    //ViaChanges();
    // useEffect(() => {
    console.log(state.genzCollection);
    console.log(state.drawData);
    //      console.log(state.maxCategory);
    // });

    // for (const key in props.children) {
    //     const componentName = props.children[key].type.name;
    //     console.log("childName: " + componentName);
    // }

    useEffect(() => {
        if (!state.authenticated) {
            props.history.push({
                pathname: '/',
            });
            dispatch({ type: 'setOpenSnack', payload: true });
        }
    });

    const handleClose = (event, reason) => {
        dispatch({ type: 'setLoadingData', payload: false });
    };

    function View() {
        if (state.drawData.length != 0) {
            return <div className="d3Chart">
                <BubbleChart dims={state.dimensions} data={state.drawData} scale={state.scale} />
            </div>
        } else {
            return <div className="d3Chart"> </div>
        }
    }

    return (
        //  <BarChart data={data} />
        <div className="outerLayout">
            <AppBar props={props} />
            <FormControls />
            <View />
            <Snackbar open={state.loadingData} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Please wait, we load data from databse...
                </Alert>
            </Snackbar>
        </div>
    );
};

export default withContext(View);


