import { createModel } from "./makeReducer";

type Demo1 = {
    name: string;
    id: string;
}
export const Demo1 = createModel<Demo1>({
    name: 'demo1',
    state: {
        name: 'x',
        id: 'y'
    }
});

export const actions = Demo1.subscribe(
    {
        setName: Demo1.infer((state, payload: string, type) => {
            return {
                ...state,
                name: payload,
            };
        })
    },
    {
        delaySetName: Demo1.inferEffect((payload: string, dispatch, getState) => {
            console.log('setTimeout before', getState());
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('setTimeout', getState());
                    dispatch(actions.setName(payload));
                    console.log('setName after', getState());
                    resolve(getState());
                }, 3000);
            })
        })
    });