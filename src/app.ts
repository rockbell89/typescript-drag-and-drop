/// <reference  path="./models/project.ts"  />
/// <reference  path="./components/project-input.ts"  />
/// <reference  path="./components/project-list.ts"  />

namespace App {
  new ProjectInput();
  new ProjectList(ProjectStatus.active);
  new ProjectList(ProjectStatus.finished);
}
