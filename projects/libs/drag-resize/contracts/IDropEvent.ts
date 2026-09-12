import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';

export interface IDropEvent<T = any> {
  previousIndex: number;
  currentIndex: number;
  item: DragRef<T>;
  container: DropListRef<T>;
  previousContainer: DropListRef<T>;
  isPointerOverContainer?: boolean;
}
