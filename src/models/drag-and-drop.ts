namespace App {
  // 드래그 이벤트
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  // 드래그 대상 이벤트
  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaeHandler(event: DragEvent): void;
  }
}
