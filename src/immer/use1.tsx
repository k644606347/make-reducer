import { useReducer } from "react";

export default function use1() {
    let [ state, dispatch ] = useReducer((state) => {
        // console.log(state.x);
        return { x: state.x + 1 };
    }, {x: 1});

    return {state, dispatch};
}