import { DropListRef } from './drop-list-ref';
export class DropListGroupRef {
  readonly lists = new Set<DropListRef>();
  add(list: DropListRef): void {
    this.lists.add(list);
  }
  remove(list: DropListRef): void {
    this.lists.delete(list);
  }
}
