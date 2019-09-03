import { addActions, createModel } from "../makeReducer3";

const model = createModel(
    'test3',
    {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    });

let Test3 = addActions(model, {
    a: model.action('a', (state) => {
        return {...state};
    }),
    b: model.action('addLabel', (state, payload: {y: string}) => {
        let newLabel = [...state.label];
    
        newLabel.push(payload.y);
        return { label: newLabel };
    }),
    c: model.asyncAction('c', (payload: string, dispatch, getState) => {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve(payload);
            }, 2000);
        }).then((data) => {
            dispatch(Test3.actions.b({ y: data }));
            return data;
        });
    }),
});

let arr1: [string, number][] = [['a', 1], ['b', 2]];
let arr2 = arr1.map(n => n[0]);

export default Test3;