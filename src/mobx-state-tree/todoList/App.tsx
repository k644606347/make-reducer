import './Store';
import React, { useContext } from 'react';
import { store } from './Store';
import { observer } from "mobx-react";

let TodoListContext = React.createContext(store);

export default function TodoListApp() {
        return <TodoListContext.Provider value={store}>
            {/* <TodoList todos={store.todos}></TodoList>; */}
            <TodoList></TodoList>
        </TodoListContext.Provider>
    }

let TodoList = () => {
    let todoListContext = useContext(TodoListContext);

    return <section>
        <div>
            <button onClick={e => {
                let value = window.prompt('请输入标题') || '';

                todoListContext.addTodo({
                    title: value,
                    done: false,    
                })
            }}>add Todo</button>
        </div>
        <ul>
            {
                todoListContext.todos.map((todo, i) => {
                    return <li key={'todo_' + i} style={{ borderBottom: '.5px dashed #999' }}>
                        <div>
                            <button onClick={e => {
                                todo.toggle();
                            }}>toggle!</button>
                            <button onClick={e => {
                                let value = window.prompt('请输入标题');
                                
                                todo.setTitle(value);
                            }}>setTitle!</button>
                        </div>
                        <p>{todo.title}</p>
                        <p>{todo.done}</p>
                        <pre>{JSON.stringify(todo)}</pre>
                    </li>
                })
            }
        </ul>
    </section>
}
TodoList = observer(TodoList);