import "./style.css";
import PubSub from "pubsub-js";
import List from "./modules/list";
import Project from "./modules/project";
import Todo from "./modules/todo";
import DOMstuff from "./modules/DOMstuff";

const DOM = new DOMstuff();
DOM.addNewProjectListener();
DOM.displayModalListener();
DOM.modalSubmitListener();

const todoList = new List();
const newProject = new Project("gym", [
  new Todo("Laundy", "wash the laundry", "02/03/2019", true),
  new Todo("Dog", "Pet the dog", "22/11/2009"),
  new Todo("lmao", "just lmao", "22/03/1902"),
]);

PubSub.subscribe("newProjectDOM", (ev, name) => new Project(name));
PubSub.subscribe("newTodoDOM", (ev, data) => {
  const project = todoList.projects.find((e) => e.name === data.projectSelect);
  project.addTodo(new Todo(data.title, data.desc, data.dueDate, data.completed));
});

window.todoList = todoList;
window.newProject = newProject;
window.project = Project;
window.todo = Todo;
