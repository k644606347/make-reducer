import { Provider, connect } from "react-redux";
import { makeStore } from '../store';

import React from "react";
import { combineReducers } from "redux";
import UpdateMsg from "./UserInfoPane";

import { applyMiddleware } from 'redux';
import User from "./User";
import asyncMiddleware from "../middleware";
import { Test } from "../makeReducer-bak";
import Demo1UI from "../immer/Demo1UI";

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
    user: User.baseReducer,
}

let rootReducer = combineReducers({
    tests: combineReducers(reducers),
    users: combineReducers(reducers2),
});

export type RootState = ReturnType<typeof rootReducer>;

const store = makeStore(rootReducer, applyMiddleware(asyncMiddleware));

console.log(store);
export default () => {
    return  (
        <Provider store={store}>
            <UpdateMsg />
            <Demo1UI />
        </Provider>
    )
}