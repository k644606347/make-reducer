
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

export const createModel = <S>(modelName: string, initialState: S) => {

    const reducers: [string, Reducer<S, unknown, string>][] = [];
    const rootReducer = (state = initialState, action: { type: string; payload }) => {
        let { type: reduxType, payload } = action,
            parsedArr = parseActiontype(reduxType),
            type = parsedArr[1];

        if (parsedArr[0] !== modelName)
            return state;
            
        let reducer = reducers.find(r => r[0] === type);

        if (reducer)
            return { ...state, ...reducer[1](state, payload, type) };
        else {
            let err = new Error(`action.type = ${reduxType}没有对应的reducer处理函数`);
            console.error(err);
            return state;
        }
    }
    
    const action = <T extends string, P>(type: T, reducer: (state: S, payload: P, type: T) => Partial<S>) => {
        let action = (payload: P) => {
            return { type: buildActionType(modelName, type), payload };
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

    const asyncAction = <T extends string, P, PromiseResult>(type: T, handler: (payload: P, dispatch, getState) => Promise<PromiseResult>) => {
        let action = (payload: P) => {
            return (...args) => {
                return handler(payload, args[0], args[1]);
            }
        };

        return action;
    }
    return {
        setState,
        reducer: rootReducer,
        action,
        asyncAction,
    };
}
    // https://www.tslang.cn/docs/handbook/advanced-types.html
export const addActions = <T, A>(target: T, actions: A) => {
    return Object.assign(target, { actions });
}