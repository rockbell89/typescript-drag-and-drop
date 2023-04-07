import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { Validatable, validate } from "../utils/validation.js";
import { Component } from "./base-component.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
