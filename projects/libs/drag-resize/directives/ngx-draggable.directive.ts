import {
  ContentChild,
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
  type AfterContentInit,
} from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { DragRef, DragAxis } from '../drag-ref';
import { IPosition } from '../contracts/IPosition';
import { AutoScroller, findScrollableAncestor, getScrollPosition } from '../utils/auto-scroll';
import { NgxDragPreview } from './ngx-drag-preview.directive';
import { localDeltaToViewport } from '../utils/coordinate-transform';

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
export class NgxDraggable<T = unknown> implements OnInit, OnDestroy, AfterContentInit {
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
  /**
   * Presses that start inside an element matching this selector never start a drag (the element
   * stays fully usable: text caret, clicks, selection). Handy for editable regions of a block.
   */
  readonly noDragSelector = input<string>('[data-no-drag]');
  /**
   * When `true`, presses on native interactive controls (`button, a, input, textarea, select`,
   * `[contenteditable]`) do not start a drag either. Off by default so that a page-builder canvas
   * block can be grabbed by its own button/link, which is exactly what you want while editing.
   * @default false
   */
  readonly ignoreInteractive = model<boolean>(false);
  @Input('data') set data(v: T) {
    this._ref.data = v;
  }

  @ContentChild(NgxDragPreview) private readonly customPreview?: NgxDragPreview;

  readonly dragStart = output<IPosition>();
  readonly dragMove = output<IPosition>();
  readonly dragEnd = output<IPosition>();

  readonly _ref = new DragRef<T>();
  readonly dragging = signal(false);

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
  private scrollTarget!: HTMLElement | Window;
  private lastScroll = { left: 0, top: 0 };
  private lastWindowScroll = { left: 0, top: 0 };
  private removeContainerScroll?: () => void;
  private removeWindowScroll?: () => void;
  private removeDocKeydown?: () => void;
  private keyboardDrag = false;

  protected readonly renderer = inject(Renderer2);
  constructor(private readonly host: ElementRef<HTMLElement>) {
    effect(() => {
      this._ref.el = this.dragRootElement()
        ? (this.host.nativeElement.closest(this.dragRootElement()) ?? this.host.nativeElement)
        : this.host.nativeElement;
    });
  }

