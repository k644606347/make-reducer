import { connect } from "react-redux";
import React from "react";
import { Reducers, AppState } from "./App";
import Test from "./Test";
import Test3 from "./Test3";
import { Dispatch } from "redux";
import { ReduxDispatch } from "../makeReducer3";
import { AsyncDispatch } from "../middleware";

type Props = {
    name: string;
    label: string[];
    dispatch: ReduxDispatch & AsyncDispatch;
};

export default connect(
    (state: AppState) => ({
        name: state.page1.test.name,
        label: state.test3.label,
        // label: state.test2.label,
    })
)((props: Props) => {
        return <div> 
            <input value={props.name} onChange={e => {
                props.dispatch(Test.actions.update({
                    name: e.target.value
                }));
            }} />
            <input placeholder="请填写label" onKeyUp={e => {
                console.log(e.keyCode);
                if (e.keyCode !== 13)
                    return;
                props.dispatch(Test3.actions.b({
                    y: e.target['value']
                }));
            }} />
            <button onClick={e => {
                let result = props.dispatch(Test3.asyncs.c(String(Math.random() * 10)));

                result.then(function(data) {
                    console.log(data);
                })
            }}>setTimeout!</button>
            <ol>
                {
                    props.label.map(l => <li>{l}</li>)
                }
            </ol>
        </div>;
    }
)