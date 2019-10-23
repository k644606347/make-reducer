import App from "./demo/App";
import ReactDOM from "react-dom";
import React from "react";

let wrapper = document.createElement('div');

document.body.append(wrapper);
ReactDOM.render(<App></App>, wrapper);