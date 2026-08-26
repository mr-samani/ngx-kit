import { TemplateRef } from '@angular/core';
import { DropListRef } from './drop-list-ref';
import { DragRef } from './drag-ref';

export class PlaceHolderRef {
  tpl?: TemplateRef<any>;
  dropList?: DropListRef | null;
  el?: HTMLElement;

  getElement(dragItem: DragRef): HTMLElement {
    if (this.tpl) {
      const ctx = { width: dragItem.domRect.width, height: dragItem.domRect.height };
      const view = this.tpl.createEmbeddedView(ctx);
      view.detectChanges();
      this.el = view.rootNodes[0] as HTMLElement;
    } else if (!this.el) {
      const ph = dragItem.el.cloneNode(false) as HTMLElement;
      ph.removeAttribute('id');
      ph.classList.add('ngx-drag-placeholder');
      ph.style.background = '#3fccff69';
      ph.style.border = '1px dashed #000';
      ph.style.visibility = 'hidden';
      ph.style.pointerEvents = 'none';
      ph.style.transition = 'none';
      ph.style.opacity = '0';
      ph.style.transform = '';
      ph.style.boxSizing = 'border-box';
      ph.style.width = dragItem.domRect.width + 'px';
      ph.style.height = dragItem.domRect.height + 'px';
      this.el = ph;
    }
    return this.el!;
  }

  remove() {
    this.el?.remove();
    this.el = undefined;
  }

  // private isFlexibleAndWrap(el: HTMLElement) {
  //   const styles = window.getComputedStyle(el);
  //   return styles.display == 'flex' && styles.flexWrap == 'wrap';
  // }
}
