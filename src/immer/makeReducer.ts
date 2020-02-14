import produce, { Draft } from "immer";

type FuncName<T>  = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];

type ImmerReducer<S, P, T = string> = (state: Draft<S>, payload: P, type: T) => S | void;
type InvalidMethod = never;

export const createModel = <S>() => {
    const reducers: [string, ImmerReducer<S, unknown, string>][] = [];
    
    const baseReducer = (state: S, action: { type: string; payload }) => {
        let { type, payload } = action;
            
        let reducer = reducers.find(r => r[0] === type);

        if (reducer) {
            return produce(state, (draft) => {
                return reducer && reducer[1](draft, payload, type);
            })
        }
        else {
            let err = new Error(`action.type = ${type}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }
    
    const infer = <P = Partial<S>>(handler: ImmerReducer<Draft<S>, P>) => {
        return handler;
    }

    type InferFunc<Func> = Func extends ImmerReducer<S, infer P, infer T> ? (payload: P) => { payload: P, type: T } : InvalidMethod;

    type Subscribe = <Reducers>(reducers?: Reducers) => {
        [k in FuncName<Reducers>]: InferFunc<Reducers[k]>
    }

    const makeReducer: Subscribe = (rss) => {
        let actions: any = {};

        for (let type in rss) {
            actions[type] = (payload) => {
                return { type, payload };
            }
            reducers.push([type, rss[type] as any]);
        }

        return actions;
    }

    // const setState = (payload: Partial<S>) => {
    //     return { payload, type: buildActionType(modelName, 'setState') };
    // }
    // reducers.push(['setState', (state: S, action: { payload: Partial<S>, type: 'setState' }) => {
    //     return {...state, ...action.payload};
    // }]);
    
    return {
        infer,
        // inferEffect,
        // setState,
        baseReducer,
        makeReducer,
    };
}

export const assignActions = <T, A>(target: T, actions: A) => {
    return Object.assign(target, { actions });
}