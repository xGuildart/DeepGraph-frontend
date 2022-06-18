import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Context, withContext } from '../../store/Store';
import BubbleChart from '../charts/BubbleChart';
import FormControls from '../components/FormControls';
import LollipopChart from '../charts/LollipopChart';
import FuncControls from './FuncControls';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [state,] = React.useContext(Context);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function ViewGenz() {
        if (state.drawData.length !== 0) {
            return <div className="d3Chart">
                <BubbleChart dims={state.dimensions} data={state.drawData} scale={state.scale} funcs={{ time: state.selectTimeFunc, score: state.selectSSSFunc }} />
            </div>
        } else {
            return <div className="d3Chart"> </div>
        }
    }

    function ViewYoung() {
        if (state.youngCollection.length !== 0) {
            return <div className="d3Chart">
                <LollipopChart dims={state.dimensions} data={state.youngCollection} scale={state.scale} gstate={state} />
            </div>
        } else {
            return <div className="d3Chart"> </div>
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Genz Collection" {...a11yProps(0)} />
                    <Tab label="Young Collection" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <FormControls />
                <ViewGenz />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <FuncControls />
                <ViewYoung />
            </TabPanel>
        </Box>
    );
}

export default withContext(BasicTabs);