import DemoApp from "./demo/App";
import ReactDOM from "react-dom";
import React from "react";
import './mobx/Demo1';
import Student from "./immer/models/Student";
import MSTTodoList from "./mobx-state-tree/todoList/App";

let wrapper = document.createElement('div');

document.body.append(wrapper);
ReactDOM.render(<>
    <DemoApp></DemoApp>
    <h2>mobx demo</h2>
    <hr/>
    <h2>MSTTodoList</h2>
    <MSTTodoList></MSTTodoList>
</>, wrapper);

let stu = new Student({});