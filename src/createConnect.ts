import { connect, Connect } from "react-redux";

export default function createConnect<S>(appState: S) {
    let proxyConnect = (mapStateToProps, mapDispatchToProps) => {
        return connect();
    };
}