import {
  Directive,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { IPosition } from '../contracts/IPosition';
import { fromEvent, Subscription } from 'rxjs';
import { NGX_DROPLIST } from './ngx-drop-list.directive';
import { DragDropService } from '../services/drag-drop.service';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
import { DragRef } from '../drag-ref';
import { getPointerOnViewPort } from '../utils/get-position';

export const NGX_DRAGGABLE = new InjectionToken<DragRef>('ngx-draggable');

@Directive({
  selector: '[NgxDraggable],[ngxDraggable]',
  providers: [{ provide: NGX_DRAGGABLE, useExisting: NgxDraggable }],
  host: { '[style.touch-action]': '"none"' },
})
export class NgxDraggable<T = any> implements OnInit, OnDestroy {
  @Input() boundary?: HTMLElement;
  @Input() dragRootElement = '';
  @Input() disabled = false;

  @Output() dragStart = new EventEmitter<IPosition>();
  @Output() dragMove = new EventEmitter<IPosition>();
  @Output() dragEnd = new EventEmitter<IPosition>();

  @Input('data') set setData(val: T) {
    this._ref.data = val;
  }

  private _prevTransition?: string;

  set dragging(val: boolean) {
    this._ref.isDragging = val === true;
    if (val) {
      this._prevTransition = this._ref.el.style.transitionProperty;
      this.renderer.setStyle(this._ref.el, 'transition-property', 'none', RendererStyleFlags2.Important);
      this.renderer.setStyle(this._ref.el, 'user-select', 'none');
      this.renderer.setStyle(this._ref.el, 'pointer-events', 'none');
      this.renderer.setStyle(this._ref.el, 'cursor', 'grabbing');
      // this.renderer.setStyle(this._ref.el, 'z-index', '999999');
      this.renderer.setStyle(this._ref.el, 'touch-action', 'none');
      this.renderer.setStyle(this._ref.el, 'will-change', 'transform');
      this._ref.el.classList.add('ngx-draggable--dragging');
    } else {
      if (this._prevTransition) {
        this.renderer.setStyle(this._ref.el, 'transition-property', this._prevTransition);
      } else {
        this.renderer.removeStyle(this._ref.el, 'transition-property');
      }
      this.renderer.removeStyle(this._ref.el, 'user-select');
      this.renderer.removeStyle(this._ref.el, 'pointer-events');
      this.renderer.removeStyle(this._ref.el, 'cursor');
      // this.renderer.removeStyle(this._ref.el, 'z-index');
      this.renderer.removeStyle(this._ref.el, 'will-change');
      this._ref.el.classList.remove('ngx-draggable--dragging');
    }
  }
  get dragging() {
    return this._ref.isDragging;
  }

  private _pointerDown = false;
  private _startSubs: Subscription[] = [];
  private _moveSubs: Subscription[] = [];

  private readonly renderer = inject(Renderer2);
  private readonly _doc = inject(DOCUMENT);
  private readonly _service = inject(DragDropService);
  private readonly _dropList = inject(NGX_DROPLIST, { skipSelf: true, optional: true });
  private readonly _dropGroup = inject(NGX_DROPLIST_GROUP, { skipSelf: true, optional: true });

  readonly _ref = new DragRef();

  constructor(private elRef: ElementRef<HTMLElement>) {
    this._ref.dropListGroup = this._dropGroup;
  }

  ngOnInit(): void {
    this._ref.el = this.dragRootElement
      ? (this.elRef.nativeElement.closest(this.dragRootElement) ?? this.elRef.nativeElement)
      : this.elRef.nativeElement;

    if (this.boundary) this._ref.boundary = this.boundary;

    this._ref.init();
    this._service.registerDragItem(this._ref);
    this._ref.withDropList(this._dropList?._ref ?? null);

    this._startSubs = [
      fromEvent<PointerEvent>(this._ref.el, 'pointerdown', { passive: false }).subscribe(ev => this._onPointerDown(ev)),
    ];
  }

  ngOnDestroy() {
    [...this._startSubs, ...this._moveSubs].forEach(s => s.unsubscribe());
    this._service.removeDragItem(this._ref);
    this._ref.dropList?.removeItem(this._ref);
  }

  private _onPointerDown(ev: PointerEvent) {
    if (ev.button !== 0 || this.disabled) return;
    // if (this.interaction.isResizing()) return;
    ev.preventDefault();
    // stopPropagation required for nested tree elements
    ev.stopPropagation();

    this._moveSubs.forEach(s => s.unsubscribe());
    this._moveSubs = [
      fromEvent<PointerEvent>(this._doc, 'pointermove', { passive: false }).subscribe(ev => this._onPointerMove(ev)),
      fromEvent<PointerEvent>(window, 'pointerup', { passive: false }).subscribe(ev => this._onPointerUp(ev)),
      fromEvent<PointerEvent>(window, 'pointercancel', { passive: false }).subscribe(ev => this._onPointerUp(ev)),
    ];

    this._pointerDown = true;
    this._ref.pointerDown(getPointerOnViewPort(ev));
  }

  private _onPointerMove(ev: PointerEvent) {
    const p = getPointerOnViewPort(ev);

    if (this._pointerDown && !this.dragging) {
      this._ref.startDrag(p);
      this.dragStart.emit(p);
      this.dragging = true;
    }

    if (this.dragging) {
      this._ref.dragMove(p);
      this.dragMove.emit({ x: this._ref.x, y: this._ref.y });
    }
  }

  private _onPointerUp(_ev: PointerEvent) {
    if (this.dragging) {
      this.dragEnd.emit({ x: this._ref.x, y: this._ref.y });
    }
    this.dragging = false;
    this._moveSubs.forEach(s => s.unsubscribe());
    this._moveSubs = [];
    this._pointerDown = false;
    this._ref.endDrag();
  }
}
