import { connect } from "react-redux";
import React from "react";
import { Reducers } from "./App";
import Test from "./Test";

export default connect(
    (state: any) => ({
        name: state.test.name,
    })
)(
    (props: {
        name: string;
    }) => {
        return <div>
            <input value={props.name} onChange={e => {
                props['dispatch'](Test.actions.update({
                    name: e.target.value
                }));
            }} />
        </div>;
    }
)