type AnyObject = {[k in string | number | symbol] : any};

type Reducer<S, Payload> = (
    state: S,
    type: string,
    payload: Payload 
    // action: {
    //     type: string,
    //     payload: Payload,
    // }
) => Partial<S> | undefined;

const makeReducer = <N extends string, State, Action extends string, Payload>({
    namespace,
    initialState,
    reducers,
}: {
    namespace: N;
    initialState: State; 
    reducers: {
        [k in Action]: 
        Reducer<State, Payload>
    };
}) => {
    let actions: {[k in Action]?: (payload: Payload) => { type: string; payload: Payload }} = {};

    for (let name in reducers) {
        actions[name] = (payload) => {
            return { payload, type: namespace + ':' + name };
        }
    }

    return {
        actions: actions as Required<typeof actions>,
        reducer: (
            state: State = initialState, 
            action: {
                type: string;
                payload: Payload;
            }
        ) => {
            let { type, payload } = action,
                separatorIndex = type.indexOf(':'),
                n = type.substring(0, separatorIndex),
                realType = type.substring(separatorIndex + 1),
                reducer: Reducer<State, Payload> | undefined; 

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

            let result = reducer(state, type, payload);

            console.log(result, reducer);
            if (!result)
                return state;
            else 
                return { ...state, ...result };
        }
    }
}

export const Test2 = makeReducer({
    namespace: 'test',
    initialState: {
        name: 'tom',
        id: '5858fccee138233f9d645621',
        label: ['student', 'human'],
    },
    reducers: {
        a(state, type, payload) {
            return {...state};
        },
        update(state, type, {
            // name,
            label
        }: {
            // name: number;
            label?: string;
        }) {
            return { ...state };
        },
        addLabel(state, type, payload) {
            let newLabel = [...state.label];

            newLabel.push(payload.label);
            return { label: newLabel };
        }
    }
});

export default makeReducer;