import PubSub from 'pubsub-js';
import moment from 'moment/moment';
import Toastify from 'toastify-js';

export default class DOM {
  constructor() {
    PubSub.subscribe('projectAdded', this.renderProjects);
    PubSub.subscribe('projectChanged', this.renderTodos);
  }

  renderProjects = (ev, project) => {
    const div = document.createElement('div');
    const projectGroupHTML = `<div class="todo-group">
            <div class="todo-group-header">
              <h4>${project.name}</h4>
              <ion-icon name="remove-outline"></ion-icon>
            </div>
          </div>`;
    div.innerHTML = projectGroupHTML;
    const projectGroupToAdd = div.firstChild;
    const contentContainer = document.querySelector('.content');
    contentContainer.appendChild(projectGroupToAdd);
    document.querySelectorAll('.todo-group-header ion-icon').forEach((e) => this.addMinimizeListener(e));
  };

  renderTodos = (ev, project) => {
    const projectContainer = Array.from(document.querySelectorAll('.todo-group-header h4'))
      .find((el) => el.textContent === project.name)
      .closest('.todo-group');
    const projectHeader = projectContainer.querySelector('.todo-group-header');
    projectContainer.innerHTML = '';
    projectContainer.appendChild(projectHeader);

    project.todos.forEach((e) => {
      const div = document.createElement('div');
      const todoHTML = `<div class="todo-content ${e.completed ? 'completed' : ''}">
              <div class="todo-content-group">
                <ion-icon name="document"></ion-icon>
                <span class="todo-title">${e.title}</span>
              </div>
              <div class="todo-content-group">
                <ion-icon name="reader"></ion-icon>
                <span class="todo-desc">${e.description}</span>
              </div>
              <div class="todo-content-group">
                <ion-icon name="calendar"></ion-icon>
                <span class="todo-due">Due ${e.dueDate}</span>
              </div>
              <div class="todo-content-group">
                <ion-icon name="create"></ion-icon>
                <ion-icon name="trash"></ion-icon>
              </div>
            </div>`;
      div.innerHTML = todoHTML;
      let todoToAdd = div.firstChild;
      const editButton = todoToAdd.querySelector("ion-icon[name='create']");
      const deleteButton = todoToAdd.querySelector("ion-icon[name='trash']");
      editButton.addEventListener('click', this.handleEdit);
      deleteButton.addEventListener('click', this.handleDelete);

      todoToAdd = projectContainer.appendChild(todoToAdd);

      const minimizeButton = projectContainer.querySelector('.todo-group-header ion-icon');

      this.addMinimizeListener(minimizeButton);
    });
  };

  handleDelete = function () {
    const project = this.closest('.todo-group').querySelector('.todo-group-header h4').textContent;
    const todo = this.closest('.todo-content');
    const todoTitle = todo.querySelector('span.todo-title').textContent;

    PubSub.publish('removedTodo', { title: todoTitle, project });
  };