  ngOnInit(): void {
    this.scrollTarget =
      this.host.nativeElement.ownerDocument.defaultView ?? this.host.nativeElement;
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
  ngAfterContentInit(): void {
    if (this.customPreview) {
      this._ref.preview = this.customPreview._ref;
    }
  }

  ngOnDestroy(): void {
    this.removeDown?.();
    this.removeMove?.();
    this.removeUp?.();
    this.removeKeydown?.();
    this.removeEscape?.();
    this.removeCancel?.();
    this.removeLostCapture?.();
    this.removeDocKeydown?.();
    this.scroller.stop();
    this.stopScrollTracking();
    // Destroyed mid-drag (e.g. the model changed underneath us): never leave a body clone behind.
    this._ref.dispose();
    this.service.removeDragItem(this._ref);
    this._ref.dropList?.removeItem(this._ref);
  }

  private pointerDown(e: PointerEvent): void {
    if (this.disabled() || e.button !== 0 || !this.isOnHandle(e.target)) return;
    // Nested draggables: pointerdown bubbles, so without this an ancestor draggable would start
    // its own drag from the very same gesture. The innermost enabled draggable claims it.
    if (claimedPointerEvents.has(e)) return;
    if (this.ignoreInteractive() && isInteractiveTarget(e.target)) {
      claimedPointerEvents.add(e);
      return;
    }
    claimedPointerEvents.add(e);

    this.down = true;
    this.keyboardDrag = false;
    this.pointerId = e.pointerId;
    // Pointer capture keeps move/up events flowing to this document even while the pointer is
    // over an <iframe> (the page-builder canvas). It can throw (pointer already gone, synthetic
    // events from automation tools) — in that case we simply fall back to plain document events.
    try {
      this._ref.el.setPointerCapture(this.pointerId);
    } catch {
      /* not capturable: document level listeners below still work inside this document */
    }
    this.start = { x: e.clientX, y: e.clientY };
    this._ref.boundary = this.boundary();
    this._ref.lockAxis = this.lockAxis();
    this._ref.pointerDown(this.start);
    const doc = this._ref.el.ownerDocument;
    // Listen on the DOCUMENT (captured events bubble up to it): this keeps working when the
    // dragged element is re-rendered / detached by the framework mid-drag, and it is the same
    // for real captured events and for events dispatched by test tooling.
    this.removeMove = this.renderer.listen(doc, 'pointermove', (ev: PointerEvent) =>
      this.pointerMove(ev),
    );
    this.removeUp = this.renderer.listen(doc, 'pointerup', (ev: PointerEvent) =>
      this.pointerUp(ev),
    );
    this.removeEscape = this.renderer.listen(doc, 'keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && this.dragging()) this.cancel();
    });
    this.removeCancel = this.renderer.listen(doc, 'pointercancel', (ev: PointerEvent) =>
      this.pointerCancel(ev),
    );
    this.removeLostCapture = this.renderer.listen(doc, 'lostpointercapture', (ev: PointerEvent) =>
      this.pointerCancel(ev),
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
      if (after !== before)
        this.scroller.retarget(after?.el ?? this._ref.dropList?.el ?? this._ref.el);
    }
    this.dragMove.emit(p);
  }
  /** فراخوانی می‌شود دقیقاً وقتی drag واقعاً شروع می‌شود (چه با موس، چه با کیبورد). */
  private startScrollTracking(): void {
    const win = this._ref.el.ownerDocument.defaultView;
    this.scrollTarget = findScrollableAncestor(this._ref.el);
    this.lastScroll = getScrollPosition(this.scrollTarget);
    this.lastWindowScroll = { left: win?.scrollX ?? 0, top: win?.scrollY ?? 0 };

    if (win && this.scrollTarget !== win) {
      this.removeContainerScroll = this.renderer.listen(this.scrollTarget, 'scroll', () =>
        this.handleContainerScroll(),
      );
    }
    // همیشه window رو هم جدا گوش می‌دیم؛ چون ممکنه container محلی نداشته باشیم
    // ولی خودِ صفحه اسکرول بشه.
    if (win) {
      this.removeWindowScroll = this.renderer.listen(win, 'scroll', () =>
        this.handleWindowScroll(),
      );
    }
  }

  private handleContainerScroll(): void {
    const pos = getScrollPosition(this.scrollTarget);
    const dx = pos.left - this.lastScroll.left;
    const dy = pos.top - this.lastScroll.top;
    this.lastScroll = pos;
    const viewportDelta = localDeltaToViewport(this.scrollTarget as HTMLElement, { x: dx, y: dy });
    this._ref.notifyScroll(viewportDelta.x, viewportDelta.y);
  }

  private handleWindowScroll(): void {
    const win = this._ref.el.ownerDocument.defaultView;
    if (!win) return;
    const left = win.scrollX;
    const top = win.scrollY;
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
    if (this._ref.el.classList.contains('ngx-resizable--resizing')) return;
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

    this.releaseCapture();

    const didDrag = this.dragging();
    if (didDrag) {
      // Also when released OUTSIDE every list: endDrag() rolls the drag back and cleans up.
      // The release position is authoritative for list sorting (a fast flick may end with
      // a pointerup that has no preceding pointermove at that position).
      const p = { x: e.clientX, y: e.clientY };
      if (this._ref.isListDrag && (p.x !== this.lastPointer.x || p.y !== this.lastPointer.y)) {
        this._ref.dragMove(p);
      }
      // endDrag must run for free drags too, otherwise their lifecycle never completes.
      this._ref.endDrag();
      this.service.end(this._ref);
      // The browser still fires a `click` on the captured element after the button is released.
      // After a real drag that click must not select the block / follow its link.
      this.swallowNextClick();
    }
    this.finish();
    if (didDrag) this.dragEnd.emit(this._ref.pointer);
  }

  /** Browser cancelled the pointer (touch takeover, lost capture...). */
  private pointerCancel(e: PointerEvent): void {
    if (!this.down || e.pointerId !== this.pointerId) return;
    if (this.dragging()) {
      this.cancel();
      return;
    }
    this.pointerUp(e);
  }

