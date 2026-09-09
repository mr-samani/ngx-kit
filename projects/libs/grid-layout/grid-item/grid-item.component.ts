import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    '[class.with-resize-handler]': 'resizable()',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '[attr.aria-grabbed]': 'dragging()',
    '[attr.data-grid-id]': 'itemId()',
    '(keydown)': 'onKeyDown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      &.with-resize-handler:after {
        position: absolute;
        pointer-events: none;
        outline: 1px #2196f3 solid;
        outline-offset: -5px;
        // circular resize hanlder
        // background:
        //   radial-gradient(circle 5px at center 5px, #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at calc(100% - 5px) center, #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at 5px center, #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at center calc(100% - 5px), #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at 5px 5px, #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at calc(100% - 5px) 5px, #2196f3 100%, transparent 0),
        //   radial-gradient(circle 5px at 5px calc(100% - 5px), #2196f3 100%, transparent 0),
        //   radial-gradient(
        //     circle 5px at calc(100% - 5px) calc(100% - 5px),
        //     #2196f3 100%,
        //     transparent 0
        //   );
        // squre resize handler
        background:
          linear-gradient(#2196f3, #2196f3) 0 0 / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 100% 0 / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 0 100% / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 100% 100% / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 50% 0 / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 50% 100% / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 0 50% / 10px 10px no-repeat,
          linear-gradient(#2196f3, #2196f3) 100% 50% / 10px 10px no-repeat;
        background-repeat: no-repeat;
        transition: none;
        inset: -2.5px;
        opacity: 0;
        animation: showResizeHandle 0.3s forwards;
      }
      &:hover:after {
        opacity: 1;
        content: ' ';
      }
    }
    @keyframes showResizeHandle {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `,
})
export class NgxGridItemComponent implements OnDestroy, OnInit {
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

  readonly resizable = computed(() => {
    return !this.resize.disabled;
  });
  constructor() {
    // `takeUntilDestroyed()` releases these subscriptions on destroy — the
    // event for every grid item ever created (real damage in layouts where
    // items are added/removed dynamically, e.g. via *ngFor + trackBy).
    this.drag.dragStart.pipe(takeUntilDestroyed()).subscribe(() => this.onDragStart());
    this.drag.dragMove.pipe(takeUntilDestroyed()).subscribe(() => this.onDragMove());
    this.drag.dragEnd.pipe(takeUntilDestroyed()).subscribe(() => this.onDragEnd());
    this.resize.resizeStart.pipe(takeUntilDestroyed()).subscribe(() => this.onResizeStart());
    this.resize.resizeMove.pipe(takeUntilDestroyed()).subscribe((v) => this.onResizeMove(v));
    this.resize.resizeEnd.pipe(takeUntilDestroyed()).subscribe(() => this.onResizeEnd());

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

  ngOnInit(): void {
    const id = this.itemId();
    if (!id) return;
    this.service.registerItem({
      id,
      config: this.config(),
      element: this.el.nativeElement,
    });
  }

  ngOnDestroy(): void {
    const id = this.itemId();
    if (id) this.service.unregisterItem(id);
  }

  onDragStart = (): void => {
    this.dragging.set(true);
    const id = this.itemId();
    if (id) this.service.begin(id);
  };
  onDragMove = (): void => {
    const id = this.itemId();
    if (id) this.service.move(id);
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
