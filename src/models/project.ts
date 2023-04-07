namespace App {
  export enum ProjectStatus {
    active = "active",
    finished = "finished",
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public desc: string,
      public people: number,
      public status: ProjectStatus
    ) {}
  }
}
