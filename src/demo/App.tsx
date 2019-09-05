import { Provider, connect } from "react-redux";

import React from "react";
import Test from "./Test";
import { createStore, combineReducers, Reducer } from "redux";
import UpdateMsg from "./UpdateMsg";

import { applyMiddleware } from 'redux';
import Test3 from "./Test3";
import asyncMiddleware from "../middleware";

function logger({ getState }) {
    // debugger;
  return next => action => {
    //   debugger;
    console.log('will dispatch', action)

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)

    console.log('state after dispatch', getState())

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}


const reducers = {
    test: Test.reducer,
    // test2: Test2.reducer,
};

const reducers2 = {
    test3: Test3.reducer,
}

let cr = combineReducers({
    page1: combineReducers(reducers),
    ...reducers2,
});

export type AppState = ReturnType<typeof cr>;
const store = createStore(cr, applyMiddleware(asyncMiddleware));

console.log(store);
export type Reducers = typeof reducers;
export default () => {
    return  (
        <Provider store={store}>
            <UpdateMsg />
        </Provider>
    )
}