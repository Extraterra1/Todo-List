import PubSub from 'pubsub-js';

export default class Todo {
  constructor(title, description, dueDate, completed = false) {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.dueDate = dueDate;
    PubSub.publish('newTodo', this);
  }
}
