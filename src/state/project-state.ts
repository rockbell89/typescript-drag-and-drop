import { Project, ProjectStatus } from "../models/project.js";

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = []; // protected 비공개이면서 상속 가능함

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
export class ProjectState extends State<Project> {
  private projects: Project[] = []; //
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addPorject(title: string, desc: string, pepole: number) {
    const newProject: Project = new Project(
      Math.random().toString(),
      title,
      desc,
      pepole,
      ProjectStatus.active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const target = this.projects.find((project) => project.id === projectId);
    if (target && target.status !== newStatus) {
      target.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// 하나의 상태 관리 객체 -> 싱글톤 패턴
export const projectState = ProjectState.getInstance();
