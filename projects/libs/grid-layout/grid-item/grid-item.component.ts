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
  hostDirectives: [NgxDraggable, NgxResizable],
  template: `
    <ng-content />
  `,
  host: {
    '[style.position]': '"absolute !important"',
    '[style.display]': '"block"',
    '[style.boxSizing]': '"border-box"',
   // '[style.transition]': 'transitionStyle',
    '[class.ngx-grid-item--dragging]': 'dragging()',
    '[class.ngx-grid-item--resizing]': 'resizing()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridItemComponent implements OnInit, OnDestroy {
  readonly config = input<GridItemConfig>({ x: 0, y: 0, w: 1, h: 1 });
  readonly itemId = input<string>();
  readonly layoutChange = output<GridItemConfig>();
  readonly dragging = signal(false);
  readonly resizing = signal(false);
  readonly active = computed(() => this.dragging() || this.resizing());
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
      const id = this.itemId();
      if (id) {
        this.service.registerItem({ id, config: this.config(), element: this.el.nativeElement });
        this.service.updateItemConfig(id, this.config());
      }
    });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    const id = this.itemId();
    if (id) this.service.unregisterItem(id);
  }
  onDragStart = () => {
    this.dragging.set(true);
    const id = this.itemId();
    if (id) this.service.begin(id);
  };
  onDragMove = ({ x, y }: { x: number; y: number }) => {
    const id = this.itemId();
    if (id) this.service.move(id, x, y);
  };
  onDragEnd = () => {
    this.dragging.set(false);
    const id = this.itemId();
    if (id) {
      this.service.end(id);
      this.layoutChange.emit(
        this.service.items().find((x) => x.id === id)?.config ?? this.config(),
      );
    }
  };
  onResizeStart = () => {
    this.resizing.set(true);
    const id = this.itemId();
    if (id) this.service.begin(id);
  };
  onResizeMove = (v: { width: number; height: number; moveLeft: number; moveTop: number }) => {
    const id = this.itemId();
    if (id) this.service.resize(id, v);
  };
  onResizeEnd = () => {
    this.resizing.set(false);
    const id = this.itemId();
    if (id) {
      this.service.end(id);
      this.layoutChange.emit(
        this.service.items().find((x) => x.id === id)?.config ?? this.config(),
      );
    }
  };
}
