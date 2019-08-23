import { connect } from "react-redux";
import React from "react";
import { Reducers } from "./App";
import Test from "./Test";

export default connect(
    (state: any) => ({
        msg: state.test.msg,
    })
)(
    (props: {
        msg: string;
    }) => {
        return <div>
            <input value={props.msg} onChange={e => {
                props['dispatch'](Test.actions.updateMsg({
                    msg: e.target.value
                }));
            }} />
        </div>;
    }
)