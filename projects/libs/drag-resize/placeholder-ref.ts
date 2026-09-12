import { TemplateRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';

export class PlaceHolderRef {
  tpl?: TemplateRef<unknown>;
  dropList?: DropListRef;
  element?: HTMLElement;

  private _visible = false;

  attach(
    container: HTMLElement,
    source: HTMLElement,
    reference?: Node | null,
  ): HTMLElement {
    if (!this.element) {
      // Keep the same tag/attributes as the dragged item so selectors such as
      // ".list > article" and grid/flex item rules continue to apply.
      this.element = source.cloneNode(false) as HTMLElement;
      this.element.removeAttribute('id');
      this.element.classList.add('ngx-drag-placeholder');
      this.element.setAttribute('aria-hidden', 'true');
      this.element.setAttribute('inert', '');
      this.element.removeAttribute('tabindex');
    }

    // The placeholder must never inherit a live drag transform/animation.
    this.element.style.setProperty('transform', 'none', 'important');
    this.element.style.setProperty('transition', 'none', 'important');
    this.element.style.setProperty('animation', 'none', 'important');
    this.element.style.setProperty('pointer-events', 'none', 'important');
    this.element.style.setProperty('visibility', 'visible', 'important');
    this.element.style.setProperty('opacity', '0.16', 'important');
    this.element.style.setProperty('outline', '2px dashed currentColor', 'important');
    this.element.style.setProperty('outline-offset', '-2px', 'important');

    this._visible = true;

    if (reference && reference.parentNode === container) {
      if (this.element !== reference) container.insertBefore(this.element, reference);
    } else if (this.element.parentNode !== container) {
      container.appendChild(this.element);
    }

    return this.element;
  }

  detach(): void {
    this.element?.remove();
    this._visible = false;
  }

  get visible(): boolean {
    return this._visible && !!this.element?.isConnected;
  }
}
