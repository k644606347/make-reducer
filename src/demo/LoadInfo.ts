export type LoadInfo = {
    loadStatus: 'beforeload' | 'loading' | 'done' | 'error';
    loadMsg: '';
}

const mergeLoadReducers = <S extends LoadInfo>() => {

    type LoadReducer = (state: S, payload: LoadInfo, type) => S;
    const loadStatus: LoadReducer = (state, payload, type) => {
        return { ...state, loadStatus: payload };
    }

    type LoadReducer2 = (state: S, payload: string | undefined, type: string) => S;
    const loadDone: LoadReducer2 = (state, payload) => {
        return { ...state, loadMsg: payload };
    }
    const loadError: LoadReducer2 = (state, payload) => {
        return { ...state, loadMsg: payload };
    }
    const loading: LoadReducer2 = (state, payload) => {
        return { ...state, loadMsg: payload };
    }
    const beforeload: LoadReducer2 = (state, payload) => {
        return { ...state, loadMsg: payload };
    }

    return {
        loadStatus,
        loadDone,
        loadError,
        loading,
        beforeload,
    }
}

export {
    mergeLoadReducers,
}