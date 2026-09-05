import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  IResizableOutput,
  LogicalResizeDirection,
  ResizeDirection,
} from '../contracts/IResizableOutput';
import { clampResizeWithinBoundary } from '../utils/check-boundary';
import { isRtl, resolveLogicalDirection } from '../utils/rtl';

const ALL_DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const KEYBOARD_STEP = 8;

@Directive({
  selector: '[NgxResizable],[ngxResizable]',
  host: {
    '[style.touch-action]': '"none"',
    class: 'ngx-resizable',
  },
})
export class NgxResizable {
  @Input() disabled = false;

  @Input() minWidth = 20;
  @Input() minHeight = 20;

  @Input() maxWidth = Infinity;
  @Input() maxHeight = Infinity;

  @Input() directions: LogicalResizeDirection[] = [...ALL_DIRECTIONS];

  @Input() grid?: number | { x: number; y: number };
  /** Element whose rect constrains the resize. Previously accepted nowhere on this directive. */
  @Input() boundary?: HTMLElement;
  /** Pixel step used when resizing via the keyboard (arrow keys, focus required). */
  @Input() keyboardStep = KEYBOARD_STEP;

  @Output() readonly resizeStart = new EventEmitter<IResizableOutput>();

  @Output() readonly resizeMove = new EventEmitter<IResizableOutput>();

  @Output() readonly resizeEnd = new EventEmitter<IResizableOutput>();

  readonly resizing = signal(false);

  private direction: ResizeDirection = 'se';

  private start!: DOMRect;

  private pointer = {
    x: 0,
    y: 0,
  };

  private beforeTransition = '';

  private beforeWidth = '';
  private beforeHeight = '';

  private beforeTransform = '';
  private resizeTranslateX = 0;
  private resizeTranslateY = 0;

  private pointerId = -1;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('pointerdown', ['$event'])
  onPointerDown(e: PointerEvent): void {
    if (this.disabled || e.button !== 0) {
      return;
    }

    const dir = this.hitDirection(e);

    if (!dir) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const element = this.el.nativeElement;

    this.direction = dir;
    this.pointerId = e.pointerId;

    /**
     * This is the actual visual rectangle.
     * It already contains any transform created by DragRef.
     */
    this.start = element.getBoundingClientRect();

    this.pointer = {
      x: e.clientX,
      y: e.clientY,
    };

    this.beforeTransition = element.style.transition;

    /**
     * Keep DragRef's transform as the immutable base.
     *
     * Resize will temporarily add its own translation
     * on top of this transform.
     */
    this.beforeTransform = element.style.transform;

    this.resizeTranslateX = 0;
    this.resizeTranslateY = 0;

    this.resizing.set(true);

    element.style.transition = 'none';

    element.setPointerCapture?.(e.pointerId);

    const out = this.calculate(e);

    this.apply(out);

    this.resizeStart.emit(out);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) {
      return;
    }

    const out = this.calculate(e);

    this.apply(out);

