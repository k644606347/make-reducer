import makeReducer from "../makeReducer";

export default makeReducer({
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