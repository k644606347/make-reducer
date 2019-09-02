import { Provider, connect } from "react-redux";

import React from "react";
import Test from "./Test";
import { createStore, combineReducers, Reducer } from "redux";
import UpdateMsg from "./UpdateMsg";
import { Test2 } from "../makeReducer2";
import { Test3 } from "../makeReducer3";

const reducers = {
    test: Test.reducer,
    // test2: Test2.reducer,
    test3: Test3.reducer,
};

let cr = combineReducers(reducers);

export type AppState = ReturnType<typeof cr>;
const store = createStore(cr);

export type Reducers = typeof reducers;
export default () => {

    return  (
        <Provider store={store}>
            <UpdateMsg />
        </Provider>
    )
}