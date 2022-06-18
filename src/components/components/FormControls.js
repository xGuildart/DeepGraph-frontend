import { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Context } from '../../store/Store';
import { update_data, update_x, update_y } from '../charts/BubbleChart';
import Button from '@mui/material/Button';
import { GetDataToDrawByNCategory, GetNCategoryBySliceSize } from '../../utilities/helper';

const FormControls = () => {
    const [state, dispatch] = useContext(Context);
    const [selectValue2, setSelectValue2] = useState('Mean');
    const [selectValue, setSelectValue] = useState('Mean');
    const [limit_, setLimit_] = useState(7000);
    const [skip_, setSkip_] = useState(0);
    const [option, setOption] = useState("By Interval");
    const [check, setCheck] = useState(false);
    const [nCategory, setNCategory] = useState(state.nCategory);
    const [scale, setScale] = useState(state.scale);
    const [errorText, setErrorText] = useState("");

    var handleOverTimeFunc = (e) => { update_x(e.target.value); setSelectValue2(e.target.value); };
    var handleOverFunc = (e) => { update_y(e.target.value); setSelectValue(e.target.value); };
    var handleSkipChange = (e) => {
        var skip = parseInt(e.target.value);
        if (skip <= limit_) {
            if (!check) {
                update_data(state.genzCollection.slice(skip, limit_), state.dimensions, state.scale, { time: selectValue2, score: selectValue });
                setNCategory(GetNCategoryBySliceSize(state.genzCollection, skip, limit_));
            }

            setSkip_(skip);
            dispatch({
                type: 'setScope', payload: { skip: skip, limit: limit_ }
            });
            dispatch({
                type: 'setFuncs', payload: { time: selectValue2, score: selectValue }
            });
            setErrorText("");
        }
        else {
            setErrorText("Incorrect Entry");
        }

    }
    var handleLimitChange = (e) => {
        var limit = parseInt(e.target.value);
        if (skip_ <= limit) {
            if (!check) {
                update_data(state.genzCollection.slice(skip_, limit), state.dimensions, state.scale, { time: selectValue2, score: selectValue });
                setNCategory(GetNCategoryBySliceSize(state.genzCollection, skip_, limit));
            }

            setLimit_(limit);
            dispatch({
                type: 'setScope', payload: { skip: skip_, limit: limit }
            });
            dispatch({
                type: 'setFuncs', payload: { time: selectValue2, score: selectValue }
            });
            setErrorText("");
        } else {
            setErrorText("Incorrect Entry");
        }
    }
    var toogleOption = () => {
        setOption(option === "By Interval" ? "By Category" : "By Interval");
        setNCategory(state.nCategory);
    }

    var handleOption = (e) => {
        var checked = e.target.checked;

        if (checked) {
            dispatch({ type: 'setByCategory', payload: true });
        } else {
            dispatch({ type: 'setByCategory', payload: false });
        }

        dispatch({
            type: 'setFuncs', payload: { time: selectValue2, score: selectValue }
        });

        setCheck(checked);
        toogleOption();

    }
    var handleCategoryChange = (e) => {
        var nCat = e.target.value;
        if (check) {
            var dd = GetDataToDrawByNCategory(state.genzCollection, nCat);
            update_data(dd, state.dimensions, state.scale, { time: selectValue2, score: selectValue });
            dispatch({ type: 'set_N_Category', payload: nCat });
            dispatch({
                type: 'setFuncs', payload: { time: selectValue2, score: selectValue }
            })
        }
        setNCategory(nCat);
    }

    var handleScaleChange = (e) => {
        var sc = e.target.value;
        setScale(sc);
        dispatch({ type: 'setScale', payload: sc });
    }

    var handleRedraw = (e) => {
        update_data(state.drawData, state.dimensions, state.scale, { time: selectValue2, score: selectValue });
        setOption(option);
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="demo-simple-select-label">Function over time (x)</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="selectButton2"
                    value={selectValue2}
                    label="Function over time"
                    onChange={handleOverTimeFunc}
                >
                    <MenuItem value={"Mean"}>Mean</MenuItem>
                    <MenuItem value={"Median"}>Median</MenuItem>
                    <MenuItem value={"Max"}>Max</MenuItem>
                    <MenuItem value={"Min"}>Min</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 160 }}>
                <InputLabel id="demo-simple-select-label2">Function over SSS (y)</InputLabel>
                <Select
                    labelId="demo-simple-select-label2"
                    id="selectButton"
                    value={selectValue}
                    label="Function over Y"
                    onChange={handleOverFunc}
                >
                    <MenuItem value={"Mean"}>Mean</MenuItem>
                    <MenuItem value={"Median"}>Median</MenuItem>
                    <MenuItem value={"Max"}>Max</MenuItem>
                    <MenuItem value={"Min"}>Min</MenuItem>
                </Select>
            </FormControl>
            <div>
                <TextField
                    id="skip"
                    label="Skip"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={skip_}
                    onChange={handleSkipChange}
                    helperText={errorText}
                    variant="outlined"
                />
                <TextField
                    id="limit"
                    label="Limit"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={limit_}
                    onChange={handleLimitChange}
                    helperText={errorText}
                    variant="outlined"
                />
                <FormControlLabel
                    label={option}
                    control={<Checkbox checked={check} onChange={handleOption} />}
                />
                <TextField
                    id="category"
                    label="N° Category"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={nCategory}
                    onChange={handleCategoryChange}
                    variant="outlined"
                />
            </div>
            {/* <Divider variant="middle" /> */}
            <Box sx={{ my: 3 }}>
                <Button onClick={handleRedraw}>Re-draw</Button>
                <TextField
                    id="zoom"
                    label="Shrink"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={scale}
                    onChange={handleScaleChange}
                    variant="outlined"
                />
            </Box>
        </div>
    )
}


export default FormControls;