import { Provider } from "react-redux";

import React from "react";
import Test from "./Test";
import { createStore, combineReducers } from "redux";
import UpdateMsg from "./UpdateMsg";

const reducers = {
    test: Test.reducer
};
const store = createStore(combineReducers(reducers));

export type Reducers = typeof reducers;
export default () => {

    return  (
        <Provider store={store}>
            <UpdateMsg />
        </Provider>
    )
}