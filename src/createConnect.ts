import { connect } from "react-redux";

export default function createConnect<S>(appState: S) {
    return () => {
        return connect;
    }
}