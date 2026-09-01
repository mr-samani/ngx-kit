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
  host: { '[style.touch-action]': '"none"', class: 'ngx-resizable' },
})
export class NgxResizable {
  @Input() disabled = false;
  @Input() minWidth = 20;
  @Input() minHeight = 20;
  @Input() maxWidth = Infinity;
  @Input() maxHeight = Infinity;
  /** Accepts physical directions (n/e/s/w/...) and logical ones ('start'/'end') that flip in RTL. */
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
  private pointer = { x: 0, y: 0 };
  private before = '';
  private pointerId = -1;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('pointerdown', ['$event']) onPointerDown(e: PointerEvent): void {
    if (this.disabled || e.button !== 0) return;
    const dir = this.hitDirection(e);
    if (!dir) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.direction = dir;
    this.pointerId = e.pointerId;
    this.start = this.el.nativeElement.getBoundingClientRect();
    this.pointer = { x: e.clientX, y: e.clientY };
    this.before = this.el.nativeElement.style.transition;
    this.resizing.set(true);
    this.el.nativeElement.style.transition = 'none';
    this.el.nativeElement.setPointerCapture?.(e.pointerId);
    this.resizeStart.emit(this.calculate(e));
  }

  @HostListener('document:pointermove', ['$event']) onPointerMove(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeMove.emit(out);
  }

  @HostListener('document:pointerup', ['$event']) onPointerUp(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeEnd.emit(out);
    this.finish();
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (!this.resizing()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.el.nativeElement.style.width = `${this.start.width}px`;
      this.el.nativeElement.style.height = `${this.start.height}px`;
      this.finish();
    }
  }

  /**
   * Focus-driven keyboard resize: ArrowRight/ArrowLeft change width along the *logical*
   * inline axis (flipped automatically in RTL), ArrowUp/ArrowDown change height.
   * Requires the host to be focusable (e.g. tabindex="0").
   */
  @HostListener('keydown', ['$event']) onHandleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const rtl = isRtl(this.el.nativeElement);
    const step = this.keyboardStep * (e.shiftKey ? 4 : 1);
    let dw = 0,
      dh = 0;
    if (e.key === 'ArrowRight') dw = rtl ? -step : step;
    else if (e.key === 'ArrowLeft') dw = rtl ? step : -step;
    else if (e.key === 'ArrowDown') dh = step;
    else if (e.key === 'ArrowUp') dh = -step;
    else return;
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
    const dx = e.clientX - this.pointer.x,
      dy = e.clientY - this.pointer.y;
    let left = this.start.left,
      top = this.start.top,
      width = this.start.width,
      height = this.start.height;
    if (this.direction.includes('e')) width += dx;
    if (this.direction.includes('s')) height += dy;
    if (this.direction.includes('w')) {
      width -= dx;
      left += dx;
    }
    if (this.direction.includes('n')) {
      height -= dy;
      top += dy;
    }
    width = this.clampGrid(Math.max(this.minWidth, Math.min(this.maxWidth, width)), 'x');
    height = this.clampGrid(Math.max(this.minHeight, Math.min(this.maxHeight, height)), 'y');
    if (this.direction.includes('w')) left = this.start.right - width;
    if (this.direction.includes('n')) top = this.start.bottom - height;

    let moveLeft = left - this.start.left;
    let moveTop = top - this.start.top;

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

    return { width, height, moveLeft, moveTop, left, top, direction: this.direction };
  }

  private apply(out: IResizableOutput): void {
    const el = this.el.nativeElement;
    el.style.width = `${out.width}px`;
    el.style.height = `${out.height}px`;
  }

  private clampGrid(v: number, axis: 'x' | 'y'): number {
    const g = typeof this.grid === 'number' ? this.grid : this.grid?.[axis];
    return g && g > 0 ? Math.round(v / g) * g : v;
  }

  private finish(): void {
    this.resizing.set(false);
    this.el.nativeElement.style.transition = this.before;
    this.pointerId = -1;
  }

  private resolvedDirections(): ResizeDirection[] {
    const rtl = isRtl(this.el.nativeElement);
    const set = new Set<ResizeDirection>();
    for (const d of this.directions) set.add(resolveLogicalDirection(d, rtl) as ResizeDirection);
    return [...set];
  }

  private hitDirection(e: PointerEvent): ResizeDirection | null {
    const r = this.el.nativeElement.getBoundingClientRect();
    const edge = Math.min(12, Math.max(6, Math.min(r.width, r.height) * 0.18));
    const left = e.clientX - r.left <= edge,
      right = r.right - e.clientX <= edge,
      top = e.clientY - r.top <= edge,
      bottom = r.bottom - e.clientY <= edge;

    // An explicit handle element (data-ngx-resize-handle="se" | "start" | ...) always wins —
    // more precise than edge-proximity heuristics and works well for touch and a11y.
    const handleEl =
      e.target instanceof HTMLElement
        ? e.target.closest<HTMLElement>('[data-ngx-resize-handle]')
        : null;
    if (handleEl && this.el.nativeElement.contains(handleEl)) {
      const raw = handleEl.dataset['ngxResizeHandle'] as LogicalResizeDirection | undefined;
      if (raw) {
        const resolved = resolveLogicalDirection(
          raw,
          isRtl(this.el.nativeElement),
        ) as ResizeDirection;
        return this.resolvedDirections().includes(resolved) ? resolved : null;
      }
    }

    const dir =
      top && left
        ? 'nw'
        : top && right
          ? 'ne'
          : bottom && left
            ? 'sw'
            : bottom && right
              ? 'se'
              : top
                ? 'n'
                : right
                  ? 'e'
                  : bottom
                    ? 's'
                    : left
                      ? 'w'
                      : null;
    return dir && this.resolvedDirections().includes(dir) ? dir : null;
  }
}
