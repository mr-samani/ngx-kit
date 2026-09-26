import { ApplicationRef, TemplateRef, type EmbeddedViewRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';

export class PlaceHolderRef {
  /**
   * Custom placeholder content, from `*ngxPlaceholder` inside the `ngxDropList`. When unset,
   * `attach()` falls back to a shallow clone of the dragged element (previous behaviour).
   *
   * Example:
   *
   *   <div ngxDropList>
   *     <span class="my-placeholder" *ngxPlaceholder></span>
   *     ...
   *   </div>
   */
  tpl?: TemplateRef<unknown>;
  /** Set by `NgxPlaceholder` so the embedded view can join Angular's change-detection tree. */
  appRef?: ApplicationRef;
  dropList?: DropListRef;
  element?: HTMLElement;

  private _visible = false;
  private _view?: EmbeddedViewRef<unknown>;
  /** True once `this.element` was built from `tpl` (as opposed to the fallback clone). */
  private isCustom = false;

  attach(container: HTMLElement, source: HTMLElement, reference?: Node | null): HTMLElement {
    if (!this.element) {
      if (this.tpl) {
        this._view = this.tpl.createEmbeddedView({});
        this.appRef?.attachView(this._view);
        // Render bindings inside the embedded view before we move its DOM nodes.
        this._view.detectChanges();

        const element = this._view.rootNodes.find(
          (node): node is HTMLElement => node instanceof HTMLElement,
        );

        if (!element) {
          this.appRef?.detachView(this._view);
          this._view.destroy();
          this._view = undefined;

          throw new Error(
            'ngxPlaceholder template must contain exactly one HTMLElement root node ' +
              '(other root nodes, if any, are ignored).',
          );
        }

        this.element = element;
        this.isCustom = true;
      } else {
        // Fallback: keep the same tag/attributes as the dragged item so selectors such as
        // ".list > article" and grid/flex item rules continue to apply.
        this.element = source.cloneNode(false) as HTMLElement;
        this.element.removeAttribute('id');
        this.element.classList.add('ngx-drag-placeholder');
        this.element.setAttribute('aria-hidden', 'true');
        this.element.setAttribute('inert', '');
        this.element.removeAttribute('tabindex');
        this.isCustom = false;
      }
    }

    // Safety overrides that apply regardless of who authored the element: it must never
    // inherit a live drag transform/animation (transform/transition are left free for the
    // sort session to drive, translate3d-ing the placeholder to the current insertion slot),
    // never intercept pointer events, and never be display:none.
    this.element.style.removeProperty('transform');
    this.element.style.removeProperty('transition');
    this.element.style.removeProperty('will-change');
    this.element.style.setProperty('animation', 'none', 'important');
    this.element.style.setProperty('pointer-events', 'none', 'important');
    this.element.style.setProperty('visibility', 'visible', 'important');

    if (!this.isCustom) {
      // Only the auto-generated clone gets the default "phantom box" look. A custom
      // *ngxPlaceholder template is styled entirely by the caller.
      this.element.style.setProperty('opacity', '0.16', 'important');
      this.element.style.setProperty('outline', '2px dashed currentColor', 'important');
      this.element.style.setProperty('outline-offset', '-2px', 'important');
    }

    this._visible = true;

    if (reference && reference.parentNode === container) {
      if (this.element !== reference) container.insertBefore(this.element, reference);
    } else if (this.element.parentNode !== container) {
      container.appendChild(this.element);
    }

    return this.element;
  }

  /** True while the currently attached element came from a custom `*ngxPlaceholder` template. */
  get custom(): boolean {
    return this.isCustom;
  }

  detach(): void {
    this.element?.remove();

    if (this._view) {
      this.appRef?.detachView(this._view);
      this._view.destroy();
      this._view = undefined;
    }

    this.element = undefined;
    this._visible = false;
  }

  get visible(): boolean {
    return this._visible && !!this.element?.isConnected;
  }
}
