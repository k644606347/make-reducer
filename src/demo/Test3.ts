import { addActions, createModel } from "../makeReducer3";

const model = createModel(
    'test3',
    {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    });

let Test3 = addActions(model, {
    a: model.addReducer('a', (state, payload: {x: string}) => {
        return {...state};
    }),
    b: model.addReducer('addLabel', (state, payload: {y: string}) => {
        let newLabel = [...state.label];
    
        newLabel.push(payload.y);
        return { label: newLabel };
    }),
    c: model.addThunk('c', (payload: string, dispatch, getState) => {
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

export default Test3;