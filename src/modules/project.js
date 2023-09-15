import PubSub from "pubsub-js";

export default class Project {
  constructor(name, todos) {
    this.todos = [];
    this.name = name;
    PubSub.publish("projectAdded", this);
    if (todos) {
      todos.forEach((e) => this.addTodo(e));
    }
    // PubSub.subscribe("newTodo", this.addTodo);
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
  delete = (todo) => {
    this.todos = this.todos.filter((e) => e != todo);
  };
}
