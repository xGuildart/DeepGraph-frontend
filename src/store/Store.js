import React, { createContext, useReducer, useEffect, useRef } from 'react';
import db from '../storage/pouchdb';
import { GetDataToDrawByNCategory, GetNCategoryBySliceSize } from '../utilities/helper';
import { getGenZ } from '../utilities/restapiconsumer';


const initialState = {
    authenticated: false,
    spinnerStat: false,
    genzCollection: [],
    youngCollection: [],
    drawData: [],
    xAxisWidth: 0,
    dimensions: {},
    timeoutID: 0,
    skip: 0,
    limit: 7000,
    limitConnection: false,
    LIMIT_CONNECTION: 5,
    alreadyRegistred: false,
    selectTimeFunc: "Mean",
    selectSSSFunc: "Mean",
    mountedSVG: false,
    openSnack: false,
    loadingData: true,
    hackCounter: 0,
    hackUnchanged: "unchanged",
    groupedGenz: {},
    byCategory: false,
    nCategory: 1,
    scale: 46,
    stats: "Logits",
    funcs: "Net_Sent",
};

export const Context = createContext(initialState);

export const Store = ({ children }) => {
    const domNode = useRef(null);
    //const mountedBubble = useRef(false);
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'setAuth':
                return { ...state, authenticated: action.payload }
            case 'setDimensions':
                return { ...state, dimensions: action.payload }
            case 'newTimeoutID':
                return { ...state, timeoutID: action.payload }
            case 'toogleSpinnerStat':
                return { ...state, spinnerStat: state.spinnerStat ? false : true }
            case 'fillGenzCollection':
                return { ...state, genzCollection: action.payload, nCategory: GetNCategoryBySliceSize(action.payload, state.skip, state.liimit) }
            case 'setGroupedGenz':
                return {
                    ...state, groupedGenz: action.payload
                }
            case 'setxAxisWidth':
                return { ...state, xAxisWidth: action.payload }
            case 'setDrawData':
                return { ...state, drawData: action.payload }
            case 'setLimit':
                return { ...state, limit: action.payload, nCategory: GetNCategoryBySliceSize(state.genzCollection, state.skip, action.payload) }
            case 'setSkip':
                return { ...state, skip: action.payload, nCategory: GetNCategoryBySliceSize(state.genzCollection, action.payload, state.limit) }
            case 'setScope':
                return { ...state, skip: action.payload.skip, limit: action.payload.limit, nCategory: GetNCategoryBySliceSize(state.genzCollection, action.payload.skip, action.payload.limit) }
            case 'saveStates':
                return {
                    ...state,
                    genzCollection: action.payload,
                    drawData: state.skip < state.limit ? action.payload.slice(state.skip, state.limit) : state.drawData
                }
            case 'saveYoung':
                return { ...state, youngCollection: action.payload }
            case 'setSelectTimeFunc':
                return { ...state, selectTimeFunc: action.payload }
            case 'setSelectSSSFunc':
                return { ...state, selectSSSFunc: action.payload }
            case 'setFuncs':
                return { ...state, selectSSSFunc: action.payload.score, selectTimeFunc: action.payload.time }
            case 'setMountedSVG':
                return { ...state, mountedSVG: action.payload }
            case 'setOpenSnack':
                return { ...state, openSnack: action.payload }
            case 'setLoadingData':
                return { ...state, loadingData: action.payload, hackCounter: state.hackCounter++ }
            case 'set_N_Category':
                return { ...state, nCategory: action.payload, drawData: GetDataToDrawByNCategory(state.genzCollection, action.payload) }
            case 'setScale':
                return { ...state, scale: action.payload }
            case 'renewHack':
                return { ...state, hackCounter: 0, loadingData: true }
            case 'setByCategory':
                return {
                    ...state,
                    byCategory: action.payload
                }
            case 'setStats':
                return { ...state, stats: action.payload }
            case 'setGFuncs':
                return { ...state, funcs: action.payload }
            case 'setLimitConnection':
                return { ...state, limitConnection: action.payload }
            case 'setAlreadyRegistred':
                return { ...state, alreadyRegistred: action.payload }

            default:
                return state
        }
    }, initialState);

    useEffect(() => {
        db.get('_local/genz').then((genz) => {
            //dispatch({ type: 'fillGenzCollection', payload: genz.data });
            //dispatch({ type: 'setMaxCategory', payload: genz.maxCategory });
            //dispatch({ type: 'setDrawData', payload: genz.data.slice(state.skip, state.limit) })
            dispatch({ type: 'saveStates', payload: genz.data })
        }, (_) => { console.log("no _id in db named genz") });
    }, [state.spinnerStat]);

    useEffect(() => {
        if (state.skip < state.limit && !state.byCategory) {
            dispatch({ type: 'setDrawData', payload: state.genzCollection.slice(state.skip, state.limit) });
        }
    }, [state.skip, state.limit]);

    useEffect(() => {
        if (state.genzCollection.length === 0 && state.authenticated) {
            dispatch({ type: 'renewHack' });
            getGenZ().then((response) => {
                dispatch({ type: 'saveStates', payload: response.data })
            });
        }
    }, [state.genzCollection]);


    const getNodeDimensions = () => {
        clearTimeout(state.timeoutID);
        dispatch({
            type: 'newTimeoutID', payload: setTimeout(() => {
                dispatch({ type: 'setDimensions', payload: domNode.current.getBoundingClientRect() });
            }, 300)
        });
    };

    useEffect(() => {
        dispatch({ type: 'setDimensions', payload: domNode.current.getBoundingClientRect() });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', getNodeDimensions);
        return () => { window.removeEventListener('resize', getNodeDimensions) };
    }, []);

    return (
        <div ref={domNode} style={{ height: '100%' }}>
            <Context.Provider value={[state, dispatch]}>
                {children}
            </Context.Provider>
        </div>
    )
};

// here is the consumer;
export const withContext = (ChildComponent) => {
    return (props) => (
        <Context.Consumer>
            {(incomingStates) => (<ChildComponent {...props} states={incomingStates} />)}
        </Context.Consumer>
    )
};