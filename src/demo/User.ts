import { createModel } from "../makeReducer";

type UserModel = {
    id: string;
    name: string;
    label: string[];
}
const User = createModel<UserModel>(
    {
        name: 'User',
        state: {
            name: 'tom',
            id: '5858fccee138233f9d645621',
            label: ['student', 'human'],
        }
    }
);

let { subscribe, infer, infer2 } = User;

let actions = subscribe(
    {
        setName: infer((state, payload: string) => {
                    return {...state, name: payload};
        }),
        addLabel: infer((state, payload: UserModel['label']) => {
            return {label: [...state.label, ...payload]};
        }),
        test() { // 错误的订阅，将无法生成action
            return 123;
        }
    }, 
    {
        // setName: () => {return Promise.resolve('123')},
        delay: infer2((payload: string, dispatch, getState) => {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    resolve(Number(payload));
                }, 2000);
            }).then((data) => {
                dispatch(actions.addLabel(['delay-label']));
                return data;
            });
        })
    }
);

export default User;
export { actions };