import {
  Directive,
  ElementRef,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DragDropService } from '../services/drag-drop.service';
import { DragRef, DragAxis } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';
import { AutoScroller, findScrollableAncestor, getScrollPosition } from '../utils/auto-scroll';

/** Pointer events already claimed by an (inner) draggable. */
const claimedPointerEvents = new WeakSet<Event>();

export const NGX_DRAGGABLE = new InjectionToken<NgxDraggable>('ngx-draggable');

const DEFAULT_KEYBOARD_STEP = 8;

@Directive({
  selector: '[NgxDraggable],[ngxDraggable]',
  providers: [{ provide: NGX_DRAGGABLE, useExisting: NgxDraggable }],
  host: {
    '[style.touch-action]': '"none"',
    '[attr.tabindex]': 'disabled() ? null : 0',
    '[attr.aria-grabbed]': 'dragging()',
    class: 'ngx-draggable',
    '[class.disable-drag]': 'disabled()',
  },
})
export class NgxDraggable<T = unknown> implements OnInit, OnDestroy {
  readonly disabled = model<boolean>(false);
  /** Element whose rect constrains the drag. Now actually enforced. */
  readonly boundary = input<HTMLElement>();
  readonly dragRootElement = model<string>('');
  /** CSS selector for a drag handle. When set, only pointerdowns inside it start a drag. */
  readonly dragHandle = model<string>('');
  /** Restrict movement to a single axis. */
  readonly lockAxis = input<DragAxis>();
  /** Minimum pointer travel (px) before a drag starts, so clicks still register normally. */
  readonly dragThreshold = input<number>(3);
  /** Pixel step used when dragging via the keyboard (arrow keys, focus required). */
  readonly keyboardStep = input<number>(DEFAULT_KEYBOARD_STEP);
  /** Auto-scroll the nearest scrollable ancestor while dragging near its edge. */
  readonly autoScroll = input<boolean>(true);
  @Input('data') set data(v: T) {
    this._ref.data = v;
  }

  readonly dragStart = output<IPosition>();
  readonly dragMove = output<IPosition>();
  readonly dragEnd = output<IPosition>();

  readonly _ref = new DragRef<T>();
  readonly dragging = signal(false);

  private readonly doc = inject(DOCUMENT);
  private readonly service = inject(DragDropService);
  private readonly scroller = new AutoScroller();

  private down = false;
  private start = { x: 0, y: 0 };
  private pointerId = -1;
  private lastPointer: IPosition = { x: 0, y: 0 };
  private removeDown?: () => void;
  private removeMove?: () => void;
  private removeUp?: () => void;
  private removeKeydown?: () => void;
  private removeEscape?: () => void;
  private removeCancel?: () => void;
  private removeLostCapture?: () => void;
  private scrollTarget: HTMLElement | Window = window;
  private lastScroll = { left: 0, top: 0 };
  private lastWindowScroll = { left: 0, top: 0 };
  private removeContainerScroll?: () => void;
  private removeWindowScroll?: () => void;

  protected readonly renderer = inject(Renderer2);
  constructor(private readonly host: ElementRef<HTMLElement>) {
    effect(() => {
      this._ref.el = this.dragRootElement()
        ? (this.host.nativeElement.closest(this.dragRootElement()) ?? this.host.nativeElement)
        : this.host.nativeElement;
    });
  }

  ngOnInit(): void {
    this._ref.el = this.dragRootElement()
      ? (this.host.nativeElement.closest(this.dragRootElement()) ?? this.host.nativeElement)
      : this.host.nativeElement;
    this._ref.boundary = this.boundary();
    this._ref.lockAxis = this.lockAxis();
    // Found by walking the real DOM, not Angular's element-injector tree — see the matching
    // comment in `ngx-drop-list.directive.ts` for why: a draggable rendered by a recursively
    // invoked `ngTemplateOutlet` needs this just as much as a nested list does.
    const parentEl = this.host.nativeElement.parentElement;
    const list = this.service.findAncestorDropList(parentEl);
    this._ref.dropListGroup = list?.dropListGroup ?? this.service.findAncestorGroup(parentEl);
    this._ref.service = this.service;
    this._ref.init();
    this._ref.withDropList(list ?? null);
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
    this.removeCancel?.();
    this.removeLostCapture?.();
    this.scroller.stop();
    this.stopScrollTracking();
    // Destroyed mid-drag (e.g. the model changed underneath us): never leave a body clone behind.
    this._ref.dispose();
    this.service.removeDragItem(this._ref);
    this._ref.dropList?.removeItem(this._ref);
  }

