export class GridItemConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  /** Item can't be dragged or resized, and never moves during compaction/push. */
  static?: boolean;
  /** Overrides the layout-level draggable/resizable flags for this item only. */
  isDraggable?: boolean;
  isResizable?: boolean;

  constructor(x: number = 0, y: number = 0, w: number = 1, h: number = 1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

export const normalizeGridItem = (value?: Partial<GridItemConfig>): GridItemConfig => ({
  x: Math.max(0, Math.floor(value?.x ?? 0)),
  y: Math.max(0, Math.floor(value?.y ?? 0)),
  w: Math.max(1, Math.floor(value?.w ?? 1)),
  h: Math.max(1, Math.floor(value?.h ?? 1)),
  minW: value?.minW,
  minH: value?.minH,
  maxW: value?.maxW,
  maxH: value?.maxH,
  static: value?.static ?? false,
  isDraggable: value?.isDraggable,
  isResizable: value?.isResizable,
});

/**
 * Value equality for two (already-normalized) configs.
 *
 * This is what breaks the register -> settle -> new-object -> re-register
 * feedback loop: signals compare by *reference*, so anything that recomputes
 * a fresh config object on every change-detection pass (a `computed()` layout,
 * an inline object literal in a template, etc.) will always look "changed" to
 * an `effect()` even when nothing meaningful did. Callers must compare by
 * value before writing back to a signal, otherwise the write itself produces
 * a new reference that trips the same effect again — forever.
 */
export function gridItemConfigsEqual(a: GridItemConfig, b: GridItemConfig): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.w === b.w &&
    a.h === b.h &&
    (a.minW ?? null) === (b.minW ?? null) &&
    (a.minH ?? null) === (b.minH ?? null) &&
    (a.maxW ?? null) === (b.maxW ?? null) &&
    (a.maxH ?? null) === (b.maxH ?? null) &&
    !!a.static === !!b.static &&
    (a.isDraggable ?? null) === (b.isDraggable ?? null) &&
    (a.isResizable ?? null) === (b.isResizable ?? null)
  );
}
