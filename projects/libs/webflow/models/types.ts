/**
 * ngx-flowbuilder — مدل‌های پایه
 */

export type FlowAxis = 'row' | 'column';

/** موقعیت درج نسبت به آیتمی که ماوس روی آن است */
export type DropZone =
  | 'before'   // قبل از آیتم، در همان محور چیدمان (مثلاً چپِ آیتم اگر ردیف است)
  | 'after'    // بعد از آیتم، در همان محور چیدمان
  | 'above'    // بالای آیتم؛ یعنی ایجاد ردیف/خط جدید قبل از آن
  | 'below'    // پایین آیتم؛ ایجاد ردیف/خط جدید بعد از آن
  | 'inside';  // نِست‌شدن به‌عنوان فرزند (وقتی آیتم هدف یک container باشد)

export interface DropResult {
  targetId: string;
  zone: DropZone;
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export interface IndicatorState {
  visible: boolean;
  /** خط باریک: 'h' یعنی خط افقی (جدا کردن ردیف‌ها)، 'v' یعنی خط عمودی (جدا کردن کنار هم) */
  orientation: 'h' | 'v' | null;
  x: number;
  y: number;
  length: number;
  /** حالت nest: به‌جای خط، یک کادر دور کل container هایلایت می‌شود */
  highlightRect: Rect | null;
}

export interface DragStartEvent {
  id: string;
  pointerId: number;
  originRect: Rect;
}

export interface DragMoveEvent {
  id: string;
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
}

export interface DragEndEvent {
  id: string;
  drop: DropResult | null;
}

export type ResizeHandlePosition =
  | 'n' | 's' | 'e' | 'w'
  | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizeMoveEvent {
  id: string;
  handle: ResizeHandlePosition;
  width: number;
  height: number;
  /** فقط برای هندل‌های شمال/غرب که مبدأ عنصر هم جابجا می‌شود */
  offsetX: number;
  offsetY: number;
}
