import PubSub from "pubsub-js";

export default class Todo {
  constructor(title, description, dueDate, completed = false, priority = 0) {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.dueDate = dueDate;
    this.priority = priority;
    PubSub.publish("newTodo", this);
  }
}
