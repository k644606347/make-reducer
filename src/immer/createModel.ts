const separator = ':';

type FuncName<T>  = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];

type Reducer<S, P = undefined, T = string> = (state: S, payload: P, type: T) => void | S; // TODO 是否可返回部分State？
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

type ReducerActionCreator<P, T> = P extends undefined ? () => {payload: P, type: T} : (payload: P) => { payload: P, type: T };
type EffectActionCreator<P, PR> = P extends undefined ? () => (...args: any[]) => Promise<PR> : (payload: P) => (...args: any[]) => Promise<PR>;
type InferFunc<S, Func> = Func extends Effect<S, infer P, infer PR> ? EffectActionCreator<P, PR> :
                            Func extends Reducer<S, infer P, infer T> ? ReducerActionCreator<P, T> : InvalidMethod;
type Action<T, P> = {
    type: T;
    payload: P;
}
type ModelConfig<S, Reducers, Effects> = {
    namespace: string;
    initialState: S;
    reducers: Reducers;
    effects: Effects;
};
type CreateModel = <S, Reducers, Effects, Mix = Reducers & Effects>(config: ModelConfig<S, Reducers, Effects>) => {
    baseReducer: (state: S, action: Action<string, any>) => S;
    actions: {
        [k in FuncName<Mix>]: InferFunc<S, Mix[k]>
    }
    reducers: Reducers;
}
// type ModelConfig<S> = {
//     name: string;
//     state: S;
//     reducers: Reducers;
//     effects: Effects;
// }
export const createModel: CreateModel = (config) => {
    type ModelState = typeof config.initialState;
    const { namespace: modelName, initialState, reducers, effects } = config,
        _reducers: [string, Reducer<ModelState, any, string>][] = [];
    
    const baseReducer = (state = initialState, action: { type: string; payload }) => {
        let { type: reduxType, payload } = action,
            parsedArr = parseActiontype(reduxType),
            type = parsedArr[1];

        if (parsedArr[0] !== modelName)
            return state;
            
        let reducer = _reducers.find(r => r[0] === type);

        if (reducer)
            return { ...state, ...reducer[1](state, payload, type) };
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
    // const infer = <P>(handler: Reducer<S, P>) => {
    //     return handler;
    // }
    // const inferEffect = <P, PR>(handler: Effect<S, P, PR>) => {
    //     return handler;
    // }

    // type InferFunc<Func> = Func extends Effect<ModelState, infer P, infer PR> ? (payload: P) => (...args: any[]) => Promise<PR> :
    //                         Func extends Reducer<ModelState, infer P, infer T> ? (payload: P) => { payload: P, type: T } : InvalidMethod;

    // type Subscribe = <Reducers, Effects, Mix = Reducers & Effects>(reducers?: Reducers, effects?: Effects) => {
    //     [k in FuncName<Mix>]: InferFunc<Mix[k]>
    // }

    const subscribe = (rs, effects) => {
        let actions: any = {};

        for (let type in rs) {
            actions[type] = (payload) => {
                return { type: buildActionType(modelName, type), payload };
            }
            _reducers.push([type, rs[type] as any]);
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
    
    const actions = subscribe(reducers, effects);
    return {
        // infer,
        // inferEffect,
        // setState,
        baseReducer,
        actions,
        reducers
    };
}

function infer<State>() {
    // type Infer = <P, PR, Func = Reducer<S, P> | Effect<S, P, PR>>(handler: Func) => Func extends Effect<S, infer P, infer PR> ? Effect<S, P, PR> :
    //             Func extends Reducer<S, infer P, infer T> ? Reducer<S, P, T> : InvalidMethod;

    return {
        inferReducer<P = undefined, T = string>(handler: Reducer<State, P, T>) {
            return handler;
        },
        inferEffect<PR, P = undefined>(handler: Effect<State, P, PR>) {
            return handler;
        },
    }
}


type Model1 = {
    x: number;
    y: string;
}
let { inferReducer, inferEffect } = infer<Model1>();

let model1Config = {
    namespace: 'model1',
    initialState: {
        x: 1,
        y: '2'
    } as Model1,
    reducers: {
        setX(state: Model1, payload: Number, type: string) {
            return {...state, x: Number(payload)};
        },
        setY(state: Model1, payload: Model1['y'], type: string) {
            return {...state, y: String(payload)};
        },
        noPayload: inferReducer((state, payload) => {

        }),
        noPayload2(state) {

        }
    },
    effects: {
        delaySetX: inferEffect((payload: Number, dispatch, getState) => {
            return new Promise<Number>((resolve, reject) => {
                resolve(123);
            });
        })
    }
};

let Model1 = createModel(model1Config);
Model1.actions.setX(1);
Model1.actions.setY('xxx');
Model1.actions.delaySetX(1);
Model1.actions.noPayload();
// Model1.actions.noPayload2

type flag = undefined extends never ? true : false;
type flag2 = string extends unknown ? true : false;

export const assignActions = <T, A>(target: T, actions: A) => {
    return Object.assign(target, { actions });
}

type Reducers = Omit<C1, 'state'>;
const inferEffectC1 = () => {

}
class C1 {
    state = {name: 'xxx'}
    setName(name: C1['setName']) {

    }
}