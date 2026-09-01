import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GridLayoutService } from '../services/grid-layout.service';
import { GridItemConfig } from '../options/grid-item-config';
import { NgxDraggable, NgxResizable } from 'ngx-kit/drag-resize';

@Component({
  selector: 'ngx-grid-item',
  standalone: true,
  hostDirectives: [
    { directive: NgxDraggable, inputs: ['dragHandle', 'lockAxis'], outputs: [] },
    NgxResizable,
  ],
  template: `
    <ng-content />
  `,
  host: {
    '[style.position]': '"absolute"',
    '[style.display]': '"block"',
    '[style.boxSizing]': '"border-box"',
    '[style.transition]': 'transitionStyle()',
    '[class.ngx-grid-item--dragging]': 'dragging()',
    '[class.ngx-grid-item--resizing]': 'resizing()',
    '[class.ngx-grid-item--static]': 'config().static',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '[attr.aria-grabbed]': 'dragging()',
    '[attr.data-grid-id]': 'itemId()',
    '(keydown)': 'onKeyDown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridItemComponent implements OnInit, OnDestroy {
  /** Bound as `[id]` in templates (matches the demo app's existing usage). */
  readonly itemId = input<string | undefined>(undefined, { alias: 'id' });
  readonly config = input<GridItemConfig>({ x: 0, y: 0, w: 1, h: 1 });
  readonly layoutChange = output<GridItemConfig>();

  readonly dragging = signal(false);
  readonly resizing = signal(false);
  readonly active = computed(() => this.dragging() || this.resizing());
  readonly transitionStyle = computed(() =>
    !this.active() && this.service.options().animate
      ? 'left .18s ease, top .18s ease, width .18s ease, height .18s ease'
      : 'none',
  );
  readonly interactive = computed(() => {
    const id = this.itemId();
    const item = id ? this.service.items().find((x) => x.id === id) : undefined;
    return !!item && (this.service.isItemDraggable(item) || this.service.isItemResizable(item));
  });

  private readonly service = inject(GridLayoutService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly drag = inject(NgxDraggable);
  private readonly resize = inject(NgxResizable);

  constructor() {
    this.drag.dragStart.subscribe(() => this.onDragStart());
    this.drag.dragMove.subscribe((v) => this.onDragMove(v));
    this.drag.dragEnd.subscribe(() => this.onDragEnd());
    this.resize.resizeStart.subscribe(() => this.onResizeStart());
    this.resize.resizeMove.subscribe((v) => this.onResizeMove(v));
    this.resize.resizeEnd.subscribe(() => this.onResizeEnd());

    effect(() => {
      debugger;
      const id = this.itemId();
      if (!id) return;
      this.service.registerItem({ id, config: this.config(), element: this.el.nativeElement });
      this.service.updateItemConfig(id, this.config());
    });

    // Keep the hosted directives in sync with per-item state: static items and
    // items explicitly marked non-draggable/non-resizable stop reacting entirely.
    effect(() => {
      const id = this.itemId();
      const item = id ? this.service.items().find((x) => x.id === id) : undefined;
      this.drag.disabled = !item || !this.service.isItemDraggable(item);
      this.resize.disabled = !item || !this.service.isItemResizable(item);
      if (item) this.applySizeConstraints(item.config);
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    const id = this.itemId();
    if (id) this.service.unregisterItem(id);
  }

  onDragStart = (): void => {
    this.dragging.set(true);
    const id = this.itemId();
    if (id) this.service.begin(id);
  };
  onDragMove = ({ x, y }: { x: number; y: number }): void => {
    const id = this.itemId();
    if (id) this.service.move(id, x, y);
  };
  onDragEnd = (): void => {
    this.dragging.set(false);
    this.finishInteraction();
  };
  onResizeStart = (): void => {
    this.resizing.set(true);
    const id = this.itemId();
    if (id) this.service.begin(id);
  };
  onResizeMove = (v: {
    width: number;
    height: number;
    moveLeft: number;
    moveTop: number;
  }): void => {
    const id = this.itemId();
    if (id) this.service.resize(id, v);
  };
  onResizeEnd = (): void => {
    this.resizing.set(false);
    this.finishInteraction();
  };

  /** Arrow keys move the item by one cell; Shift+arrow resizes it by one cell. */
  onKeyDown(e: KeyboardEvent): void {
    const id = this.itemId();
    if (!id || !this.interactive()) return;
    const item = this.service.items().find((x) => x.id === id);
    if (!item) return;
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = deltas[e.key];
    if (!delta) return;
    e.preventDefault();
    if (e.shiftKey && this.service.isItemResizable(item)) {
      this.service.resizeByCells(id, delta[0], delta[1]);
    } else if (this.service.isItemDraggable(item)) {
      this.service.moveByCells(id, delta[0], delta[1]);
    }
    this.layoutChange.emit(this.service.items().find((x) => x.id === id)?.config ?? this.config());
  }

  private finishInteraction(): void {
    const id = this.itemId();
    if (!id) return;
    this.service.end(id);
    this.layoutChange.emit(this.service.items().find((x) => x.id === id)?.config ?? this.config());
  }

  /** Converts the item's min/max cell counts (config) into px for the resize directive. */
  private applySizeConstraints(config: GridItemConfig): void {
    const cellPx = this.el.nativeElement.getBoundingClientRect();
    const cols = Math.max(1, config.w);
    const rows = Math.max(1, config.h);
    const colPx = cellPx.width / cols || 1;
    const rowPx = cellPx.height / rows || 1;
    this.resize.minWidth = (config.minW ?? 1) * colPx;
    this.resize.minHeight = (config.minH ?? 1) * rowPx;
    this.resize.maxWidth = config.maxW ? config.maxW * colPx : Infinity;
    this.resize.maxHeight = config.maxH ? config.maxH * rowPx : Infinity;
  }
}
