import produce, { Draft } from "immer";

const separator = ':';

type FuncName<T>  = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];

type Reducer<S, P, T = string> = (state: S, payload: P, type: T) => void | S; // TODO 是否可返回部分State？
// type Reducer<S, P, T = string> = (state: S, payload: P, type: T) => S;
type Effect<S, P, PromiseResult> = (payload: P, dispatch: Dispatch, getState: () => S) => Promise<PromiseResult>;
type InvalidMethod = never;

export type Dispatch = React.Dispatch<{payload: any; type: string}>;

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
    const reducers: [string, Reducer<S | Draft<S>, unknown, string>][] = [],
        patchs: any[] = [];

    let { name: modelName, state: initialState } = modelConfig;
    
    // test
    window[modelName + '_patchs'] = patchs;

    const baseReducer = (state = initialState, action: { type: string; payload }) => {
        let { type: reduxType, payload } = action,
            parsedArr = parseActiontype(reduxType),
            type = parsedArr[1];

        if (parsedArr[0] !== modelName)
            return state;
            
        let reducer = reducers.find(r => r[0] === type);

        if (reducer && reducer[1])
            return produce(state, 
                    (draftState) => { reducer && reducer[1](draftState, payload, type) },
                    function(paths, inversePatches) {
                        patchs.push({paths, inversePatches});
                        console.log(patchs[patchs.length - 1]);
                    }
                );
        else {
            let err = new Error(`action.type = ${reduxType}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }

    // type Infer = <P, PR, Func = Reducer<S, P> | Effect<S, P, PR>>(handler: Func) => Func extends Effect<S, infer P, infer PR> ? Effect<S, P, PR> :
    //             Func extends Reducer<S, infer P, infer T> ? Reducer<S, P, T> : InvalidMethod;
    // const infer: Infer = (handler) => {
    //     return handler as any;
    // }

    // type InferEffect = <P, PR>(handler: Effect<S, P, PR>) => Effect<S, P, PR>;
    // type InferReducer = <P>(handler: Reducer<S, P>) => Reducer<S, P>;
    // type Infer = InferReducer | InferEffect;
    const infer = <P>(handler: Reducer<S, P>) => {
        return handler;
    }
    const inferEffect = <P, PR>(handler: Effect<S, P, PR>) => {
        return handler;
    }

    type InferFunc<Func> = Func extends Effect<S, infer P, infer PR> ? (payload: P) => (...args: any[]) => Promise<PR> :
                            Func extends Reducer<S, infer P, infer T> ? (payload: P) => { payload: P, type: T } : InvalidMethod;

    type Subscribe = <Reducers, Effects, Mix = Reducers & Effects>(reducers?: Reducers, effects?: Effects) => {
        [k in FuncName<Mix>]: InferFunc<Mix[k]>
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
        inferEffect,
        // setState,
        baseReducer,
        subscribe,
    };
}

export const assignActions = <T, A>(target: T, actions: A) => {
    return Object.assign(target, { actions });
}