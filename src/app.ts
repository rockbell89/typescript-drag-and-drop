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
enum LIST_TYPE {
  active = "active",
  finished = "finished",
}

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: LIST_TYPE) {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    // form element
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // rendering
    this.attatch();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PRJECTS";
  }

  private attatch() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }
}
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  // form
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    // form element
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

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

    // rendering
    this.attatch();
  }

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
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attatch() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const project = new ProjectInput();
const activeProject = new ProjectList(LIST_TYPE.active);
const finishedProject = new ProjectList(LIST_TYPE.finished);
