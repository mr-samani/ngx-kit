import { TemplateRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';

export class PlaceHolderRef {
  tpl?: TemplateRef<unknown>;
  dropList?: DropListRef;
  element?: HTMLElement;
  private _visible = false;

  attach(container: HTMLElement, reference?: Node | null): HTMLElement {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'ngx-drag-placeholder';
      this.element.setAttribute('aria-hidden', 'true');
      this.element.setAttribute('inert', '');
    }
    this._visible = true;
    if (reference && reference.parentNode === container) container.insertBefore(this.element, reference);
    else container.appendChild(this.element);
    return this.element;
  }

  detach(): void {
    this.element?.remove();
    this._visible = false;
  }

  get visible(): boolean {
    return this._visible;
  }
}
