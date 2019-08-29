
const separator = ':';

type Reducer<S, P> = (state: S, payload: P) => Partial<S>;
const createStore = <S>(namespace: string, initialState: S) => {

    const reduers: [string, Reducer<S, any>][] = [];
    const rootReducer = (state = initialState, action: { type: string; payload }) => {
        let { type, payload } = action;

        let separatorIndex = type.indexOf(':'),
            n = type.substring(0, separatorIndex),
            realType = type.substring(separatorIndex + 1);

        if (n !== namespace)
            return state;
            
        let reducer = reduers.find(r => r[0] === realType);

        if (reducer)
            return reducer[1](state, payload);
        else {
            let err = new Error(`action.type = ${type}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }
    const createAction = <T extends string, P>(type: T, reducer: (state: S, payload: P) => Partial<S>) => {
        let action = (payload: P) => {
            return { payload, type: namespace + separator + type };
        };
        reduers.push([type, reducer]);
        return action;
    }
    return {
        reducer: rootReducer,
        action: createAction,
    };
}

const Test3 = createStore(
    'test',
    {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    });

let action1 = Test3.action('a', (state, payload: {x: string}) => {
    return {...state};
});
let action2 = Test3.action('addLabel', (state, payload: {y: string}) => {
    let newLabel = [...state.label];

    newLabel.push(payload.y);
    return { label: newLabel };
});

export {
    Test3,
    action1,
    action2,
}