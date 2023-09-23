import PubSub from 'pubsub-js';

export default class Project {
  constructor(name, todos) {
    this.todos = [];
    this.name = name;
    PubSub.publish('projectAdded', this);
    PubSub.subscribe('removedTodo', this.delete);
    PubSub.subscribe('todoEdited', this.edit);
    if (todos) {
      todos.forEach((e) => this.addTodo(e));
    }
  }

  addTodo = (todo) => {
    this.todos.push(todo);
    PubSub.publish('projectChanged', this);
  };

  edit = (ev, { oldTodo, editedTodo }) => {
    const i = this.todos.findIndex((e) => e.title === oldTodo.title);
    if (i === -1) return;
    this.todos[i].title = editedTodo.title;
    this.todos[i].description = editedTodo.desc;
    this.todos[i].completed = editedTodo.completed;
    this.todos[i].dueDate = editedTodo.dueDate;

    PubSub.publish('projectChanged', this);
  };

  delete = (ev, todo) => {
    if (todo.project !== this.name) return;
    this.todos = this.todos.filter((e) => e.title !== todo.title);
    PubSub.publish('projectChanged', this);
  };
}
