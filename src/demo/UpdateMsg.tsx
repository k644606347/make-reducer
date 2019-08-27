import { connect } from "react-redux";
import React from "react";
import { Reducers } from "./App";
import Test from "./Test";
import { Test2 } from "../makeReducer2";


Test2.actions.update({ label: 'tom2' });

export default connect(
    (state: any) => ({
        name: state.test.name,
        label: state.test2.label,
    })
)(
    (props: {
        name: string;
        label: string[];
    }) => {
        return <div>
            <input value={props.name} onChange={e => {
                props['dispatch'](Test.actions.update({
                    name: e.target.value
                }));
            }} />
            <input placeholder="请填写label" onKeyUp={e => {
                console.log(e.keyCode);
                if (e.keyCode !== 13)
                    return;
                props['dispatch'](Test2.actions.addLabel({
                    label: e.target['value']
                }));
            }} />
            <ol>
                {
                    props.label.map(l => <li>{l}</li>)
                }
            </ol>
        </div>;
    }
)