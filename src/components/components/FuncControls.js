import { useState, useEffect, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import { Context } from '../../store/Store';
import { update_stats, update_funcs } from '../charts/LollipopChart';

const FuncControls = () => {
    const [state, dispatch] = useContext(Context);
    const [stats, setStats] = useState(state.stats);
    const [funcs, setFuncs] = useState(state.funcs);

    var handleStats = (e) => {
        var stat = e.target.value;
        setStats(stat);
        update_stats(state.youngCollection, stat);
    }

    var handleFuncs = (e) => {
        var func = e.target.value;
        setFuncs(func);
        update_funcs(state.youngCollection, func);
    }

    const Grid = styled(MuiGrid)(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& [role="separator"]': {
            margin: theme.spacing(0, 2),
        },
    }));

    return (
        <Grid container>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="stats_label">Stats</InputLabel>
                <Select
                    labelId="stats_label"
                    id="stats"
                    value={stats}
                    label="Stats"
                    onChange={handleStats}
                >
                    <MenuItem value={"Logits"}>Logits</MenuItem>
                    <MenuItem value={"Logits_Mean"}>Logits Mean</MenuItem>
                    <MenuItem value={"MA_Logits"}>MA_Logits</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="Funcs_label">Sentiment Network: applied function</InputLabel>
                <Select
                    labelId="Funcs_label"
                    id="funcs"
                    value={funcs}
                    label="Funcs"
                    onChange={handleFuncs}
                >
                    <MenuItem value={"Net_Sent"}>NET SENT</MenuItem>
                    <MenuItem value={"MA_Net_Sent"}>MA NET SENT</MenuItem>
                    <MenuItem value={"MA_NS_EMA@0.1"}>MA NET SENT EMA@0.1</MenuItem>
                    <MenuItem value={"MA_NS_EMA@0.3"}>MA NET SENT EMA@0.3</MenuItem>
                    <MenuItem value={"MA_NS_EMA@0.5"}>MA NET SENT EMA@0.5</MenuItem>
                </Select>
            </FormControl>
        </Grid>
    );
}

export default FuncControls;