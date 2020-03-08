import { createModel } from "./makeReducer";

export type Demo1 = {
    name: string;
    id: string;
    desc: string;
    family: {
        mama?: string;
        baba?: string;
    }
}
export const initialState: Demo1 = {
    name: 'x',
    id: 'y',
    desc: 'x an y',
    family: {
        mama: 'X',
        baba: 'Y'
    }
};
export const Demo1 = createModel<Demo1>({
    name: 'demo1',
    state: initialState
});

export const actions = Demo1.subscribe(
    {
        setName: Demo1.infer((state, payload: string, type) => {
            state.name = payload;
        }),
        setID: Demo1.infer((state, payload: string, type) => {
            state.id = payload;
        }),
        setFamily: Demo1.infer((state, payload: Demo1['family'], type) => {
            Object.assign(state.family, payload);
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