/* eslint-disable react-hooks/rules-of-hooks */
import { makeAction } from "./makeAction";
import { actions, Demo1 } from "./Demo1";
import React, { useReducer } from "react";
import use1 from "./use1";

export default function Demo1UI() {
    let { state: state1, dispatch: dispatch1 } = use1();
    let [state, dispatch] = makeAction({
        initialState: {
            name: 'x',
            id: 'y'
        },
        actions: actions,
        model: Demo1,
    });

    // dispatch.setName('xxx');
    // dispatch.delaySetName('222');
    
    return <div>
            <div onClick={e => {
                dispatch.delaySetName(Math.random() + '');
            }}>{state.name}</div>
            <div onClick={e => {
                dispatch1(1);
            }}>use1.state = {JSON.stringify(state1)}</div>
    </div>;
}