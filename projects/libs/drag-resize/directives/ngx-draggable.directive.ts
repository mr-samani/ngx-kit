import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DragDropService } from '../services/drag-drop.service';
import { InjectionToken } from '@angular/core';
import { NGX_DROPLIST } from './ngx-drop-list.directive';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
import { DragRef } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';

export const NGX_DRAGGABLE = new InjectionToken<NgxDraggable>('ngx-draggable');
@Directive({
  selector: '[NgxDraggable],[ngxDraggable]',
  providers: [{ provide: NGX_DRAGGABLE, useExisting: NgxDraggable }],
  host: { '[style.touch-action]': '"none"' },
})
export class NgxDraggable<T = unknown> implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Input() boundary?: HTMLElement;
  @Input() dragRootElement = '';
  @Input('data') set data(v: T) {
    this._ref.data = v;
  }
  @Output() readonly dragStart = new EventEmitter<IPosition>();
  @Output() readonly dragMove = new EventEmitter<IPosition>();
  @Output() readonly dragEnd = new EventEmitter<IPosition>();
  readonly _ref = new DragRef<T>();
  readonly dragging = signal(false);
  private readonly doc = inject(DOCUMENT);
  private readonly service = inject(DragDropService);
  private readonly list = inject(NGX_DROPLIST, { optional: true, skipSelf: true });
  private readonly group = inject(NGX_DROPLIST_GROUP, { optional: true, skipSelf: true });
  private down = false;
  private start = { x: 0, y: 0 };
  private pointerId = -1;
  private removeDown?: () => void;
  private removeMove?: () => void;
  private removeUp?: () => void;
  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}
  ngOnInit(): void {
    this._ref.el = this.dragRootElement
      ? (this.host.nativeElement.closest(this.dragRootElement) ?? this.host.nativeElement)
      : this.host.nativeElement;
    this._ref.boundary = this.boundary;
    this._ref.dropListGroup = this.group?._ref;
    this._ref.init();
    this._ref.withDropList(this.list?._ref ?? null);
    this.service.registerDragItem(this._ref);
    this.removeDown = this.renderer.listen(this._ref.el, 'pointerdown', (e: PointerEvent) =>
      this.pointerDown(e),
    );
  }
  ngOnDestroy(): void {
    this.removeDown?.();
    this.removeMove?.();
    this.removeUp?.();
    this.service.removeDragItem(this._ref);
    this._ref.dropList?.removeItem(this._ref);
  }
  private pointerDown(e: PointerEvent): void {
    if (this.disabled || e.button !== 0 || this.isInteractive(e.target)) return;
    e.preventDefault();
    this.down = true;
    this.pointerId = e.pointerId;
    this.start = { x: e.clientX, y: e.clientY };
    this._ref.pointerDown(this.start);
    this.removeMove = this.renderer.listen(this.doc, 'pointermove', (ev: PointerEvent) =>
      this.pointerMove(ev),
    );
    this.removeUp = this.renderer.listen(this.doc, 'pointerup', (ev: PointerEvent) =>
      this.pointerUp(ev),
    );
    this._ref.el.setPointerCapture?.(e.pointerId);
  }
  private pointerMove(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    const p = { x: e.clientX, y: e.clientY };
    if (!this.dragging() && Math.hypot(p.x - this.start.x, p.y - this.start.y) < 3) return;
    if (!this.dragging()) {
      this._ref.startDrag(p);
      this.dragging.set(true);
      this.service.begin(this._ref);
      this.dragStart.emit(p);
    }
    this._ref.dragMove(p);
    const target = this.service.findDropList(p, this._ref.dropList);
    if (target && target !== this._ref.dropList) {
      this._ref.dropList?.exit(this._ref);
      this._ref.dropList?.removeItem(this._ref);
      this._ref.withDropList(target);
      this._ref.placeholder = target.createPlaceholder(this._ref);
    }
    this._ref.dropList?.sortItem(this._ref, p);
    this.dragMove.emit(p);
  }
  private pointerUp(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    if (this.dragging()) this.dragEnd.emit(this._ref.pointer);
    this._ref.endDrag();
    this.service.end(this._ref);
    this.dragging.set(false);
    this.down = false;
    this.removeMove?.();
    this.removeUp?.();
    this.removeMove = this.removeUp = undefined;
  }
  private isInteractive(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement &&
      !!target.closest('button,a,input,textarea,select,[data-no-drag]')
    );
  }
}
