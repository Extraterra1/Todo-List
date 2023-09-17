import PubSub from "pubsub-js";

export default class DOM {
  constructor() {
    PubSub.subscribe("projectAdded", this.renderProjects);
    PubSub.subscribe("projectChanged", this.renderTodos);
  }
  renderProjects = (ev, project) => {
    const projectGroupHTML = `<div class="todo-group">
            <div class="todo-group-header">
              <h4>${project.name}</h4>
              <ion-icon name="remove-outline"></ion-icon>
            </div>
          </div>`;

    const contentContainer = document.querySelector(".content");
    contentContainer.innerHTML += projectGroupHTML;
  };

  renderTodos = (ev, project) => {
    const ul = document.querySelector(`ul.${project.name}`);
    ul.innerHTML = "";
    project.todos.forEach((e) => {
      const li = document.createElement("li");
      li.textContent = e.title;
      // ul.appendChild(li);
    });
  };

  handleMinimize = function (ev) {
    const parentGroup = this.closest(".todo-group");
    parentGroup.classList.toggle("minimized");
    const children = parentGroup.querySelectorAll(".todo-content");
    children.forEach((e) => e.classList.toggle("hidden"));
    const isMinimizeButton = this.getAttribute("name").includes("remove");
    if (isMinimizeButton) return this.setAttribute("name", "add-outline");
    if (!isMinimizeButton) return this.setAttribute("name", "remove-outline");
  };

  addMinimizeListeners = () => {
    const buttons = document.querySelectorAll(".todo-group-header ion-icon");
    buttons.forEach((e) => e.addEventListener("click", this.handleMinimize));
  };
}
