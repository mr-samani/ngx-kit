import { ApplicationRef, inject, TemplateRef, type EmbeddedViewRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';

export class PlaceHolderRef {
  tpl?: TemplateRef<unknown>;
  dropList?: DropListRef;
  element?: HTMLElement;

  private _visible = false;
  /**
   * Angular embedded view created from `tpl`.
   */
  private _view?: EmbeddedViewRef<unknown>;

  attach(container: HTMLElement, source: HTMLElement, reference?: Node | null): HTMLElement {
    /**
     * If the placeholder has a template, render the template instead of
     * cloning the dragged element.
     *
     * Example:
     *
     * <span class="placeholder" *ngxPlaceholder></span>
     */
    if (!this.element) {
      if (this.tpl) {
        this._view = this.tpl.createEmbeddedView({});

        // Render bindings inside the embedded view before we move its DOM nodes.
        this._view.detectChanges();

        const element = this._view.rootNodes.find(
          (node): node is HTMLElement => node instanceof HTMLElement,
        );

        if (!element) {
          this._view.destroy();
          this._view = undefined;

          throw new Error(
            'ngxPlaceholder template must contain at least one HTMLElement root node.',
          );
        }

        this.element = element;
      } else {
        /**
         * Backward-compatible fallback:
         * if no ngxPlaceholder template was supplied, keep the old behavior.
         */

        // ".list > article" and grid/flex item rules continue to apply.
        this.element = source.cloneNode(false) as HTMLElement;
        this.element.removeAttribute('id');
        this.element.classList.add('ngx-drag-placeholder');
        this.element.setAttribute('aria-hidden', 'true');
        this.element.setAttribute('inert', '');
        this.element.removeAttribute('tabindex');
      }
    }

    // The placeholder must never inherit a live drag transform/animation. `transform` and
    // `transition` are deliberately NOT forced with !important: the sort session drives them
    // to slide the placeholder (translate3d) to the current insertion slot.
    this.element.style.removeProperty('transform');
    this.element.style.removeProperty('transition');
    this.element.style.removeProperty('will-change');
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

    this._view?.destroy();
    this._view = undefined;

    this.element = undefined;
    this._visible = false;
  }

  get visible(): boolean {
    return this._visible && !!this.element?.isConnected;
  }
}
