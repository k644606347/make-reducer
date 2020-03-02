import Model from "./models/Model";

export type FuncName<T>  = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];

export type Dispatch = React.Dispatch<{payload: any; type: string}>;
export type Reducer<S, P = undefined, T = string> = (payload: P, type: T) => void | S; // TODO 是否可返回部分State？
// type Reducer<S, P, T = string> = (state: S, payload: P, type: T) => S;
export type Effect<Actions, P, PromiseResult> = (actions: Actions, payload: P) => PromiseLike<PromiseResult>;
export type InvalidMethod = never;
export type InferFunc<S, Func> = Func extends Effect<S, infer P, infer PR> ? (payload: P) => PromiseLike<PR> :
                            Func extends Reducer<S, infer P, infer T> ? (payload: P) => void : InvalidMethod;

export function infer<ModelClass extends Model<any>, ModelState, DispatchActions>() {
    // type ModelMethods = Omit<ModelClass, 'state' | 'initialState' | 'namespace'>;
    // type DispatchActions = {
    //     [k in FuncName<ModelClass>]: InferFunc<ModelState, ModelClass[k]>
    // }
    return {
        inferReducer<P = undefined>(handler: Reducer<ModelState, P>) {
            return handler;
        },
        inferEffect<PR, P = undefined>(handler: Effect<DispatchActions, P, PR>) {
            return handler;
        },
    }
}