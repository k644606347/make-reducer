import { createModel } from "../makeReducer";
import { mergeLoadReducers, LoadInfo } from "./LoadInfo";

export type UserModel = {
    id: string;
    name: string;
    label: string[];
} & LoadInfo;

const User = createModel<UserModel>(
    {
        name: 'User',
        state: {
            loadStatus: 'beforeload',
            loadMsg: '',
            name: 'tom',
            id: '5858fccee138233f9d645621',
            label: ['student', 'human'],
        }
    }
);

// let x = (a: number) => {return new Error()};
// let y = (b: number, s: string) => {return new TypeError()};

// x = y;
// let z = y = x;

// type t = typeof x extends typeof y ? true : false;


// let x2 = () => ({name: "Alice"});
// let y2 = () => ({name: "Alice", location: "Seattle"});
// type t2 = typeof x2 extends typeof y2 ? true : false;

// interface Empty<T> {
//     data?: T;
// }
// let x3: Empty<number> = {};
// let y3: Empty<string> = {};

// x3 = y3;
let { subscribe, infer, inferEffect } = User;

let infer1 = infer((state, payload: UserModel['loadStatus'], type) => {
    return {...state, loadStatus: payload};
});
let actions = subscribe(
    {
        setName: (state, payload: string, type) => {
            return {...state, name: payload};
        },
        loadStatus: infer((state, payload: UserModel['loadStatus'], type) => {
                return {...state, loadStatus: payload};
        }),
        ...mergeLoadReducers(),
        addLabel: infer((state, payload: UserModel['label'], type) => {
            return {...state , label: [...state.label, ...payload]};
        }),
        test: infer((state, payload, type) => { // 错误的订阅，将无法生成可调用的action方法
            return {...state};
        })
    }, 
    {
        // setName: () => {return Promise.resolve('123')},
        delay: inferEffect((payload: string, dispatch, getState) => {
            dispatch(actions.loading('loading'));
            return new Promise<string>((resolve, reject) => {
                setTimeout(() => {
                    resolve(payload);
                }, 500);
            }).then((data) => {
                dispatch(actions.loadDone('done'));
                dispatch(actions.addLabel([payload]));
                return data;
            }).catch(()=> {
                dispatch(actions.loadError('error'));
            })
        })
    }
);
// actions.setName(123);
// actions.addLabel([123123]);
// actions.test('222');

export default User;
export { actions };