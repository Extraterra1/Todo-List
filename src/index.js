import './style.css';
import 'toastify-js/src/toastify.css';
import PubSub from 'pubsub-js';
import List from './modules/list';
import Project from './modules/project';
import Todo from './modules/todo';
import DOMstuff from './modules/DOMstuff';

const DOM = new DOMstuff();
DOM.addNewProjectListener();
DOM.displayModalListener();

const todoList = new List();
new Project('House Chores', [
  new Todo('Laundry', 'Do the laundry', '16-01-2023'),
  new Todo('Dog', 'Walk the dog', '22-11-2009', true),
  new Todo('Meals', 'Get the meals ready', '22-03-1902')
]);
new Project('New TOP Project', [new Todo('Comments', 'Remember to write comments', '02-03-2019')]);
new Project('Meetings', [new Todo('Jake', 'Starts @14:00', '22-07-2023')]);

PubSub.subscribe('projectChanged', (ev, name) => localStorage.setItem('list', JSON.stringify(todoList)));
PubSub.subscribe('newProjectDOM', (ev, name) => {
  new Project(name);
});
PubSub.subscribe('newTodoDOM', (ev, data) => {
  const project = todoList.projects.find((e) => e.name === data.projectSelect);
  project.addTodo(new Todo(data.title, data.desc, data.dueDate, data.completed));
});
