import { createModel } from "../makeReducer";

export type UserModel = {
    loadStatus: 'beforeload' | 'loading' | 'done' | 'error';
    id: string;
    name: string;
    label: string[];
}
const User = createModel<UserModel>(
    {
        name: 'User',
        state: {
            loadStatus: 'beforeload',
            name: 'tom',
            id: '5858fccee138233f9d645621',
            label: ['student', 'human'],
        }
    }
);

let { subscribe, infer, inferEffect } = User;

let actions = subscribe(
    {
        setName: infer((state, payload: string, type) => {
            return {...state, name: payload};
        }),
        loadStatus: infer((state, payload: UserModel['loadStatus'], type) => {
                return {...state, loadStatus: payload};
        }),
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
            dispatch(actions.loadStatus('loading'));
            return new Promise<string>((resolve, reject) => {
                setTimeout(() => {
                    resolve(payload);
                }, 500);
            }).then((data) => {
                dispatch(actions.loadStatus('done'));
                dispatch(actions.addLabel([payload]));
                return data;
            }).catch(()=> {
                dispatch(actions.loadStatus('error'));
            })
        })
    }
);
// actions.setName(123);
// actions.addLabel([123123]);
// actions.test('222');

export default User;
export { actions };