/* eslint-disable react-hooks/rules-of-hooks */
import { useReducer } from "react";
import { AnyObject } from "immer/dist/internal";

export function makeAction<State, Actions extends AnyObject, Model>(config: {
    actions: Actions;
    model: Model;
    initialState: State
}) {
    let [state, reducerDispatch] = useReducer(config.model['baseReducer'], config.initialState);
    let { actions, initialState, model } = config;
    // console.log('model', model);

    let dispatch = {} as any;

    function getState() {
        return state;
    }
    for (let k in actions) {
        dispatch[k] = (payload) => {
            let actionData = actions[k](payload);

            if (typeof actionData === 'function') {
                return actionData(reducerDispatch, getState);
            } else 
                return reducerDispatch(actionData);
        }
    }
    
    return [
        state as State,
        dispatch as {
            [k in keyof Actions]: (...args: Parameters<Actions[k]>) => ReturnType<Actions[k]> extends Function ? ReturnType<Actions[k]> : void;
        },
    ] as const
}