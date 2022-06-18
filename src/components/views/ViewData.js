import { useEffect, useContext, forwardRef } from 'react';
import AppBar from '../components/AppBar';
import Tabs from '../components/Tabs';
import { Context, withContext } from '../../store/Store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const View = (props) => {
    const [state, dispatch] = useContext(Context);

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


    return (
        <div className="outerLayout">
            <AppBar props={props} />
            <Tabs />
            <Snackbar open={state.loadingData} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Please wait, we load data from database...
                </Alert>
            </Snackbar>
        </div>
    );
};

export default withContext(View);


