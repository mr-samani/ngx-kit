import { Injectable } from '@angular/core';
import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';
import { DropListGroupRef } from '../drop-list-group-ref';
import { IPosition } from '../contracts/IPosition';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  readonly dragItemsMap = new Map<HTMLElement, DragRef>();
  readonly dropListsMap = new Map<HTMLElement, DropListRef>();

  itemsSnapshot: { item: DragRef; rect: DOMRect }[] = [];
  listSnapshot: { item: DropListRef; rect: DOMRect }[] = [];

  dropListGroup = new DropListGroupRef();

  clear() {
    this.dragItemsMap.clear();
    this.dropListsMap.clear();
  }

  registerDragItem(d: DragRef) {
    this.dragItemsMap.set(d.el, d);
  }
  removeDragItem(d: DragRef) {
    this.dragItemsMap.delete(d.el);
  }
  registerDropList(l: DropListRef) {
    this.dropListsMap.set(l.el, l);
  }
  removeDropList(l: DropListRef) {
    this.dropListsMap.delete(l.el);
  }

  updateAllRect() {
    for (const list of this.dropListsMap.values()) {
      list.updateDomRect();
      for (const drag of list._draggables.values()) drag.updateDomRect();
    }
    this.listSnapshot = [...this.dropListsMap.values()].map(m => ({ item: m, rect: m.domRect }));
    this.itemsSnapshot = [...this.dragItemsMap.values()].map(m => ({ item: m, rect: m.domRect }));
  }

  getDragItemIndex(drag: DragRef): number {
    if (!drag.dropList) return -1;
    return [...drag.dropList._draggables.values()].findIndex(x => x.el === drag.el);
  }

  getDropListFromPointerPosition(pos: IPosition): DropListRef | undefined {
    return this.listSnapshot.find(w => this._inside(w.rect, pos))?.item;
  }

  private _inside(rect: DOMRect, pos: IPosition): boolean {
    return pos.x >= rect.x && pos.x <= rect.x + rect.width && pos.y >= rect.y && pos.y <= rect.y + rect.height;
  }
}