  handleEdit = (ev) => {
    const element = ev.target;
    const todoContainer = element.closest('.todo-content');
    const projectContainer = element.closest('.todo-group');
    const isCompleted = todoContainer.classList.contains('completed');
    const todo = {
      title: todoContainer.querySelector('.todo-title').textContent,
      desc: todoContainer.querySelector('.todo-desc').textContent,
      dueDate: todoContainer.querySelector('.todo-due').textContent.split(' ')[1],
      project: projectContainer.querySelector('.todo-group-header h4').textContent,
      completed: isCompleted
    };

    const modal = document.querySelector('.modal');
    modal.classList.toggle('visible');
    const modalTitle = modal.querySelector('h1');
    modalTitle.textContent = 'Edit Todo';
    const titleInput = modal.querySelector('#title');
    const descInput = modal.querySelector('#desc');
    const dueDateInput = modal.querySelector('#dueDate');
    const projectSelect = modal.querySelector('#projectSelect');
    const completedCheck = modal.querySelector('#completed');
    modal.querySelector('button').remove();

    titleInput.value = todo.title;
    descInput.value = todo.desc;
    dueDateInput.value = moment(todo.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    completedCheck.checked = todo.completed;

    projectSelect.innerHTML = '';
    const projectOption = document.createElement('option');
    projectOption.value = todo.project;
    projectOption.textContent = todo.project;
    projectSelect.appendChild(projectOption);

    const newSubmitButton = document.createElement('button');
    newSubmitButton.textContent = 'Edit';
    newSubmitButton.addEventListener('click', (ev) => {
      const inputs = document.querySelectorAll('.modal input, .modal select');
      inputs.forEach((e) => {
        if (e.id === 'completed') return (inputs[e.id] = e.checked);
        inputs[e.id] = e.value;
      });
      const { title, desc, dueDate, projectSelect, completed } = inputs;
      const editedTodo = { title, desc, dueDate, projectSelect, completed };

      const errors = this.validateNewTodo(editedTodo, { oldTodo: todo });
      if (errors) {
        return errors.forEach((e) => {
          Toastify({
            text: e.msg,
            className: 'toast-danger'
          }).showToast();
        });
      }
      PubSub.publish('todoEdited', { oldTodo: todo, editedTodo });
      modal.classList.toggle('visible');
      return Toastify({
        text: 'Todo Edited',
        className: 'toast-success'
      }).showToast();
    });

    document.querySelector('.btn-submit').appendChild(newSubmitButton);
  };

  handleMinimize = function (ev) {
    const parentGroup = this.closest('.todo-group');
    parentGroup.classList.toggle('minimized');
    const children = parentGroup.querySelectorAll('.todo-content');
    children.forEach((e) => e.classList.toggle('hidden'));
    const isMinimizeButton = this.getAttribute('name').includes('remove');
    if (isMinimizeButton) return this.setAttribute('name', 'add-outline');
    if (!isMinimizeButton) return this.setAttribute('name', 'remove-outline');
  };

  addMinimizeListener = (button) => {
    button.addEventListener('click', this.handleMinimize);
  };

  addNewProjectListener = function () {
    const button = document.querySelector('#addProject');
    const form = button.closest('form');

    button.addEventListener('click', function (ev) {
      ev.preventDefault();
      const name = document.querySelector('#project').value;

      if (name) {
        PubSub.publish('newProjectDOM', name);
        Toastify({
          text: `Project <strong>${name}</strong> added`,
          escapeMarkup: false,
          className: 'toast-success'
        }).showToast();
      }
      if (!name) {
        Toastify({
          text: 'Project name cannot be blank',
          className: 'toast-danger'
        }).showToast();
      }

      form.reset();
    });
  };

  displayModalListener = () => {
    const plusButton = document.querySelector('button.btn.fixed');
    plusButton.addEventListener('click', () => {
      const modal = document.querySelector('.modal');
      const form = modal.querySelector('form');
      form.reset();
      modal.querySelector('h1').textContent = 'Add New Todo';
      modal.querySelector('.btn-submit button').remove();
      const select = modal.querySelector('select');
      const ionIcon = document.querySelector('button.btn.fixed ion-icon');
      ionIcon.classList.toggle('rotate');
      modal.classList.toggle('visible');
      select.innerHTML = '';
      const newSubmitButton = document.createElement('button');
      newSubmitButton.textContent = 'Submit';
      modal.querySelector('.btn-submit').appendChild(newSubmitButton);

      const projects = document.querySelectorAll('.todo-group-header h4');
      projects.forEach((e) => {
        const option = document.createElement('option');
        option.setAttribute('value', e.textContent);
        option.textContent = e.textContent;
        select.appendChild(option);
      });
      this.modalSubmitListener();
    });
  };

  modalSubmitListener = () => {
    const submitButton = document.querySelector('.btn-submit button');
    const DOM = this;
    submitButton.addEventListener('click', function (e) {
      e.preventDefault();
      const modal = this.closest('.modal');
      const inputs = modal.querySelectorAll('input, select');
      inputs.forEach((e) => {
        if (e.id === 'completed') return (inputs[e.id] = e.checked);
        inputs[e.id] = e.value;
      });
      let { title, desc, dueDate, projectSelect, completed } = inputs;
      if (!moment(dueDate).isValid()) dueDate = moment().format('DD-MM-YYYY');
      const newTodo = { title, desc, dueDate, projectSelect, completed };

      const errors = DOM.validateNewTodo(newTodo);
      if (errors) {
        return errors.forEach((e) => {
          Toastify({
            text: e.msg,
            className: 'toast-danger'
          }).showToast();
        });
      }
      PubSub.publish('newTodoDOM', newTodo);
      modal.classList.toggle('visible');
      const ionIcon = document.querySelector('button.btn.fixed ion-icon');
      ionIcon.classList.toggle('rotate');
      return Toastify({
        text: 'Todo Added',
        className: 'toast-success'
      }).showToast();
    });
  };

  validateNewTodo = (inputs, { oldTodo } = false) => {
    const list = JSON.parse(localStorage.getItem('list'));
    const project = list.projects.find((e) => e.name === inputs.projectSelect);
    const errors = [];
    if (oldTodo) project.todos = project.todos.filter((e) => e.title !== oldTodo.title);

    const isTodoTitleUnique = !project.todos.find((e) => e.title === inputs.title);
    if (!isTodoTitleUnique) errors.push({ err: 'not unique', msg: 'Todo Title must be unique' });

    if (!inputs.desc) errors.push({ err: 'no desc', msg: 'Description cannot be empty' });

    if (errors.length > 0) return errors;
  };
}
