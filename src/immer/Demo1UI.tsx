/* eslint-disable react-hooks/rules-of-hooks */
import { makeAction } from "./makeAction";
import { actions, Demo1, initialState } from "./Demo1";
import React, { useReducer, useState } from "react";
import use1 from "./use1";

export default function Demo1UI() {
    let { state: state1, dispatch: dispatch1 } = use1();
    let [state, dispatch] = makeAction({
        initialState: initialState,
        actions: actions,
        model: Demo1,
    });
    let [state3, setState3] = useState({
        id: 'state3',
        title: '状态3',
        loadStatus: 'beforeload',
    });

    // dispatch.setName('xxx');
    // dispatch.delaySetName('222');
    
    return <div>
            <h2>Demo1</h2>
            <hr/>
            <div onClick={e => {
                dispatch.setName(Math.random() + '');
            }}>{state.name}</div>
            <div dangerouslySetInnerHTML={{__html: '<百度>xxxx</百度>'}}></div>
            <div onClick={e => {
                dispatch.setFamily({
                    mama: state.family.mama + '1',
                });
                // dispatch.delaySetName(state.name + '1');
            }}>click herer! Demo1.state = {JSON.stringify(state)}</div>
            <div onClick={e => {
                setState3({
                    ...state3,
                    loadStatus: 'loading',
                });
                setTimeout(() => {
                    console.log(state3);
                    setState3({
                        ...state3,
                        loadStatus: 'loaded'
                    });
                    console.log(state3);
                }, 3000);
                setTimeout(() => {
                    setState3({
                        ...state3,
                        id: state3.id + '1',
                    });
                }, 1000);
            }}>click here! stat3 = {JSON.stringify(state3)}</div>
    </div>;
}