import "./style.css";
import PubSub from "pubsub-js";
import List from "./modules/list";
import Project from "./modules/project";
import Todo from "./modules/todo";
import DOMstuff from "./modules/DOMstuff";

const DOM = new DOMstuff();

const todoList = new List();
const newProject = new Project("gym", [
  new Todo("Laundy", "wash the laundry", "02/03/2019", 4),
  new Todo("Dog", "Pet the dog", "22/11/2009"),
  new Todo("lmao"),
]);

let newTodo = new Todo("Joe", "Mama", "02/03/2219", 2);

console.log(todoList.projects);

let counter = 0;
const addProjectButton = document.querySelector(".addProject");
addProjectButton.addEventListener("click", () => new Project(`test${counter++}`));
