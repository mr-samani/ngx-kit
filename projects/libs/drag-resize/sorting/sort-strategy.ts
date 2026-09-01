import { DragRef } from '../drag-ref';

export interface SortResult {
  previousIndex: number;
  currentIndex: number;
}

export interface SortStrategy {
  start(items: readonly DragRef[]): void;
  enter(drag: DragRef, x: number, y: number): void;
  sort(drag: DragRef, x: number, y: number): SortResult | null;
  reset(): void;
}