  private releaseCapture(): void {
    if (this.pointerId < 0) return;
    try {
      if (this._ref.el.hasPointerCapture?.(this.pointerId)) {
        this._ref.el.releasePointerCapture(this.pointerId);
      }
    } catch {
      /* element detached or pointer already released */
    }
  }

  private cancel(): void {
    this._ref.cancelDrag();
    this.service.end(this._ref);
    this.finish();
  }

  private finish(): void {
    this.releaseCapture();
    this.removeDocKeydown?.();
    this.removeDocKeydown = undefined;
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

  /** Keys already processed (the host listener and the document listener may both see one). */
  private readonly handledKeys = new WeakSet<Event>();

  /** Arrow-key movement for keyboard/assistive-tech users. Shift multiplies the step by 4. */
  private keyDown(e: KeyboardEvent): void {
    if (this.disabled() || this.handledKeys.has(e)) return;
    // Only the draggable ITSELF being focused means "move me". Arrow keys typed into an input,
    // a textarea or a contenteditable region inside the block belong to that control (caret
    // movement), and must never start a drag or be swallowed.
    if (e.target !== this.host.nativeElement && e.target !== this._ref.el && !this.dragging())
      return;
    if (this.dragging() && isEditableTarget(e.target)) return;
    this.handledKeys.add(e);

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
        this.beginKeyboardSession();
        this.dragStart.emit(origin);
      }
      // Holding the key down repeats faster than the 200ms slide animation settles.
      if (e.repeat && this._ref.isListDrag) return;
      const name = (
        { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' } as const
      )[e.key as 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'];
      // List items hop by whole slots / neighbouring lists; free drags move by `keyboardStep` px.
      if (!this._ref.nudgeToSlot(name)) this._ref.nudge(delta.x, delta.y);
      this.dragMove.emit(this._ref.pointer);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && this.dragging()) {
      e.preventDefault();
      this._ref.endDrag();
      this.service.end(this._ref);
      this.dragEnd.emit(this._ref.pointer);
      this.finish();
      this.restoreFocus();
    } else if (e.key === 'Escape' && this.dragging()) {
      e.preventDefault();
      this._ref.cancelDrag();
      this.service.end(this._ref);
      this.finish();
      this.restoreFocus();
    }
  }

  /**
   * A list item is `display:none` while it is being moved, so the browser drops its focus and
   * the following arrow/Enter/Escape presses would go to <body>. Listen on the document for the
   * duration of a keyboard drag so the gesture keeps working.
   */
  private beginKeyboardSession(): void {
    this.keyboardDrag = true;
    this.removeDocKeydown?.();
    this.removeDocKeydown = this.renderer.listen(
      this._ref.el.ownerDocument,
      'keydown',
      (ev: KeyboardEvent) => this.keyDown(ev),
    );
  }

  private restoreFocus(): void {
    this.removeDocKeydown?.();
    this.removeDocKeydown = undefined;
    if (this.keyboardDrag) {
      this.keyboardDrag = false;
      this._ref.el.focus?.({ preventScroll: true });
    }
  }

  /** Swallow the single `click` the browser dispatches right after a completed drag. */
  private swallowNextClick(): void {
    const doc = this._ref.el.ownerDocument;
    const stop = (ev: Event) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    doc.addEventListener('click', stop, { capture: true, once: true });
    // If no click follows (pointer released elsewhere), do not eat the user's NEXT real click.
    doc.defaultView?.setTimeout(() => doc.removeEventListener('click', stop, { capture: true }), 0);
  }

  private isOnHandle(target: EventTarget | null): boolean {
    if (!this.dragHandle()) return true;
    // TODO notsafe instanseof: node.nodeType === Node.ELEMENT_NODE
    return isElementTarget(target) && !!target.closest(this.dragHandle());
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!isElementTarget(target)) return false;
  return !!target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!isElementTarget(target)) return false;
  return !!target.closest('button,a,input,textarea,select,[contenteditable]');
}

function isElementTarget(target: EventTarget | null): target is HTMLElement {
  return (
    !!target &&
    typeof target === 'object' &&
    'nodeType' in target &&
    (target as Node).nodeType === 1 &&
    'closest' in target
  );
}
