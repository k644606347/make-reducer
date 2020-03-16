import { types, onSnapshot, SnapshotIn, SnapshotOut } from "mobx-state-tree"

const Todo = types
    .model("Todo", {
        title: types.string,
        done: types.optional(types.boolean, false),
    })
    .actions(self => ({
        toggle() {
            self.done = !self.done
        },
        setTitle(title) {
            self.title = title;
        }
    }))

const Store = types.model("Store", {
    todos: types.array(Todo)
}).actions(self => ({
    addTodo(todo: SnapshotOut<typeof Todo>) {
        self.todos.push(todo);
    }
}));

// create an instance from a snapshot
const store = Store.create({
    todos: [
        {
            title: "Get coffee"
        }
    ]
})

// listen to new snapshots
onSnapshot(store, snapshot => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ title: "Get coffee", done: true }]}`

export {
    store,
    Store
};