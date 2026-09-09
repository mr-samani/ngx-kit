import {
  Directive,
  ElementRef,
  EventEmitter,
  InjectionToken,
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
import { NGX_DROPLIST } from './ngx-drop-list.directive';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
import { DragRef, DragAxis } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';
import { AutoScroller } from '../utils/auto-scroll';

export const NGX_DRAGGABLE = new InjectionToken<NgxDraggable>('ngx-draggable');

const DEFAULT_KEYBOARD_STEP = 8;

@Directive({
  selector: '[NgxDraggable],[ngxDraggable]',
  providers: [{ provide: NGX_DRAGGABLE, useExisting: NgxDraggable }],
  host: {
    '[style.touch-action]': '"none"',
    '[attr.tabindex]': 'disabled ? null : 0',
    '[attr.aria-grabbed]': 'dragging()',
    class: 'ngx-draggable',
  },
})
export class NgxDraggable<T = unknown> implements OnInit, OnDestroy {
  @Input() disabled = false;
  /** Element whose rect constrains the drag. Now actually enforced. */
  @Input() boundary?: HTMLElement;
  @Input() dragRootElement = '';
  /** CSS selector for a drag handle. When set, only pointerdowns inside it start a drag. */
  @Input() dragHandle = '';
  /** Restrict movement to a single axis. */
  @Input() lockAxis: DragAxis;
  /** Minimum pointer travel (px) before a drag starts, so clicks still register normally. */
  @Input() dragThreshold = 3;
  /** Pixel step used when dragging via the keyboard (arrow keys, focus required). */
  @Input() keyboardStep = DEFAULT_KEYBOARD_STEP;
  /** Auto-scroll the nearest scrollable ancestor while dragging near its edge. */
  @Input() autoScroll = true;
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
  private readonly scroller = new AutoScroller();

  private down = false;
  private start = { x: 0, y: 0 };
  private pointerId = -1;
  private removeDown?: () => void;
  private removeMove?: () => void;
  private removeUp?: () => void;
  private removeKeydown?: () => void;
  private removeEscape?: () => void;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this._ref.el = this.dragRootElement
      ? (this.host.nativeElement.closest(this.dragRootElement) ?? this.host.nativeElement)
      : this.host.nativeElement;
    this._ref.boundary = this.boundary;
    this._ref.lockAxis = this.lockAxis;
    this._ref.dropListGroup = this.group?._ref;
    this._ref.init();
    this._ref.withDropList(this.list?._ref ?? null);
    this.service.registerDragItem(this._ref);
    this.removeDown = this.renderer.listen(
      this.host.nativeElement,
      'pointerdown',
      (e: PointerEvent) => this.pointerDown(e),
    );
    this.removeKeydown = this.renderer.listen(
      this.host.nativeElement,
      'keydown',
      (e: KeyboardEvent) => this.keyDown(e),
    );
  }

  ngOnDestroy(): void {
    this.removeDown?.();
    this.removeMove?.();
    this.removeUp?.();
    this.removeKeydown?.();
    this.removeEscape?.();
    this.scroller.stop();
    this.service.removeDragItem(this._ref);
    this._ref.dropList?.removeItem(this._ref);
  }

  private pointerDown(e: PointerEvent): void {
    if (
      this.disabled ||
      e.button !== 0 ||
      // this.isInteractive(e.target) ||
      !this.isOnHandle(e.target)
    )
      return;
    e.preventDefault();
    this.down = true;
    this.pointerId = e.pointerId;
    this.start = { x: e.clientX, y: e.clientY };
    this._ref.boundary = this.boundary;
    this._ref.lockAxis = this.lockAxis;
    this._ref.pointerDown(this.start);
    this.removeMove = this.renderer.listen(this.doc, 'pointermove', (ev: PointerEvent) =>
      this.pointerMove(ev),
    );
    this.removeUp = this.renderer.listen(this.doc, 'pointerup', (ev: PointerEvent) =>
      this.pointerUp(ev),
    );
    this.removeEscape = this.renderer.listen(this.doc, 'keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && this.dragging()) this.cancel();
    });
  }

  private pointerMove(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    const p = { x: e.clientX, y: e.clientY };
    if (!this.dragging() && Math.hypot(p.x - this.start.x, p.y - this.start.y) < this.dragThreshold)
      return;
    if (!this.dragging()) {
      this._ref.startDrag(p);
      this.dragging.set(true);
      this.service.begin(this._ref);
      if (this.autoScroll) this.scroller.start(this._ref.el);
      this.dragStart.emit(p);
    }
    this._ref.dragMove(p);

    const target = this.service.findDropList(p, this._ref.dropList);

    if (target !== this._ref.dropList) {
      this._ref.dropList?.exit(this._ref);
      this._ref.clearDropList();

      if (target) {
        this._ref.withDropList(target);
        target.createPlaceholder(this._ref);

        if (this.autoScroll) {
          this.scroller.stop();
          this.scroller.start(target.el);
        }
      } else if (this.autoScroll) {
        this.scroller.stop();
      }
    }

    // Sorting uses the pointer against the currently active list. Its geometry
    // is read live, so the placeholder and auto-scroll are both reflected.
    this._ref.dropList?.sortItem(this._ref, p);

    if (this.autoScroll) this.scroller.update(p.x, p.y);
    this.dragMove.emit(p);
  }

  private pointerUp(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    if (this.dragging()) {
      if (this._ref.dropList) {
        this._ref.endDrag();
        this.dragEnd.emit(this._ref.pointer);
      } else {
        // Dropping outside every connected list is a cancelled drag.
        this._ref.cancelDrag();
      }
      this.service.end(this._ref);
    }
    this.finish();
  }

  private cancel(): void {
    this._ref.cancelDrag();
    this.service.end(this._ref);
    this.finish();
  }

  private finish(): void {
    this.dragging.set(false);
    this.down = false;
    this.scroller.stop();
    this.removeMove?.();
    this.removeUp?.();
    this.removeEscape?.();
    this.removeMove = this.removeUp = this.removeEscape = undefined;
  }

  /** Arrow-key movement for keyboard/assistive-tech users. Shift multiplies the step by 4. */
  private keyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const step = this.keyboardStep * (e.shiftKey ? 4 : 1);
    const deltas: Record<string, IPosition> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const delta = deltas[e.key];
    if (delta) {
      e.preventDefault();
      if (!this.dragging()) {
        this._ref.pointerDown({ x: 0, y: 0 });
        this._ref.boundary = this.boundary;
        this._ref.lockAxis = this.lockAxis;
        this._ref.startDrag({ x: 0, y: 0 });
        this.dragging.set(true);
        this.service.begin(this._ref);
        this.dragStart.emit({ x: 0, y: 0 });
      }
      this._ref.nudge(delta.x, delta.y);
      this.dragMove.emit(this._ref.pointer);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && this.dragging()) {
      e.preventDefault();
      this._ref.endDrag();
      this.service.end(this._ref);
      this.dragEnd.emit(this._ref.pointer);
      this.dragging.set(false);
    } else if (e.key === 'Escape' && this.dragging()) {
      e.preventDefault();
      this._ref.cancelDrag();
      this.service.end(this._ref);
      this.dragging.set(false);
    }
  }

  private isOnHandle(target: EventTarget | null): boolean {
    if (!this.dragHandle) return true;
    return target instanceof HTMLElement && !!target.closest(this.dragHandle);
  }

  private isInteractive(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement &&
      !!target.closest('button,a,input,textarea,select,[data-no-drag]')
    );
  }
}
