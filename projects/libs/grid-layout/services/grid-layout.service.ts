import { Injectable, computed, effect, signal } from '@angular/core';
import { GridLayoutOptions, IGridLayoutOptions } from '../options/options';
import { normalizeGridItem, GridItemConfig } from '../options/grid-item-config';
import { LayoutOutput } from '../options/layout-output';
import { computeMetrics, leftToCol, placeItem, topToRow, GridMetrics } from '../utils/geometry';
import { compact, maxOccupiedRow, moveItem, trySwap } from '../utils/compaction';
import { isRtl } from 'ngx-kit/drag-resize';

export interface GridItemState {
  id: string;
  config: GridItemConfig;
  element?: HTMLElement;
  dragging?: boolean;
  resizing?: boolean;
}

@Injectable()
export class GridLayoutService {
  readonly options = signal<GridLayoutOptions>(new GridLayoutOptions());
  readonly items = signal<readonly GridItemState[]>([]);
  readonly editMode = signal(true);
  readonly activeId = signal<string | null>(null);
  readonly isInteracting = computed(() => this.activeId() !== null);
  readonly height = computed(() => this.calculateHeight(this.items(), this.options()));
  readonly layout = computed<LayoutOutput[]>(() => this.items().map((x) => ({ id: x.id, ...x.config })));
  readonly columns = computed(() => Math.max(1, Math.floor(this.options().cols)));
  /** Resolves `rtl: 'auto'` against the attached element's *actual* computed direction. */
  readonly rtl = computed(() => this.resolveRtl());
  private rtlTick = signal(0);

  private changeListener?: () => void;
  private layoutListener?: (layout: LayoutOutput[]) => void;
  private startConfig: GridItemConfig | null = null;
  private _element!: HTMLElement;

  constructor() {
    effect(() => {
      // Re-run whenever options or items change so CSS positions always reflect state.
      this.options();
      this.items();
      this.rtlTick();
      if (this._element) this.applyCss();
    });
  }

  connect(onLayout: (layout: LayoutOutput[]) => void): void {
    this.layoutListener = onLayout;
  }
  setOptions(value: Partial<IGridLayoutOptions>): void {
    this.options.update((o) => Object.assign(new GridLayoutOptions(), o, value));
  }
  setEditMode(value: boolean): void {
    this.editMode.set(value);
  }
  setItems(items: GridItemState[]): void {
    this.items.set(items.map((x) => ({ ...x, config: normalizeGridItem(x.config) })));
    this.settle();
    this.emit();
  }
  registerItem(item: GridItemState): void {
    this.items.update((xs) =>
      xs.some((x) => x.id === item.id) ? xs.map((x) => (x.id === item.id ? { ...x, element: item.element } : x)) : [...xs, item],
    );
    this.settle();
  }
  updateItemConfig(id: string, config: GridItemConfig): void {
    this.items.update((xs) => xs.map((x) => (x.id === id ? { ...x, config: normalizeGridItem(config) } : x)));
    this.settle();
  }
  unregisterItem(id: string): void {
    this.items.update((xs) => xs.filter((x) => x.id !== id));
    this.settle();
    this.emit();
  }

  attachElement(el: HTMLElement): void {
    this._element = el;
    this.rtlTick.update((n) => n + 1);
    this.applyCss();
    this.changeListener?.();
  }

  isItemDraggable(item: GridItemState): boolean {
    return this.editMode() && !item.config.static && (item.config.isDraggable ?? true);
  }
  isItemResizable(item: GridItemState): boolean {
    return this.editMode() && !item.config.static && (item.config.isResizable ?? true);
  }

  // ---- Pointer-driven interaction (drag / resize) ----------------------------------

  begin(id: string): void {
    const target = this.items().find((x) => x.id === id);
    this.startConfig = target ? { ...target.config } : null;
    this.activeId.set(id);
  }

  move(id: string, dx: number, dy: number): void {
    const target = this.items().find((x) => x.id === id);
    if (!target?.element) return;
    const next = this.screenToGrid(target, dx, dy);
    this.preview(id, next);
  }

  resize(id: string, out: { width: number; height: number; moveLeft: number; moveTop: number }): void {
    const target = this.items().find((x) => x.id === id);
    if (!target?.element) return;
    const next = this.screenResizeToGrid(target, out);
    this.preview(id, next);
  }

  end(id: string): void {
    if (this.activeId() !== id) return;
    this.settle(id);
    this.activeId.set(null);
    this.startConfig = null;
    this.emit();
  }

  // ---- Keyboard-driven interaction (a11y) -------------------------------------------

  /** Moves an item by whole grid cells — used by arrow-key handling in the item component. */
  moveByCells(id: string, dCols: number, dRows: number): void {
    const target = this.items().find((x) => x.id === id);
    if (!target) return;
    this.begin(id);
    this.preview(id, { ...target.config, x: target.config.x + dCols, y: target.config.y + dRows });
    this.end(id);
  }

  /** Resizes an item by whole grid cells — used by shift+arrow handling in the item component. */
  resizeByCells(id: string, dCols: number, dRows: number): void {
    const target = this.items().find((x) => x.id === id);
    if (!target) return;
    this.begin(id);
    const w = this.clampSize(target.config.w + dCols, target.config.minW, target.config.maxW, this.columns());
    const h = this.clampSize(target.config.h + dRows, target.config.minH, target.config.maxH, Infinity);
    this.preview(id, { ...target.config, w, h });
    this.end(id);
  }

  // ---- Internals ----------------------------------------------------------------------

