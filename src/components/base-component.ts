// class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
