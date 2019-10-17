type Reducer<S> = (
    state: S, 
    action: {
        type: string,
    } & Partial<S>
) => Partial<S> | undefined;

const makeReducer = <N extends string, S, Action extends string | symbol | number>({
    namespace,
    initialState,
    reducers,
}: {
    namespace: N;
    initialState: S, 
    reducers: {
        [k in Action]: 
        Reducer<S>
    },
}) => {
    let actions: {[k in Action]?: (s: Partial<S>) => {type: string} & Partial<S>} = {};

    for (let name in reducers) {
        actions[name] = (s: Partial<S>) => {
            return { ...s, type: namespace + ':' + name };
        }
    }

    return {
        actions: actions as Required<typeof actions>,
        reducer: (state: S = initialState, action: {
            type: string;
        } & Partial<S>) => {
            let { type } = action,
                separatorIndex = type.indexOf(':'),
                n = type.substring(0, separatorIndex),
                realType = type.substring(separatorIndex + 1),
                reducer: Reducer<S> | undefined; 

            if (n !== namespace)
                return state;

            for (let name in reducers) {
                if (name === realType) {
                    reducer = reducers[name];
                }
            }
    
            // TODO action未匹配到reducer函数，是否该throw Error?
            if (!reducer) {
                let err = new Error(`action:${action}没有对应的reducer处理函数`);
                console.error(err);
                return state;
            }

            let result = reducer(state, action);

            console.log(result, reducer);
            if (!result)
                return state;
            else 
                return { ...state, ...result };
        }
    }
}

export default makeReducer;

const Test = makeReducer({
    namespace: 'test',
    initialState: {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    },
    reducers: {
        update(state, action) {
            let { type, ...rest } = action;

            return { ...rest };
        },
        addLabel(state, action) {
            let { label } = action;

            if (!label) {
                return;
            }
            return { label: [...state.label, ...label] };
        }
    }
});

export { Test };