  private preview(id: string, config: GridItemConfig): void {
    const clamped = this.clamp(config);
    const opt = this.options();

    if (!opt.allowOverlap && opt.swap && this.startConfig) {
      const swapped = trySwap(this.items(), id, this.startConfig, clamped);
      if (swapped) {
        this.items.set(swapped);
        this.applyCss();
        return;
      }
    }

    this.items.update((xs) => xs.map((x) => (x.id === id ? { ...x, config: clamped } : x)));

    if (!opt.allowOverlap && opt.pushItems) {
      const pushed = moveItem(this.items(), id, clamped.x, clamped.y, {
        cols: this.columns(),
        compact: opt.compact === 'none' ? 'vertical' : opt.compact,
        allowOverlap: false,
        maxRows: opt.maxRows,
      });
      this.items.set(pushed);
    }
    this.applyCss();
  }

  private screenToGrid(item: GridItemState, dx: number, dy: number): GridItemConfig {
    const r = item.element!.getBoundingClientRect();
    const containerRect = this._element.getBoundingClientRect();
    const m = this.metrics();
    const rtl = this.rtl();
    const leftPx = r.left + dx - containerRect.left;
    const topPx = r.top + dy - containerRect.top;
    const x = leftToCol(leftPx, item.config.w, m, rtl);
    const y = topToRow(topPx, m);
    return this.clamp({ ...item.config, x, y });
  }

  private screenResizeToGrid(item: GridItemState, out: { width: number; height: number; moveLeft: number; moveTop: number }): GridItemConfig {
    const m = this.metrics();
    const gap = m.gap;
    let w = Math.max(1, Math.round((out.width + gap) / (m.colWidth + gap)));
    let h = Math.max(1, Math.round((out.height + gap) / (m.rowHeight + gap)));
    let x = item.config.x;
    let y = item.config.y;
    // moveLeft/moveTop are physical (viewport) deltas from the resizable directive;
    // moving the item's *start* edge left/up in physical space means, in RTL, that
    // the logical column count grows from the *end* instead — handled by re-deriving
    // x from the resulting physical box rather than from moveLeft directly.
    if (this.rtl()) {
      // 'w' handle grows width to the right physically but that's the grid's logical end;
      // recompute x from the (possibly shifted) physical left edge captured via the element.
      const r = item.element!.getBoundingClientRect();
      const containerRect = this._element.getBoundingClientRect();
      const leftPx = r.left + out.moveLeft - containerRect.left;
      x = leftToCol(leftPx, w, m, true);
    } else {
      if (out.moveLeft) x += Math.round(out.moveLeft / (m.colWidth + gap));
    }
    if (out.moveTop) y += Math.round(out.moveTop / (m.rowHeight + gap));
    return this.clamp({ ...item.config, x, y, w, h });
  }

  private clamp(c: GridItemConfig): GridItemConfig {
    const cols = this.columns();
    const next = { ...c };
    next.w = this.clampSize(next.w, next.minW, next.maxW, cols);
    next.h = this.clampSize(next.h, next.minH, next.maxH, this.options().maxRows ?? Infinity);
    next.x = Math.max(0, Math.min(next.x, cols - next.w));
    next.y = Math.max(0, next.y);
    if (this.options().maxRows) next.y = Math.min(next.y, Math.max(0, this.options().maxRows! - next.h));
    return next;
  }

  private clampSize(size: number, min: number | undefined, max: number | undefined, hardMax: number): number {
    let v = Math.max(min ?? 1, size);
    if (max) v = Math.min(v, max);
    return Math.min(v, hardMax);
  }

  /** Applies pushes on drag-end and, when configured, removes gaps via compaction. */
  private settle(activeId?: string, _preview = false): void {
    const opt = this.options();
    let arr = this.items().map((x) => ({ ...x, config: { ...x.config } }));
    if (!opt.allowOverlap) {
      if (activeId && opt.pushItems) {
        arr = moveItem(arr, activeId, arr.find((x) => x.id === activeId)!.config.x, arr.find((x) => x.id === activeId)!.config.y, {
          cols: this.columns(),
          compact: opt.compact === 'none' ? 'vertical' : opt.compact,
          allowOverlap: false,
          maxRows: opt.maxRows,
        });
      }
      if (opt.compact !== 'none') arr = compact(arr, opt.compact);
    }
    this.items.set(arr);
    this.applyCss();
  }

  private applyCss(): void {
    if (!this._element) return;
    const opt = this.options();
    const m = this.metrics();
    const rtl = this.rtl();
    for (const item of this.items()) {
      if (!item.element) continue;
      const box = placeItem(item.config, m, rtl);
      const style = item.element.style;
      style.position = 'absolute';
      style.left = `${box.left}px`;
      style.top = `${box.top}px`;
      style.width = `${box.width}px`;
      style.height = `${box.height}px`;
      item.element.dataset['gridX'] = String(item.config.x);
      item.element.dataset['gridY'] = String(item.config.y);
      item.element.dataset['gridW'] = String(item.config.w);
      item.element.dataset['gridH'] = String(item.config.h);
    }
    void opt;
  }

  private metrics(): GridMetrics {
    const rect = this._element?.getBoundingClientRect() ?? ({ width: 0 } as DOMRect);
    return computeMetrics(rect.width, this.options());
  }

  private resolveRtl(): boolean {
    const opt = this.options().rtl;
    if (opt === true || opt === false) return opt;
    return this._element ? isRtl(this._element) : false;
  }

  private calculateHeight(items: readonly GridItemState[], o: GridLayoutOptions): number {
    const rows = Math.max(1, maxOccupiedRow(items));
    const m = this._element ? this.metrics() : { rowHeight: o.rowHeight === 'fit' ? 100 : o.rowHeight, gap: o.gap ?? 0, padding: o.padding ?? 0 } as GridMetrics;
    return m.padding * 2 + rows * m.rowHeight + Math.max(0, rows - 1) * m.gap;
  }

  private emit(): void {
    this.layoutListener?.(this.layout());
  }
}
