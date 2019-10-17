import { createModel } from "../makeReducer3";

type Test3Model = {
    id: string;
    name: string;
    label: string[];
}
const Test3 = createModel<Test3Model>(
    {
        name: 'Test3',
        state: {
            name: 'tom',
            id: '5858fccee138233f9d645621',
            label: ['student', 'human'],
        }
    }
);

let { subscribe, infer, infer2 } = Test3;

let actions = subscribe(
    {
        setName: infer((state, payload: string) => {
                    return {...state, name: payload};
        }),
        addLabel: infer((state, payload: Test3Model['label']) => {
            return {label: [...state.label, ...payload]};
        }),
        test() {
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

export default Test3;
export { actions };