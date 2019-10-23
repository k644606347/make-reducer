import { createStore as createReduxStore, applyMiddleware } from "redux";

import asyncMiddleware from "./middleware";

type CreateStore = typeof createReduxStore;
const makeStore: CreateStore = (reducer) => {
    const store = createReduxStore(reducer, applyMiddleware(asyncMiddleware));
    return store;
}

export {
    makeStore
}
