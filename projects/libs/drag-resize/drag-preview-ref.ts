import { ApplicationRef, TemplateRef, type EmbeddedViewRef } from '@angular/core';
import { isRtl } from './public-api';

/** Above any app chrome (modals, sticky headers) but below the browser's own UI. */
const PREVIEW_Z_INDEX = '2147483000';

export class DragPreviewRef {
  tpl?: TemplateRef<unknown>;
  /** Set by `ngxDragPreview` so the embedded view can join Angular's change-detection tree. */
  appRef?: ApplicationRef;

  element?: HTMLElement;
  isCustom = false;
  private _view?: EmbeddedViewRef<unknown>;
  attach(dragEl: HTMLElement, rect: DOMRect) {
    const doc = dragEl.ownerDocument;
    if (this.tpl) {
      this._view = this.tpl.createEmbeddedView({});

      this.appRef?.attachView(this._view);
      // Render bindings inside the embedded view before we move its DOM nodes.
      this._view.detectChanges();

      const element = this._view.rootNodes.find(
        (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE,
      );

      if (!element) {
        this.appRef?.detachView(this._view);
        this._view.destroy();
        this._view = undefined;
        throw new Error('ngxDragPreview template must contain exactly one HTMLElement root node ');
      }
      this.element = element;
      this.isCustom = true;
    } else {
      this.isCustom = false;

      const preview = dragEl.cloneNode(true) as HTMLElement;
      this.element = preview;
      // Avoid duplicated ids in the document.
      this.element.removeAttribute('id');
      this.element.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
      this.element.classList.add('ngx-drag-preview');
      this.element.setAttribute('aria-hidden', 'true');
      this.element.setAttribute('inert', '');
      Object.assign(this.element.style, {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        boxSizing: 'border-box',
      });
    }
    Object.assign(this.element.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      bottom: 'auto',
      pointerEvents: 'none',
      transition: 'none',
      animation: 'none',
      transform: 'none',
      visibility: 'visible',
      display: this.element.style.display === 'none' ? '' : this.element.style.display,
      willChange: 'transform',
      zIndex: PREVIEW_Z_INDEX,
    });
    if (isRtl(doc.body)) {
      Object.assign(this.element.style, {
        right: `${window.innerWidth - rect.right}px`,
        left: 'auto',
      });
    } else {
      Object.assign(this.element.style, {
        left: `${rect.left}px`,
        right: 'auto',
      });
    }

    doc.body.appendChild(this.element);
    return  this.element
  }

  detach() {
    this.element?.remove();

    if (this._view) {
      this.appRef?.detachView(this._view);
      this._view.destroy();
      this._view = undefined;
    }

    this.element = undefined;
  }
}
