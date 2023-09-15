import PubSub from "pubsub-js";

export default class Todo {
  constructor(title, description, dueDate, priority = 0) {
    this.title = title;
    this.description = description;
    this.completed = false;
    this.dueDate = dueDate;
    this.priority = priority;
    PubSub.publish("newTodo", this);
  }
}
