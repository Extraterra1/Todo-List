import PubSub from "pubsub-js";

export default class Project {
  constructor(name, todos) {
    this.todos = [];
    this.name = name;
    PubSub.publish("projectAdded", this);
    PubSub.subscribe("removedTodo", this.delete);
    if (todos) {
      todos.forEach((e) => this.addTodo(e));
    }
  }

  addTodo = (todo) => {
    this.todos.push(todo);
    PubSub.publish("projectChanged", this);
  };
  edit = (todo, newTodo) => {
    const i = this.todos.findIndex((e) => e == todo);
    this.todos[i] = newTodo;
    return newTodo;
  };
  delete = (ev, todo) => {
    if (todo.project != this.name) return;
    this.todos = this.todos.filter((e) => e.title != todo.title);
    PubSub.publish("projectChanged", this);
  };
}
