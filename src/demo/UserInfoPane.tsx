import { connect } from "react-redux";
import React from "react";
import { RootState } from "./App";
import User, { actions, UserModel } from "./User";
import { Dispatch } from "redux";
import { ReduxDispatch } from "../makeReducer";
import { AsyncDispatch } from "../middleware";

type Props = {
    user: UserModel;
    loadStatus: string;
    name: string;
    label: string[];
    dispatch: ReduxDispatch & AsyncDispatch;
};

export default connect(
    (state: RootState) => ({
        user: state.users.user,
        name: state.tests.test.name,
        label: state.users.user.label,
        loadStatus: state.users.user.loadStatus,
        // label: state.test2.label,
    })
)((props: Props) => {
        return <div> 
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
            <p>用户信息: </p>
            <pre>
                {JSON.stringify(props.user, null, 4)}
            </pre>
        </div>;
    }
)