
const separator = ':';

type Reducer<S, P, T> = (state: S, payload: P, type: T) => Partial<S>;

const buildActionType = (modelName: string, type: string) => {
    return modelName + separator + type;
}
const parseActiontype = (reduxType: string) => {
    let separatorIndex = reduxType.indexOf(':'),
        modelName = reduxType.substring(0, separatorIndex),
        actionType = reduxType.substring(separatorIndex + 1);
        
    return [modelName, actionType];
}
const createModel = <S>(modelName: string, initialState: S) => {

    const reducers: [string, Reducer<S, unknown, string>][] = [];
    const rootReducer = (state = initialState, action: { type: string; payload }) => {
        let { type: reduxType, payload } = action,
            parsedArr = parseActiontype(reduxType),
            type = parsedArr[1];

        if (parsedArr[0] !== modelName)
            return state;
            
        let reducer = reducers.find(r => r[0] === type);

        if (reducer)
            return reducer[1](state, payload, type);
        else {
            let err = new Error(`action.type = ${reduxType}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }
    
    const createAction = <T extends string, P>(type: T, reducer: (state: S, payload: P, type: T) => Partial<S>) => {
        let action = (payload: P) => {
            return { payload, type: buildActionType(modelName, type) };
        };
        reducers.push([type, reducer]);
        return action;
    }

    const setState = (payload: Partial<S>) => {
        return { payload, type: buildActionType(modelName, 'setState') };
    }
    reducers.push(['setState', (state: S, payload: Partial<S>) => {
        return {...state, ...payload};
    }]);
    return {
        setState,
        reducer: rootReducer,
        action: createAction,
    };
}

const Test3 = createModel(
    'test',
    {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    });

let actions = {
    a: Test3.action('a', (state, payload: {x: string}) => {
        return {...state};
    }),
    b: Test3.action('addLabel', (state, payload: {y: string}) => {
        let newLabel = [...state.label];
    
        newLabel.push(payload.y);
        return { label: newLabel };
    })
};

export {
    Test3,
    actions
}