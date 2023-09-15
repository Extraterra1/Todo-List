import PubSub from "pubsub-js";

export default class DOM {
  constructor() {
    PubSub.subscribe("projectAdded", this.renderProjects);
    PubSub.subscribe("projectChanged", this.renderTodos);
  }
  renderProjects = (ev, project) => {
    const projectsDiv = document.querySelector(".projects");
    const selfContainer = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.textContent = project.name;
    selfContainer.appendChild(h1);
    const ul = document.createElement("ul");
    ul.classList.add(project.name);
    selfContainer.appendChild(ul);
    projectsDiv.appendChild(selfContainer);
  };

  renderTodos = (ev, project) => {
    const ul = document.querySelector(`ul.${project.name}`);
    ul.innerHTML = "";
    project.todos.forEach((e) => {
      const li = document.createElement("li");
      li.textContent = e.title;
      ul.appendChild(li);
    });
  };
}
