import { Provider, connect } from "react-redux";

import React from "react";
import { createStore, combineReducers, Reducer } from "redux";
import UpdateMsg from "./UpdateMsg";

import { applyMiddleware } from 'redux';
import User from "./User";
import asyncMiddleware from "../middleware";
import { Test } from "../makeReducer-bak";

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
};

const reducers2 = {
    user: User.reducer,
}

let cr = combineReducers({
    tests: combineReducers(reducers),
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