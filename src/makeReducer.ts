import { Dispatch } from "redux";

const separator = ':';

type FuncName<T>  = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];

type Reducer<S, P, T = string> = (state: S, payload: P, type: T) => Partial<S>; // TODO 是否可返回部分State？
// type Reducer<S, P, T = string> = (state: S, payload: P, type: T) => S;
type Effect<S, P, PromiseResult> = (payload: P, dispatch: ReduxDispatch, getState: () => S) => Promise<PromiseResult>;
type InvalidMethod = never;

export type ReduxDispatch = Dispatch;

const buildActionType = (modelName: string, type: string) => {
    return modelName + separator + type;
}
const parseActiontype = (reduxType: string) => {
    let separatorIndex = reduxType.indexOf(':'),
        modelName = reduxType.substring(0, separatorIndex),
        actionType = reduxType.substring(separatorIndex + 1);
        
    return [modelName, actionType];
}

type ModelConfig<S> = {
    name: string;
    state: S;
}
export const createModel = <S>(modelConfig: ModelConfig<S>) => {
    const reducers: [string, Reducer<S, unknown, string>][] = [];

    let { name: modelName, state: initialState } = modelConfig;
    
    const rootReducer = (state = initialState, action: { type: string; payload }) => {
        let { type: reduxType, payload } = action,
            parsedArr = parseActiontype(reduxType),
            type = parsedArr[1];

        if (parsedArr[0] !== modelName)
            return state;
            
        let reducer = reducers.find(r => r[0] === type);

        if (reducer)
            return { ...state, ...reducer[1](state, payload, type) };
        else {
            let err = new Error(`action.type = ${reduxType}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }

    const infer = <P>(handler: Reducer<S, P>) => {
        return handler;
    }
    const infer2 = <P, PR>(handler: Effect<S, P, PR>) => {
        return handler;
    }

    type Subscribe = <Reducers, Effects, Mix = Reducers & Effects>(reducers?: Reducers, effects?: Effects) => {
        [k in FuncName<Mix>]: 
            Mix[k] extends Effect<S, infer P, infer PR> ? (payload: P) => (...args: any[]) => Promise<PR> :
            Mix[k] extends Reducer<S, infer P, infer T> ? (payload: P) => { payload: P, type: T } : InvalidMethod
    }
    const subscribe: Subscribe = (rs, effects) => {
        let actions: any = {};

        for (let type in rs) {
            actions[type] = (payload) => {
                return { type: buildActionType(modelName, type), payload };
            }
            reducers.push([type, rs[type] as any]);
        }

        for (let type in effects) {
            let handler = effects[type];
            actions[type] = (payload) => {
                return (...args) => {
                    return typeof handler === 'function' && handler(payload, args[0], args[1]);
                }
            };
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
        infer2,
        // setState,
        reducer: rootReducer,
        subscribe,
    };
}

export const assignActions = <T, A>(target: T, actions: A) => {
    return Object.assign(target, { actions });
}
