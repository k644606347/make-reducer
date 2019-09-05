export type AsyncDispatch = <PR>(action: (...args: any[]) => any) => Promise<PR>;

function createMiddleware() {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === "function") {
            return action(dispatch, getState);
        }

        return next(action);
    };
}

let asyncMiddleware = createMiddleware();

export default asyncMiddleware;