import { Injectable, computed, effect, signal } from '@angular/core';
import { GridLayoutOptions, IGridLayoutOptions } from '../options/options';
import { normalizeGridItem, gridItemConfigsEqual, GridItemConfig } from '../options/grid-item-config';
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

/** Structural + value equality for two item-state arrays (order-independent). */
function itemsEqual(a: readonly GridItemState[], b: readonly GridItemState[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((itemA) => {
    const itemB = b.find((x) => x.id === itemA.id);
    return !!itemB && itemA.element === itemB.element && gridItemConfigsEqual(itemA.config, itemB.config);
  });
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

  private layoutListener?: (layout: LayoutOutput[]) => void;
  private startConfig: GridItemConfig | null = null;
  private startItems: readonly GridItemState[] | null = null;
  private previewItems = signal<readonly GridItemState[] | null>(null);
  private _element!: HTMLElement;
  private placeholder?: HTMLElement;

  constructor() {
    effect(() => {
      // Re-run whenever options or items change so CSS positions always reflect state.
      this.options();
      this.items();
      this.previewItems();
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
  /**
   * Registers a new item, or refreshes the DOM element reference of one that's
   * already tracked. Adding an item can shift the whole layout (compaction /
   * push), so that path settles. Merely re-supplying the same element on an
   * already-known id has no geometric effect, so it is a deliberate no-op —
   * skipping it is what keeps a per-item `effect()` that calls this on every
   * change-detection pass from re-triggering `settle()` indefinitely.
   */
  registerItem(item: GridItemState): void {
    const existing = this.items().find((x) => x.id === item.id);
    if (!existing) {
      this.items.update((xs) => [...xs, { ...item, config: normalizeGridItem(item.config) }]);
      this.settle();
      return;
    }
    if (existing.element === item.element) return;
    this.items.update((xs) => xs.map((x) => (x.id === item.id ? { ...x, element: item.element } : x)));
  }

  /**
   * Updates an item's config. Only writes the signal and re-settles the layout
   * when the *value* actually changed. Without this guard, any caller that
   * supplies a structurally-equal but referentially-new config object (e.g. a
   * template bound to a `computed()` layout) would cause an unconditional
   * `items.set()` on every run — which produces new output objects, which
   * feed back into that same new config reference, forever.
   */
  updateItemConfig(id: string, config: GridItemConfig): void {
    const normalized = normalizeGridItem(config);
    const existing = this.items().find((x) => x.id === id);
    if (!existing || gridItemConfigsEqual(existing.config, normalized)) return;
    this.items.update((xs) => xs.map((x) => (x.id === id ? { ...x, config: normalized } : x)));
    this.settle();
  }
  unregisterItem(id: string): void {
    this.items.update((xs) => xs.filter((x) => x.id !== id));
    this.settle();
    this.emit();
  }

  /** Called once the grid surface element exists (e.g. from `ngAfterViewInit`). */
  attachElement(el: HTMLElement): void {
    this._element = el;
    this.placeholder = el.querySelector('.ngx-grid-layout__placeholder') as HTMLElement | null ?? undefined;
    if (this.placeholder) {
      this.placeholder.style.position = 'absolute';
      this.placeholder.style.display = 'none';
      this.placeholder.style.pointerEvents = 'none';
      this.placeholder.setAttribute('aria-hidden', 'true');
    }
    // `rtl` reads `this._element` directly (it isn't a signal), so bump a tick
    // signal to force the `rtl` computed to re-evaluate now that the element,
    // and therefore its computed `direction`, is known.
    this.rtlTick.update((n) => n + 1);
    this.applyCss();
  }

  /** Recomputes pixel positions after the surface resizes. Call from a `ResizeObserver`. */
  refreshMetrics(): void {
    this.applyCss();
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
    if (!target) return;

    this.startItems = this.items().map((x) => ({ ...x, config: { ...x.config } }));
    this.startConfig = { ...target.config };
    this.previewItems.set(null);
    this.activeId.set(id);
    this.applyCss();
  }

  move(id: string, x: number, y: number): void {
    const target = this.items().find((x) => x.id === id);
    if (!target?.element) return;
    const next = this.screenToGrid(target, x, y);
   // console.log(x,y,next)
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

    const preview = this.previewItems();
    if (preview) {
      this.items.set(preview.map((x) => ({ ...x, config: { ...x.config } })));
    }

    this.previewItems.set(null);
    this.activeId.set(null);
    this.startConfig = null;
    this.startItems = null;

    // Final normalization/compaction happens only after the preview is committed.
    this.settle(id);
    this.applyCss();
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
    const base = this.startItems;
    if (!base) return;

    const clamped = this.clamp(config);
    const opt = this.options();

    // The placeholder is the moving item during preview. The real DOM element
    // remains under ngxDraggable's control and is never repositioned by the grid.
    let candidate: GridItemState[];

    if (!opt.allowOverlap && opt.swap && this.startConfig) {
      const swapped = trySwap(base, id, this.startConfig, clamped);
      candidate = swapped ?? base.map((x) =>
        x.id === id ? { ...x, config: { ...clamped } } : { ...x, config: { ...x.config } },
      );
    } else {
      candidate = base.map((x) =>
        x.id === id ? { ...x, config: { ...clamped } } : { ...x, config: { ...x.config } },
      );
    }

    if (!opt.allowOverlap && opt.pushItems) {
      candidate = moveItem(candidate, id, clamped.x, clamped.y, {
        cols: this.columns(),
        compact: opt.compact === 'none' ? 'vertical' : opt.compact,
        allowOverlap: false,
        maxRows: opt.maxRows,
      });
    }

    this.previewItems.set(candidate);
    this.applyCss();
  }

  private screenToGrid(item: GridItemState, x: number, y: number): GridItemConfig {
    const containerRect = this._element.getBoundingClientRect();
    const m = this.metrics();
    const rtl = this.rtl();
    const leftPx = x - containerRect.left;
    const topPx = y - containerRect.top;
    const nx = leftToCol(leftPx, item.config.w, m, rtl);
    const ny = topToRow(topPx, m);
    return this.clamp({ ...item.config, x:nx, y:ny });
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
  private settle(activeId?: string): void {
    const opt = this.options();
    const before = this.items();
    let arr = before.map((x) => ({ ...x, config: { ...x.config } }));
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
    // Compaction/push are deterministic pure functions: if they didn't change
    // anything, keep the previous array reference instead of writing an
    // equal-but-new one — that would otherwise ripple into every computed
    // derived from `items` (layout, height, per-item `interactive`, ...) for
    // no reason, and risks re-arming the same feedback loop described above.
    if (itemsEqual(before, arr)) return;
    this.items.set(arr);
    this.applyCss();
  }

  private applyCss(): void {
    if (!this._element) return;

    const source = this.previewItems() ?? this.items();
    const activeId = this.activeId();
    const m = this.metrics();
    const rtl = this.rtl();

    for (const item of source) {
      if (!item.element) continue;

      // While dragging/resizing, the real active element is moved by
      // ngxDraggable/ngxResizable. Never fight those directives by writing
      // left/top/width/height here.
      if (item.id === activeId) continue;

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

    const placeholderItem = activeId ? source.find((x) => x.id === activeId) : undefined;
    if (this.placeholder) {
      if (placeholderItem && activeId) {
        const box = placeItem(placeholderItem.config, m, rtl);
        const style = this.placeholder.style;
        style.display = 'block';
        style.left = `${box.left}px`;
        style.top = `${box.top}px`;
        style.width = `${box.width}px`;
        style.height = `${box.height}px`;
        this.placeholder.dataset['gridX'] = String(placeholderItem.config.x);
        this.placeholder.dataset['gridY'] = String(placeholderItem.config.y);
        this.placeholder.dataset['gridW'] = String(placeholderItem.config.w);
        this.placeholder.dataset['gridH'] = String(placeholderItem.config.h);
      } else {
        this.placeholder.style.display = 'none';
      }
    }
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
    const preview = this.previewItems();
    const source = preview ?? items;
    const rows = Math.max(1, maxOccupiedRow(source));
    const m = this._element ? this.metrics() : { rowHeight: o.rowHeight === 'fit' ? 100 : o.rowHeight, gap: o.gap ?? 0, padding: o.padding ?? 0 } as GridMetrics;
    return m.padding * 2 + rows * m.rowHeight + Math.max(0, rows - 1) * m.gap;
  }

  private emit(): void {
    this.layoutListener?.(this.layout());
  }
}
