import { DragRef } from '../drag-ref';
import { DropListRef } from '../drop-list-ref';

export interface IDropEvent<DataType = any> {
  /** Index of the item when it was picked up. */
  previousIndex: number;
  /** Current index of the item. */
  currentIndex: number;
  /** Item that is being dropped. */
  item: DragRef;
  /** Container in which the item was dropped. */
  container: DropListRef<DataType>;
  /** Container from which the item was picked up. Can be the same as the `container`. */
  previousContainer: DropListRef<DataType>;
}