    this.resizeMove.emit(out);
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) {
      return;
    }

    const out = this.calculate(e);

    this.apply(out);

    this.resizeEnd.emit(out);

    this.finish();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(e: KeyboardEvent): void {
    if (!this.resizing()) {
      return;
    }

    if (e.key !== 'Escape') {
      return;
    }

    e.preventDefault();

    const element = this.el.nativeElement;

    element.style.width = this.beforeWidth;
    element.style.height = this.beforeHeight;
    element.style.transform = this.beforeTransform;

    this.finish();
  }

  @HostListener('keydown', ['$event'])
  onHandleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    const rtl = isRtl(this.el.nativeElement);

    const step = this.keyboardStep * (e.shiftKey ? 4 : 1);

    let dw = 0;
    let dh = 0;

    if (e.key === 'ArrowRight') {
      dw = rtl ? -step : step;
    } else if (e.key === 'ArrowLeft') {
      dw = rtl ? step : -step;
    } else if (e.key === 'ArrowDown') {
      dh = step;
    } else if (e.key === 'ArrowUp') {
      dh = -step;
    } else {
      return;
    }

    e.preventDefault();
    const rect = this.el.nativeElement.getBoundingClientRect();
    const width = this.clampGrid(
      Math.max(this.minWidth, Math.min(this.maxWidth, rect.width + dw)),
      'x',
    );
    const height = this.clampGrid(
      Math.max(this.minHeight, Math.min(this.maxHeight, rect.height + dh)),
      'y',
    );
    this.el.nativeElement.style.width = `${width}px`;
    this.el.nativeElement.style.height = `${height}px`;
    const out: IResizableOutput = {
      width,
      height,
      moveLeft: 0,
      moveTop: 0,
      left: rect.left,
      top: rect.top,
      direction: 'se',
    };
    this.resizeMove.emit(out);
    this.resizeEnd.emit(out);
  }

  private calculate(e: PointerEvent): IResizableOutput {
    const dx = e.clientX - this.pointer.x;
    const dy = e.clientY - this.pointer.y;

    let width = this.start.width;
    let height = this.start.height;

    /**
     * East
     */
    if (this.direction.includes('e')) {
      width += dx;
    }

    /**
     * West
     */
    if (this.direction.includes('w')) {
      width -= dx;
    }

    /**
     * South
     */
    if (this.direction.includes('s')) {
      height += dy;
    }

    /**
     * North
     */
    if (this.direction.includes('n')) {
      height -= dy;
    }

    width = this.clampGrid(Math.max(this.minWidth, Math.min(this.maxWidth, width)), 'x');

    height = this.clampGrid(Math.max(this.minHeight, Math.min(this.maxHeight, height)), 'y');

    /**
     * Calculate the intended visual position.
     *
     * This is useful for boundary calculations and
     * emitted resize events.
     */
    let left = this.start.left;
    let top = this.start.top;

    if (this.direction.includes('w')) {
      left = this.start.right - width;
    }

    if (this.direction.includes('n')) {
      top = this.start.bottom - height;
    }

    let moveLeft = left - this.start.left;

    let moveTop = top - this.start.top;

    /**
     * Boundary constraint.
     */
    if (this.boundary) {
      const clamped = clampResizeWithinBoundary(
        this.boundary.getBoundingClientRect(),
        this.start,
        width,
        height,
        moveLeft,
        moveTop,
      );

      width = clamped.width;
      height = clamped.height;

      moveLeft = clamped.left;
      moveTop = clamped.top;

      left = this.start.left + moveLeft;

      top = this.start.top + moveTop;
    }

    return {
      width,
      height,
      moveLeft,
      moveTop,
      left,
      top,
      direction: this.direction,
    };
  }

  private apply(out: IResizableOutput): void {
    const element = this.el.nativeElement;

    /**
     * Always start from the transform that existed
     * before resizing started.
     *
     * This prevents resize translations from accumulating.
     */
    element.style.transform = this.beforeTransform;

    /**
     * First change the actual size.
     *
     * For static/relative/flex/grid elements this can
     * cause the browser to re-layout the element.
     */
    element.style.width = `${out.width}px`;
    element.style.height = `${out.height}px`;

    /**
     * Read the element AFTER layout/reflow.
     *
     * This is the important part.
     */
    const current = element.getBoundingClientRect();

    let correctionX = 0;
    let correctionY = 0;

    /**
     * West resize:
     *
     * The LEFT edge must remain visually fixed.
     *
     * If changing width caused the element to move,
     * compensate that movement with transform.
     */
    if (this.direction.includes('w')) {
      correctionX = this.start.left - current.left;
    }

    /**
     * East resize:
     *
     * The RIGHT edge must remain visually fixed only
     * when the resize operation is supposed to anchor it.
     *
     * For normal east resize, left is the anchor,
     * therefore no correction is needed.
     */
    if (this.direction.includes('n')) {
      correctionY = this.start.top - current.top;
    }

    /**
     * Preserve the original Drag transform and add
     * only the correction produced by Resize.
     */
    this.resizeTranslateX = correctionX;
    this.resizeTranslateY = correctionY;

    const hasCorrection = correctionX !== 0 || correctionY !== 0;

    if (hasCorrection) {
      const base =
        this.beforeTransform && this.beforeTransform !== 'none' ? `${this.beforeTransform} ` : '';

      element.style.transform =
        `${base}translate3d(` + `${correctionX}px, ` + `${correctionY}px, 0)`;
    } else {
      element.style.transform = this.beforeTransform;
    }
  }

  private clampGrid(value: number, axis: 'x' | 'y'): number {
    const grid = typeof this.grid === 'number' ? this.grid : this.grid?.[axis];

    if (!grid || grid <= 0) {
      return value;
    }

    return Math.round(value / grid) * grid;
  }

  private finish(): void {
    this.resizing.set(false);

    /**
     * The transform currently contains:
     *
     *   previous drag transform
     *   +
     *   resize correction
     *
     * Keep it.
     *
     * Do NOT restore beforeTransform.
     */
    this.el.nativeElement.style.transition = this.beforeTransition;

    this.pointerId = -1;

    this.beforeTransform = '';

    this.resizeTranslateX = 0;
    this.resizeTranslateY = 0;
  }

  private resolvedDirections(): ResizeDirection[] {
    const rtl = isRtl(this.el.nativeElement);

    const set = new Set<ResizeDirection>();

    for (const direction of this.directions) {
      set.add(resolveLogicalDirection(direction, rtl) as ResizeDirection);
    }

    return [...set];
  }

  private hitDirection(e: PointerEvent): ResizeDirection | null {
    const element = this.el.nativeElement;

    const rect = element.getBoundingClientRect();

    const edge = Math.min(12, Math.max(6, Math.min(rect.width, rect.height) * 0.18));

    const isLeft = e.clientX - rect.left <= edge;

    const isRight = rect.right - e.clientX <= edge;

    const isTop = e.clientY - rect.top <= edge;

    const isBottom = rect.bottom - e.clientY <= edge;

    /**
     * Explicit resize handle has priority.
     */
    const handle =
      e.target instanceof HTMLElement
        ? e.target.closest<HTMLElement>('[data-ngx-resize-handle]')
        : null;

    if (handle && element.contains(handle)) {
      const raw = handle.dataset['ngxResizeHandle'] as LogicalResizeDirection | undefined;

      if (!raw) {
        return null;
      }

      const resolved = resolveLogicalDirection(raw, isRtl(element)) as ResizeDirection;

      return this.resolvedDirections().includes(resolved) ? resolved : null;
    }

    /**
     * These are PHYSICAL screen directions.
     *
     * left  -> w
     * right -> e
     *
     * RTL is handled only when a logical direction
     * such as "start" / "end" is requested.
     */
    const direction =
      isTop && isLeft
        ? 'nw'
        : isTop && isRight
          ? 'ne'
          : isBottom && isLeft
            ? 'sw'
            : isBottom && isRight
              ? 'se'
              : isTop
                ? 'n'
                : isRight
                  ? 'e'
                  : isBottom
                    ? 's'
                    : isLeft
                      ? 'w'
                      : null;

    if (!direction) {
      return null;
    }

    return this.resolvedDirections().includes(direction) ? direction : null;
  }
}