  private pointerDown(e: PointerEvent): void {
    if (
      this.disabled() ||
      e.button !== 0 ||
      // this.isInteractive(e.target) ||
      !this.isOnHandle(e.target)
    )
      return;
    // Nested draggables: pointerdown bubbles, so without this an ancestor draggable would start
    // its own drag from the very same gesture. The innermost enabled draggable claims it.
    if (claimedPointerEvents.has(e)) return;
    claimedPointerEvents.add(e);
    e.preventDefault();
    this.down = true;
    this.pointerId = e.pointerId;
    this.start = { x: e.clientX, y: e.clientY };
    this._ref.boundary = this.boundary();
    this._ref.lockAxis = this.lockAxis();
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
    this.removeCancel = this.renderer.listen(this.doc, 'pointercancel', (ev: PointerEvent) =>
      this.pointerCancel(ev),
    );
    this.removeLostCapture = this.renderer.listen(
      this.doc,
      'lostpointercapture',
      (ev: PointerEvent) => this.pointerCancel(ev),
    );
  }
  private applyDragUpdate(p: IPosition): void {
    const before = this._ref.activeDropList;
    // DragRef decides everything (preview, target list, placeholder). A free drag never
    // interacts with drop lists.
    this._ref.dragMove(p);

    if (this._ref.isListDrag && this.autoScroll()) {
      const after = this._ref.activeDropList;
      // Follow the hovered list; outside every list, scroll the page.
      if (after !== before) this.scroller.retarget(after?.el ?? this.doc.body);
    }
    this.dragMove.emit(p);
  }
  /** فراخوانی می‌شود دقیقاً وقتی drag واقعاً شروع می‌شود (چه با موس، چه با کیبورد). */
  private startScrollTracking(): void {
    this.scrollTarget = findScrollableAncestor(this._ref.el);
    this.lastScroll = getScrollPosition(this.scrollTarget);
    this.lastWindowScroll = { left: window.scrollX, top: window.scrollY };

    if (this.scrollTarget !== window) {
      this.removeContainerScroll = this.renderer.listen(this.scrollTarget, 'scroll', () =>
        this.handleContainerScroll(),
      );
    }
    // همیشه window رو هم جدا گوش می‌دیم؛ چون ممکنه container محلی نداشته باشیم
    // ولی خودِ صفحه اسکرول بشه.
    this.removeWindowScroll = this.renderer.listen('window', 'scroll', () =>
      this.handleWindowScroll(),
    );
  }

  private handleContainerScroll(): void {
    const pos = getScrollPosition(this.scrollTarget);
    const dx = pos.left - this.lastScroll.left;
    const dy = pos.top - this.lastScroll.top;
    this.lastScroll = pos;
    this._ref.notifyScroll(dx, dy);
  }

  private handleWindowScroll(): void {
    const left = window.scrollX;
    const top = window.scrollY;
    const dx = left - this.lastWindowScroll.left;
    const dy = top - this.lastWindowScroll.top;
    this.lastWindowScroll = { left, top };
    this._ref.notifyScroll(dx, dy);
  }

  private stopScrollTracking(): void {
    this.removeContainerScroll?.();
    this.removeWindowScroll?.();
    this.removeContainerScroll = this.removeWindowScroll = undefined;
  }

  private pointerMove(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    const p = { x: e.clientX, y: e.clientY };
    this.lastPointer = p;
    if (
      !this.dragging() &&
      Math.hypot(p.x - this.start.x, p.y - this.start.y) < this.dragThreshold()
    )
      return;
    if (!this.dragging()) {
      this._ref.startDrag(p);
      this.dragging.set(true);
      this.service.begin(this._ref);
      this.startScrollTracking();
      if (this.autoScroll()) {
        this.scroller.start(this._ref.el, () => this.applyDragUpdate(this.lastPointer));
      }
      this.dragStart.emit(p);
    }

    this.applyDragUpdate(p);

    if (this.autoScroll()) this.scroller.update(p.x, p.y);
  }
  private pointerUp(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    if (this.dragging()) {
      // Also when released OUTSIDE every list: endDrag() rolls the drag back and cleans up.
      if (this._ref.isListDrag) {
        // The release position is authoritative for the drop target (a fast flick may end with
        // a pointerup that has no preceding pointermove at that position).
        const p = { x: e.clientX, y: e.clientY };
        if (p.x !== this.lastPointer.x || p.y !== this.lastPointer.y) this._ref.dragMove(p);
        this._ref.endDrag();
      }
      this.service.end(this._ref);
    }
    this.finish();
    this.dragEnd.emit(this._ref.pointer);
  }

  /** Browser cancelled the pointer (touch takeover, lost capture...). */
  private pointerCancel(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    if (this.dragging() && this._ref.isListDrag) {
      this.cancel();
      return;
    }
    this.pointerUp(e);
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
    this.stopScrollTracking();
    this.removeMove?.();
    this.removeUp?.();
    this.removeEscape?.();
    this.removeCancel?.();
    this.removeLostCapture?.();
    this.removeMove = this.removeUp = this.removeEscape = undefined;
    this.removeCancel = this.removeLostCapture = undefined;
  }

  /** Arrow-key movement for keyboard/assistive-tech users. Shift multiplies the step by 4. */
  private keyDown(e: KeyboardEvent): void {
    if (this.disabled()) return;
    const step = this.keyboardStep() * (e.shiftKey ? 4 : 1);
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
        // Free drag keeps its (0,0) pseudo pointer. A list item starts from its own centre so
        // that keyboard sorting resolves against real geometry.
        const inList = !!this._ref.dropList && this._ref.dropList.el === this._ref.el.parentElement;
        const r = this._ref.el.getBoundingClientRect();
        const origin = inList
          ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          : { x: 0, y: 0 };
        this._ref.pointerDown(origin);
        this._ref.boundary = this.boundary();
        this._ref.lockAxis = this.lockAxis();
        this._ref.startDrag(origin);
        this.dragging.set(true);
        this.service.begin(this._ref);
        this.startScrollTracking();
        this.dragStart.emit(origin);
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
      this.stopScrollTracking();
    } else if (e.key === 'Escape' && this.dragging()) {
      e.preventDefault();
      this._ref.cancelDrag();
      this.service.end(this._ref);
      this.dragging.set(false);
    }
  }

  private isOnHandle(target: EventTarget | null): boolean {
    if (!this.dragHandle()) return true;
    return target instanceof HTMLElement && !!target.closest(this.dragHandle());
  }

  private isInteractive(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement &&
      !!target.closest('button,a,input,textarea,select,[data-no-drag]')
    );
  }
}
