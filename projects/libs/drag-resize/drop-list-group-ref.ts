import { DropListRef } from './drop-list-ref';

/**
 * Groups multiple drop lists so items can be dragged between them without
 * needing an explicit `connectedTo` list on every single one.
 * Lists register themselves automatically when `NgxDropListGroup` wraps them.
 */
export class DropListGroupRef {
  readonly lists = new Set<DropListRef<any>>();

  add(list: DropListRef<any>): void {
    this.lists.add(list);
  }
  remove(list: DropListRef<any>): void {
    this.lists.delete(list);
  }
  has(list: DropListRef<any> | null | undefined): boolean {
    return !!list && this.lists.has(list);
  }
}
