import PubSub from "pubsub-js";

export default class List {
  constructor(arr) {
    this.projects = [];
    if (arr) {
      arr.forEach((e) => this.projects.push(e));
    }
    PubSub.subscribe("projectAdded", this.addProject);
  }
  addProject = (ev, project) => {
    this.projects.push(project);
  };
}
