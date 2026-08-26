import { Injectable, computed, effect, signal } from '@angular/core';
import { GridLayoutOptions, IGridLayoutOptions } from '../options/options';
import { normalizeGridItem, GridItemConfig } from '../options/grid-item-config';
import { LayoutOutput } from '../options/layout-output';

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
  readonly layout = computed<LayoutOutput[]>(() =>
    this.items().map((x) => ({ id: x.id, ...x.config })),
  );
  readonly columns = computed(() => Math.max(1, Math.floor(this.options().cols)));
  readonly rtl = computed(() => this.options().rtl === true);

  private changeListener?: () => void;
  private layoutListener?: (layout: LayoutOutput[]) => void;

  constructor() {
    effect(() => {
      this.options();
      this.items();
      this.reflow();
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
    this.resolve();
    this.emit();
  }
  registerItem(item: GridItemState): void {
    this.items.update((xs) =>
      xs.some((x) => x.id === item.id)
        ? xs.map((x) => (x.id === item.id ? { ...x, element: item.element } : x))
        : [...xs, item],
    );
    this.resolve();
  }
  updateItemConfig(id: string, config: GridItemConfig): void {
    this.items.update((xs) =>
      xs.map((x) => (x.id === id ? { ...x, config: normalizeGridItem(config) } : x)),
    );
    this.resolve();
  }
  unregisterItem(id: string): void {
    this.items.update((xs) => xs.filter((x) => x.id !== id));
    this.emit();
  }

  begin(id: string): void {
    this.activeId.set(id);
  }
  move(id: string, dx: number, dy: number): void {
    const target = this.items().find((x) => x.id === id);
    if (!target || !target.element) return;
    const next = this.screenToGrid(target, dx, dy);
    this.preview(id, next);
  }
  resize(
    id: string,
    out: { width: number; height: number; moveLeft: number; moveTop: number },
  ): void {
    const target = this.items().find((x) => x.id === id);
    if (!target || !target.element) return;
    const next = this.screenResizeToGrid(target, out);
    this.preview(id, next);
  }
  end(id: string): void {
    if (this.activeId() !== id) return;
    this.resolve(id);
    this.activeId.set(null);
    this.emit();
  }

  private preview(id: string, config: GridItemConfig): void {
    this.items.update((xs) => xs.map((x) => (x.id === id ? { ...x, config } : x)));
    if (this.options().pushItems && !this.options().allowOverlap) this.resolve(id, true);
    else this.applyCss();
  }

  private screenToGrid(item: GridItemState, dx: number, dy: number): GridItemConfig {
    const r = item.element!.getBoundingClientRect(),
      cell = this.metrics();
    let x = Math.round((r.left + dx - cell.left) / (cell.col + this.options().gap!));
    let y = Math.round((r.top + dy - cell.top) / (cell.row + this.options().gap!));
    if (this.isRtl())
      x = Math.round((cell.right - r.right - dx) / (cell.col + this.options().gap!));
    return this.clamp({ ...item.config, x, y });
  }
  private screenResizeToGrid(
    item: GridItemState,
    out: { width: number; height: number; moveLeft: number; moveTop: number },
  ): GridItemConfig {
    const cell = this.metrics(),
      gap = this.options().gap!;
    let w = Math.max(1, Math.round((out.width + gap) / (cell.col + gap))),
      h = Math.max(1, Math.round((out.height + gap) / (cell.row + gap)));
    let x = item.config.x,
      y = item.config.y;
    if (out.moveLeft) x += Math.round(out.moveLeft / (cell.col + gap));
    if (out.moveTop) y += Math.round(out.moveTop / (cell.row + gap));
    return this.clamp({ ...item.config, x, y, w, h });
  }
  private clamp(c: GridItemConfig): GridItemConfig {
    const cols = this.columns();
    c.w = Math.min(c.w, cols);
    c.x = Math.max(0, Math.min(c.x, cols - c.w));
    c.y = Math.max(0, c.y);
    c.w = Math.max(c.minW ?? 1, c.w);
    c.h = Math.max(c.minH ?? 1, c.h);
    if (c.maxW) c.w = Math.min(c.w, c.maxW);
    if (c.maxH) c.h = Math.min(c.h, c.maxH);
    return c;
  }

  private resolve(activeId?: string, preview = false): void {
    let arr = this.items().map((x) => ({ ...x, config: { ...x.config } }));
    const opt = this.options();
    if (!opt.allowOverlap) {
      const active = arr.find((x) => x.id === activeId);
      const others = arr
        .filter((x) => x.id !== activeId)
        .sort((a, b) => a.config.y - b.config.y || a.config.x - b.config.x);
      if (active && opt.pushItems)
        for (const item of others)
          if (this.collides(active.config, item.config)) this.push(item, active.config, arr);
      if (!preview && opt.compact !== 'none') this.compact(arr, opt.compact);
    }
    this.items.set(arr);
    this.applyCss();
  }
  private push(item: GridItemState, anchor: GridItemConfig, all: GridItemState[]): void {
    let tries = 0;
    while (
      all.some((x) => x.id !== item.id && this.collides(item.config, x.config)) &&
      tries++ < all.length + 10
    ) {
      item.config.y = anchor.y + anchor.h;
      anchor = item.config;
    }
  }
  private compact(arr: GridItemState[], mode: 'vertical' | 'horizontal' | 'both'): void {
    const canX = mode === 'horizontal' || mode === 'both',
      canY = mode === 'vertical' || mode === 'both';
    for (const item of [...arr].sort(
      (a, b) => a.config.y - b.config.y || a.config.x - b.config.x,
    )) {
      if (canY) {
        let y = item.config.y;
        while (
          y > 0 &&
          !arr.some(
            (o) => o.id !== item.id && this.collides({ ...item.config, y: y - 1 }, o.config),
          )
        )
          y--;
        item.config.y = y;
      }
      if (canX) {
        let x = item.config.x;
        while (
          x > 0 &&
          !arr.some(
            (o) => o.id !== item.id && this.collides({ ...item.config, x: x - 1 }, o.config),
          )
        )
          x--;
        item.config.x = x;
      }
    }
  }
  private collides(a: GridItemConfig, b: GridItemConfig): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  private reflow(): void {
    if (this.items().length) {
      this.applyCss();
    }
  }
  private applyCss(): void {
    const opt = this.options(),
      m = this.metrics();
    for (const item of this.items()) {
      if (!item.element) continue;
      const x = this.isRtl()
        ? m.right - (item.config.x + item.config.w) * (m.col + opt.gap!) + opt.gap! / 2
        : m.left + item.config.x * (m.col + opt.gap!);
      const y = m.top + item.config.y * (m.row + opt.gap!);
      const width = item.config.w * m.col + (item.config.w - 1) * opt.gap!;
      const height = item.config.h * m.row + (item.config.h - 1) * opt.gap!;
      item.element.style.position = 'absolute';
      item.element.style.left = `${x - m.left}px`;
      item.element.style.top = `${y - m.top}px`;
      item.element.style.width = `${width}px`;
      item.element.style.height = `${height}px`;
      item.element.dataset['gridX'] = String(item.config.x);
      item.element.dataset['gridY'] = String(item.config.y);
    }
  }
  private metrics() {
    const el = this._element,
      o = this.options(),
      rect = el?.getBoundingClientRect() ?? ({ width: 0, left: 0, top: 0, right: 0 } as DOMRect),
      gap = o.gap ?? 0,
      pad = o.padding ?? 0;
    const col = Math.max(1, (rect.width - pad * 2 - gap * (this.columns() - 1)) / this.columns());
    const row = o.rowHeight === 'fit' ? Math.max(1, col) : o.rowHeight;
    return { left: pad, top: pad, right: rect.width - pad, col, row };
  }
  private _element!: HTMLElement;
  attachElement(el: HTMLElement): void {
    this._element = el;
    this.applyCss();
    if (this.changeListener) this.changeListener();
  }
  private isRtl(): boolean {
    return this.options().rtl === 'auto'
      ? getComputedStyle(this._element).direction === 'rtl'
      : this.options().rtl === true;
  }
  private calculateHeight(items: readonly GridItemState[], o: GridLayoutOptions): number {
    const max = items.reduce((n, x) => Math.max(n, x.config.y + x.config.h), 0);
    const row =
      o.rowHeight === 'fit'
        ? Math.max(1, (this._element?.clientWidth ?? 300) / Math.max(1, o.cols))
        : o.rowHeight;
    return (o.padding ?? 0) * 2 + Math.max(1, max) * row + Math.max(0, max - 1) * (o.gap ?? 0);
  }
  private emit(): void {
    this.layoutListener?.(this.layout());
  }
}
