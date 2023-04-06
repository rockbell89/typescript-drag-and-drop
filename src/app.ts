// method decorator
function AutoBind(
  _t: any,
  _k: string | Symbol,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value;
  console.log("originalMethod", originalMethod);
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) {
  let isValid = true; // 기본값은 true

  if (validatable.required) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }
  if (
    validatable.minLength !== undefined &&
    typeof validatable.value === "string"
  ) {
    isValid = isValid && validatable.value.length >= validatable.minLength;
  }
  // 등호가 하나일 경우 null 과 undefined 모두 포함
  if (validatable.maxLength != null && typeof validatable.value === "string") {
    isValid = isValid && validatable.value.length <= validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === "number") {
    isValid = isValid && validatable.value > validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === "number") {
    isValid = isValid && validatable.value > validatable.max;
  }

  return isValid;
}

// class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  // 추상 클래스는 직접 인스턴스화가 이뤄지지 않음
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attatch(insertAtStart);
  }

  private attatch(insertAtBeginnig: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtBeginnig ? "afterbegin" : "beforeend",
      this.element
    );
  }

  // 추상화 메서드는 실제로 구현되지는 않으나 해당 클래스를 상속 받는 모든 클래스에서 추가할 수 있음
  abstract configure?(): void;
  abstract renderContent(): void;
}

enum LIST_TYPE {
  active = "active",
  finished = "finished",
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public people: number,
    public status: LIST_TYPE
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = []; // protected 비공개이면서 상속 가능함

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
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
      LIST_TYPE.active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
// 하나의 상태 관리 객체 -> 싱글톤 패턴
const projectState = ProjectState.getInstance();

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: LIST_TYPE) {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    // rendering
    this.renderContent(); // renderContent 먼저 호출 되고 -> renderProjects() 호출
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li") as HTMLLIElement;
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
  }

  configure(): void {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === LIST_TYPE.active) {
          return project.status === LIST_TYPE.active;
        }
        return project.status === LIST_TYPE.finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PRJECTS";
  }
}
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // form
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    // event
    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDesc = this.descInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    // 유효성 체크
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 3,
    };
    const descValidatable: Validatable = {
      value: enteredDesc,
      required: true,
      minLength: 20,
    };
    const popleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 0,
      max: 10,
    };

    // 입력 필드 빈값 체크
    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(popleValidatable)
    ) {
      alert("입력 값을 확인 해주세요!");
      return; // return 값이 없는 경우 void
    }

    return [enteredTitle, enteredDesc, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      // 튜블은 배열
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      projectState.addPorject(title, desc, people);
      this.clearInputs();
    }
  }
}

const project = new ProjectInput();
const activeProject = new ProjectList(LIST_TYPE.active);
const finishedProject = new ProjectList(LIST_TYPE.finished);
