import { connect } from "react-redux";
import React from "react";
import { Reducers, AppState } from "./App";
import User, { actions } from "./User";
import { Dispatch } from "redux";
import { ReduxDispatch } from "../makeReducer";
import { AsyncDispatch } from "../middleware";

type Props = {
    loadStatus: string;
    name: string;
    label: string[];
    dispatch: ReduxDispatch & AsyncDispatch;
};

export default connect(
    (state: AppState) => ({
        name: state.tests.test.name,
        label: state.user.label,
        loadStatus: state.user.loadStatus,
        // label: state.test2.label,
    })
)((props: Props) => {
        return <div> 
            {/* <input value={props.name} onChange={e => {
                props.dispatch(Test.actions.update({
                    name: e.target.value
                }));
            }} /> */}
            <input placeholder="请填写label" id="label-input"/>
            <button disabled={props.loadStatus === 'loading'} onClick={e => {
                let inputNode = document.querySelector<HTMLInputElement>('#label-input');

                props.dispatch(actions.addLabel([inputNode ? inputNode.value : '']));
            }}>立即添加一个label!</button>
            <button disabled={props.loadStatus === 'loading'} onClick={e => {
                let inputNode = document.querySelector<HTMLInputElement>('#label-input');
                let result = props.dispatch(actions.delay(inputNode ? inputNode.value : ''));

                result.then(function(data) {
                    console.log('promise then:', data);
                })
            }}>延迟一段时间后，添加label!</button>
            <p>{props.loadStatus}</p>
            <p>label列表:</p>
            <ol>
                {
                    props.label.map(l => <li>{l}</li>)
                }
            </ol>
        </div>;
    }
)