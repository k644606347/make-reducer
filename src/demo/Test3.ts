import { assignActions, createModel, assignAsyncs } from "../makeReducer3";

const model = createModel(
    'test3',
    {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    });

let { action, async } = model;

const model2 = assignActions(model, {
    a: action('a', (state) => {
        return {...state};
    }),
    b: action('addLabel', (state, payload: {y: string}) => {
        let newLabel = [...state.label];
    
        newLabel.push(payload.y);
        return { label: newLabel };
    }),
});

const c = async((payload: string, dispatch, getState) => {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            resolve(payload);
        }, 2000);
    }).then((data) => {
        dispatch(model2.actions.b({ y: data }));
        return data;
    });
});

const Test3 = assignAsyncs(model2, {
    c,
});

let arr1 = ['x','y'];

let obj1 = {
    [arr1[1]]:arr1[1]
}
export default Test3;