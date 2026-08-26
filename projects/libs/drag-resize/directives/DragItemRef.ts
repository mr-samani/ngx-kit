import { generateSequentialGuid } from "ngx-kit/shared";

export class DragItemRef {
  boundaryDomRect?: DOMRect;
  _boundary?: HTMLElement;
  el: HTMLElement;

  _domRect!: DOMRect;
  isPlaceholder: boolean = false;
  isDragging: boolean = false;

  dragId: string;

  constructor(el: HTMLElement) {
    this.el = el;
    this.dragId = generateSequentialGuid();
  }
  public get domRect(): DOMRect {
    return new DOMRect(this._domRect.x, this._domRect.y, this._domRect.width, this._domRect.height);
  }

  updateDomRect() {
    this._domRect = this.el.getBoundingClientRect();
    if (this._boundary) {
      this.boundaryDomRect = this._boundary.getBoundingClientRect();
    }
  }
}
