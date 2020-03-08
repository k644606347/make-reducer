import App from "./demo/App";
import ReactDOM from "react-dom";
import React from "react";
import './mobx/Demo1';
import Student from "./immer/models/Student";

let wrapper = document.createElement('div');

document.body.append(wrapper);
ReactDOM.render(<>
    <App></App>
    <h2>mobx demo</h2>
    <hr/>
</>, wrapper);

let stu = new Student({});