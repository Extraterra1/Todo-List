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
    document.querySelectorAll(".todo-group-header ion-icon").forEach((e) => this.addMinimizeListener(e));
  };

  renderTodos = (ev, project) => {
    const projectContainer = Array.from(document.querySelectorAll(".todo-group-header h4"))
      .find((el) => el.textContent === project.name)
      .closest(".todo-group");
    const projectHeader = projectContainer.querySelector(".todo-group-header");
    projectContainer.innerHTML = "";
    projectContainer.appendChild(projectHeader);

    project.todos.forEach((e) => {
      const todoHTML = `<div class="todo-content">
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
      projectContainer.innerHTML += todoHTML;
      const minimizeButton = projectContainer.querySelector(".todo-group-header ion-icon");
      this.addMinimizeListener(minimizeButton);
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

  addMinimizeListener = (button) => {
    button.addEventListener("click", this.handleMinimize);
  };

  addNewProjectListener = function () {
    const button = document.querySelector("#addProject");
    button.addEventListener("click", function (ev) {
      ev.preventDefault();
      const name = document.querySelector("#project").value;
      if (name) PubSub.publish("newProjectDOM", name);
    });
  };

  displayModalListener = () => {
    const plusButton = document.querySelector("button.btn.fixed");
    plusButton.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      const select = modal.querySelector("select");
      const ionIcon = document.querySelector("button.btn.fixed ion-icon");
      ionIcon.classList.toggle("rotate");
      modal.classList.toggle("visible");

      const projects = document.querySelectorAll(".todo-group-header h4");
      projects.forEach((e) => {
        const option = document.createElement("option");
        option.setAttribute("value", e.textContent);
        option.textContent = e.textContent;
        select.appendChild(option);
      });
    });
  };
}
