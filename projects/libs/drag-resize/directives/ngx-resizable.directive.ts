import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  IResizableOutput,
  LogicalResizeDirection,
  ResizeDirection,
} from '../contracts/IResizableOutput';
import { clampResizeWithinBoundary } from '../utils/check-boundary';
import { isRtl, resolveLogicalDirection } from '../utils/rtl';
import {
  applyLinear,
  getLocalToViewportMatrix,
  invertLinear,
  viewportDeltaToLocal,
} from '../utils/coordinate-transform';

const ALL_DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const KEYBOARD_STEP = 8;

/**
 * Elements matching this selector keep their normal pointer/touch behaviour.
 * Add data-ngx-resize-ignore to any custom interactive widget that should never
 * initiate resizing when it is close to the panel edge.
 */
const INTERACTIVE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'option',
  'button',
  'a',
  'summary',
  '[contenteditable="true"]',
  'audio',
  'video',
  'iframe',
  'label',
  '[role="textbox"]',
  '[role="menuitem"]',
  '[role="tab"]',
  'mat-slider',
  'mat-select',
  'mat-checkbox',
  'mat-radio-button',
  'mat-slide-toggle',
  '.mat-mdc-slider',
  '.mat-mdc-select',
  '[role="button"]',
  '[role="slider"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[data-ngx-resize-ignore]',
].join(',');

@Directive({
  selector: '[NgxResizable],[ngxResizable]',
  host: {
    class: 'ngx-resizable',
    // Do not set touch-action:none on the whole panel: it breaks nested controls.
    //  '[style.touch-action]': '"none"',
    '[attr.aria-keyshortcuts]': '"ArrowLeft ArrowRight ArrowUp ArrowDown"',
  },
})
export class NgxResizable implements OnDestroy {
  disabled = model<boolean>(false);
  readonly minWidth = model<number>(20);
  readonly minHeight = model<number>(20);
  readonly maxWidth = model<number>(Infinity);
  readonly maxHeight = model<number>(Infinity);
  readonly directions = input<LogicalResizeDirection[]>([...ALL_DIRECTIONS]);
  readonly grid = input<number | { x: number; y: number }>();

  /** Element whose rect constrains the resize. Previously accepted nowhere on this directive. */
  readonly boundary = input<HTMLElement>();
  /** Pixel step used when resizing via the keyboard (arrow keys, focus required). */
  readonly keyboardStep = input<number>(KEYBOARD_STEP);

  readonly resizeStart = output<IResizableOutput>();
  readonly resizeMove = output<IResizableOutput>();
  readonly resizeEnd = output<IResizableOutput>();
  readonly resizing = signal(false);
  private direction: ResizeDirection = 'se';
  private start!: DOMRect;
  private pointer = { x: 0, y: 0 };
  private beforeTransition = '';
  private beforeWidth = '';
  private beforeHeight = '';
  private beforeTranslate = '';
  private baseComputedTranslate = 'none';
  private keyboardBaseTranslate: string | null = null;
  private keyboardBaseInlineTranslate = '';
  private startMatrix = { a: 1, b: 0, c: 0, d: 1 };
  private pointerInverse = invertLinear({ a: 1, b: 0, c: 0, d: 1 });
  private pointerId = -1;
  private startWidth = 0;
  private startHeight = 0;
  private removeDocumentListeners: Array<() => void> = [];
  private readonly renderer = inject(Renderer2);

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    if (this.resizing()) {
      this.restoreBeforeResize();
      this.finish();
    }
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(e: PointerEvent): void {
    if (this.disabled() || e.button !== 0 || this.resizing()) return;

    const dir = this.hitDirection(e);
    if (dir) this.beginResize(e, dir);
  }

  /** Entry point used by the typed NgxResizeHandle directive. */
  beginResize(e: PointerEvent, direction: LogicalResizeDirection): void {
    if (this.disabled() || e.button !== 0 || this.resizing()) return;
    const dir = resolveLogicalDirection(direction, isRtl(this.el.nativeElement)) as ResizeDirection;
    if (!this.resolvedDirections().includes(dir)) return;
    e.preventDefault();
    const element = this.el.nativeElement;
    this.direction = dir;
    this.pointerId = e.pointerId;
    this.start = element.getBoundingClientRect();
    this.pointer = { x: e.clientX, y: e.clientY };

    this.beforeTransition = element.style.transition;
    this.beforeWidth = element.style.width;
    this.beforeHeight = element.style.height;
    this.beforeTranslate = element.style.translate;
    this.baseComputedTranslate =
      element.ownerDocument.defaultView?.getComputedStyle(element).translate ?? 'none';
    this.keyboardBaseTranslate = null;
    this.startMatrix = getLocalToViewportMatrix(element);
    this.pointerInverse = invertLinear(this.startMatrix);
    this.startWidth = readBorderBoxSize(element, 'x');
    this.startHeight = readBorderBoxSize(element, 'y');

    this.resizing.set(true);
    element.style.transition = 'none';

    try {
      element.setPointerCapture?.(e.pointerId);
    } catch {
      // Document listeners remain as a fallback.
    }

    const doc = element.ownerDocument;
    this.removeDocumentListeners = [
      this.renderer.listen(doc, 'pointermove', (event: PointerEvent) => this.onPointerMove(event)),
      this.renderer.listen(doc, 'pointerup', (event: PointerEvent) => this.onPointerUp(event)),
      this.renderer.listen(doc, 'pointercancel', (event: PointerEvent) =>
        this.onPointerCancel(event),
      ),
      this.renderer.listen(doc, 'lostpointercapture', (event: PointerEvent) =>
        this.onPointerCancel(event),
      ),
      this.renderer.listen(doc, 'keydown', (event: KeyboardEvent) => this.onDocumentKeyDown(event)),
    ];

    const out = this.calculate(e);
    this.apply(out);
    this.resizeStart.emit(out);
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeMove.emit(out);
  }

  private onPointerUp(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeEnd.emit(out);
    this.finish();
  }

  private onDocumentKeyDown(e: KeyboardEvent): void {
    if (!this.resizing() || e.key !== 'Escape') return;
    e.preventDefault();
    this.restoreBeforeResize();
    this.finish();
  }

  private onPointerCancel(e: PointerEvent): void {
    if (!this.resizing() || e.pointerId !== this.pointerId) return;
    this.restoreBeforeResize();
    this.finish();
  }

  private restoreBeforeResize(): void {
    const element = this.el.nativeElement;
    element.style.width = this.beforeWidth;
    element.style.height = this.beforeHeight;
    element.style.translate = this.beforeTranslate;
  }

  /**
   * Keyboard resizing respects the configured directions.
   * The arrow keys move the active physical edge:
   * - if only west is enabled, horizontal keys operate on west;
   * - if only east is enabled, horizontal keys operate on east;
   * - north/south follow the same rule vertically.
   * Disabled axes are never modified.
   */
  @HostListener('keydown', ['$event'])
  onHandleKeyDown(e: KeyboardEvent): void {
    if (this.disabled() || this.resizing()) return;
    if (e.target !== this.el.nativeElement) return;
    if (this.isEditableTarget(e.target)) return;

    const allowed = this.resolvedDirections();
    const horizontalEdge = this.chooseAxisEdge(allowed, 'x', e.key);
    const verticalEdge = this.chooseAxisEdge(allowed, 'y', e.key);

    let dw = 0;
    let dh = 0;
    const configuredStep = this.keyboardStep();
    const step =
      (Number.isFinite(configuredStep) ? Math.max(1, configuredStep) : KEYBOARD_STEP) *
      (e.shiftKey ? 4 : 1);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (!horizontalEdge) return;
      const positive = e.key === 'ArrowRight';
      const rtl = isRtl(this.el.nativeElement);
      const physicalDelta = (positive ? 1 : -1) * (rtl ? -1 : 1);
      // East edge follows pointer direction; west edge moves the opposite way
      // relative to the resulting width.
      dw = horizontalEdge === 'e' ? physicalDelta * step : -physicalDelta * step;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!verticalEdge) return;
      const physicalDelta = e.key === 'ArrowDown' ? 1 : -1;
      dh = verticalEdge === 's' ? physicalDelta * step : -physicalDelta * step;
    } else {
      return;
    }

    e.preventDefault();

    const element = this.el.nativeElement;
    const oldWidth = readBorderBoxSize(element, 'x');
    const oldHeight = readBorderBoxSize(element, 'y');
    let width = oldWidth;
    let height = oldHeight;

    if (dw !== 0) {
      width = this.clampSize(oldWidth + dw, 'x');
    }
    if (dh !== 0) {
      height = this.clampSize(oldHeight + dh, 'y');
    }

    // Keep the opposite edge fixed for west/north keyboard resizing.
    const rect = element.getBoundingClientRect();
    const matrix = getLocalToViewportMatrix(element);
    const scaleX = Math.hypot(matrix.a, matrix.b) || 1;
    const scaleY = Math.hypot(matrix.c, matrix.d) || 1;
    let moveLeft = horizontalEdge === 'w' ? (oldWidth - width) * scaleX : 0;
    let moveTop = verticalEdge === 'n' ? (oldHeight - height) * scaleY : 0;

    const boundary = this.boundary();
    if (boundary) {
      const clamped = clampResizeWithinBoundary(
        boundary.getBoundingClientRect(),
        rect,
        width * scaleX,
        height * scaleY,
        moveLeft,
        moveTop,
      );
      width = clamped.width / scaleX;
      height = clamped.height / scaleY;
      moveLeft = clamped.left;
      moveTop = clamped.top;
    }

    // Keyboard resize keeps a stable base translation and recomputes the total offset
    // on every key press. This prevents an ever-growing chain of calc()/translate values.
    if (this.keyboardBaseTranslate === null) {
      const computed = element.ownerDocument.defaultView?.getComputedStyle(element);
      this.keyboardBaseTranslate = computed?.translate ?? 'none';
      this.keyboardBaseInlineTranslate = element.style.translate;
    }

    const style = this.toStyleSize(width, height);
    element.style.width = `${style.width}px`;
    element.style.height = `${style.height}px`;
    element.style.translate = this.keyboardBaseInlineTranslate;

    // Keep the opposite edge fixed without touching `transform` (owned by NgxDraggable).
    const current = element.getBoundingClientRect();
    const correctionX = rect.left + moveLeft - current.left;
    const correctionY = rect.top + moveTop - current.top;
    if (correctionX || correctionY) {
      const local = viewportDeltaToLocal(element, { x: correctionX, y: correctionY });
      writeTranslateWithOffset(element, this.keyboardBaseTranslate, local);
    } else {
      element.style.translate = this.keyboardBaseInlineTranslate;
    }

    const out: IResizableOutput = {
      width,
      height,
      moveLeft,
      moveTop,
      left: rect.left + moveLeft,
      top: rect.top + moveTop,
      direction: this.keyboardDirection(
        horizontalEdge as 'w' | 'e' | null,
        verticalEdge as 'n' | 's' | null,
      ),
    };
    this.resizeStart.emit(out);
    this.resizeMove.emit(out);
    this.resizeEnd.emit(out);
  }

  private chooseAxisEdge(
    allowed: ResizeDirection[],
    axis: 'x' | 'y',
    key: string,
  ): 'w' | 'e' | 'n' | 's' | null {
    if (axis === 'x') {
      const hasWest = allowed.some((d) => d.includes('w'));
      const hasEast = allowed.some((d) => d.includes('e'));
      if (key === 'ArrowLeft') {
        if (hasWest) return 'w';
        if (hasEast) return 'e';
      }
      if (key === 'ArrowRight') {
        if (hasEast) return 'e';
        if (hasWest) return 'w';
      }
    } else {
      const hasNorth = allowed.some((d) => d.includes('n'));
      const hasSouth = allowed.some((d) => d.includes('s'));
      if (key === 'ArrowUp') {
        if (hasNorth) return 'n';
        if (hasSouth) return 's';
      }
      if (key === 'ArrowDown') {
        if (hasSouth) return 's';
        if (hasNorth) return 'n';
      }
    }
    return null;
  }

  private keyboardDirection(
    horizontal: 'w' | 'e' | null,
    vertical: 'n' | 's' | null,
  ): ResizeDirection {
    if (horizontal && vertical) return `${vertical}${horizontal}` as ResizeDirection;
    return horizontal ?? vertical ?? 'se';
  }

  private isEditableTarget(target: EventTarget | null): boolean {
    if (!isElementTarget(target)) return false;
    return !!target.closest(INTERACTIVE_SELECTOR);
  }

  private calculate(e: PointerEvent): IResizableOutput {
    const delta = applyLinear(this.pointerInverse, {
      x: e.clientX - this.pointer.x,
      y: e.clientY - this.pointer.y,
    });
    let width = this.startWidth;
    let height = this.startHeight;

    if (this.direction.includes('e')) width += delta.x;
    if (this.direction.includes('w')) width -= delta.x;
    if (this.direction.includes('s')) height += delta.y;
    if (this.direction.includes('n')) height -= delta.y;

    width = this.clampSize(width, 'x');
    height = this.clampSize(height, 'y');

    const scaleX = Math.hypot(this.startMatrix.a, this.startMatrix.b) || 1;
    const scaleY = Math.hypot(this.startMatrix.c, this.startMatrix.d) || 1;
    let left = this.start.left;
    let top = this.start.top;

    if (this.direction.includes('w')) left = this.start.right - width * scaleX;
    if (this.direction.includes('n')) top = this.start.bottom - height * scaleY;

    let moveLeft = left - this.start.left;
    let moveTop = top - this.start.top;

    const boundary = this.boundary();
    if (boundary) {
      const clamped = clampResizeWithinBoundary(
        boundary.getBoundingClientRect(),
        this.start,
        width * scaleX,
        height * scaleY,
        moveLeft,
        moveTop,
      );
      width = clamped.width / scaleX;
      height = clamped.height / scaleY;
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
    element.style.translate = this.beforeTranslate;

    const style = this.toStyleSize(out.width, out.height);
    element.style.width = `${style.width}px`;
    element.style.height = `${style.height}px`;

    const current = element.getBoundingClientRect();
    const targetLeft = this.start.left + out.moveLeft;
    const targetTop = this.start.top + out.moveTop;
    const correctionX = targetLeft - current.left;
    const correctionY = targetTop - current.top;

    if (!correctionX && !correctionY) {
      element.style.translate = this.beforeTranslate;
      return;
    }

    const local = viewportDeltaToLocal(element, { x: correctionX, y: correctionY });
    writeTranslateWithOffset(element, this.baseComputedTranslate, local);
  }

  private toStyleSize(width: number, height: number): { width: number; height: number } {
    const el = this.el.nativeElement;
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    if (!cs || cs.boxSizing === 'border-box') return { width, height };

    const px = (v: string) => Number.parseFloat(v) || 0;
    const extraX =
      px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth);
    const extraY =
      px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth);

    return {
      width: Math.max(0, width - extraX),
      height: Math.max(0, height - extraY),
    };
  }

  private clampSize(value: number, axis: 'x' | 'y'): number {
    const minInput = axis === 'x' ? this.minWidth() : this.minHeight();
    const maxInput = axis === 'x' ? this.maxWidth() : this.maxHeight();
    const min = Number.isFinite(minInput) ? Math.max(0, minInput) : 0;
    const max = Number.isFinite(maxInput) ? Math.max(min, maxInput) : Infinity;
    const bounded = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

    const grid = this.grid();
    const step = typeof grid === 'number' ? grid : grid?.[axis];
    if (!step || !Number.isFinite(step) || step <= 0) return bounded;

    // Snap relative to the minimum, then clamp again so grid rounding can never
    // violate the configured min/max constraints.
    const snapped = min + Math.round((bounded - min) / step) * step;
    return Math.min(max, Math.max(min, snapped));
  }

  private finish(): void {
    this.resizing.set(false);
    this.el.nativeElement.style.transition = this.beforeTransition;
    const pointerId = this.pointerId;
    this.pointerId = -1;

    for (const remove of this.removeDocumentListeners) remove();
    this.removeDocumentListeners = [];

    try {
      if (pointerId >= 0 && this.el.nativeElement.hasPointerCapture?.(pointerId)) {
        this.el.nativeElement.releasePointerCapture(pointerId);
      }
    } catch {
      // Pointer capture may already have been released.
    }
    this.beforeTranslate = '';
    this.baseComputedTranslate = 'none';
    this.keyboardBaseTranslate = null;
    this.keyboardBaseInlineTranslate = '';
  }

  private resolvedDirections(): ResizeDirection[] {
    const rtl = isRtl(this.el.nativeElement);
    const set = new Set<ResizeDirection>();
    for (const direction of this.directions()) {
      set.add(resolveLogicalDirection(direction, rtl) as ResizeDirection);
    }
    return [...set];
  }

  private hitDirection(e: PointerEvent): ResizeDirection | null {
    const element = this.el.nativeElement;
    const target = e.target;

    // Explicit handles are allowed even when they are inside the panel.
    const handle = isElementTarget(target)
      ? target.closest<HTMLElement>('[data-ngx-resize-handle]')
      : null;

    if (handle && element.contains(handle)) {
      const raw = handle.dataset['ngxResizeHandle'] as LogicalResizeDirection | undefined;
      if (!raw) return null;
      const resolved = resolveLogicalDirection(raw, isRtl(element)) as ResizeDirection;
      return this.resolvedDirections().includes(resolved) ? resolved : null;
    }

    // Never steal pointer events from nested interactive controls.
    if (isElementTarget(target) && target.closest(INTERACTIVE_SELECTOR)) return null;

    const rect = element.getBoundingClientRect();
    const edge = Math.min(12, Math.max(6, Math.min(rect.width, rect.height) * 0.18));
    const isLeft = e.clientX - rect.left <= edge;
    const isRight = rect.right - e.clientX <= edge;
    const isTop = e.clientY - rect.top <= edge;
    const isBottom = rect.bottom - e.clientY <= edge;

    const candidates: ResizeDirection[] = [];
    if (isTop && isLeft) candidates.push('nw', 'n', 'w');
    else if (isTop && isRight) candidates.push('ne', 'n', 'e');
    else if (isBottom && isLeft) candidates.push('sw', 's', 'w');
    else if (isBottom && isRight) candidates.push('se', 's', 'e');
    else if (isTop) candidates.push('n');
    else if (isRight) candidates.push('e');
    else if (isBottom) candidates.push('s');
    else if (isLeft) candidates.push('w');

    const allowed = new Set(this.resolvedDirections());
    return candidates.find((candidate) => allowed.has(candidate)) ?? null;
  }
}

function isElementTarget(target: EventTarget | null): target is Element {
  return (
    !!target &&
    typeof target === 'object' &&
    'nodeType' in target &&
    (target as Node).nodeType === 1 &&
    'closest' in target
  );
}

function readBorderBoxSize(element: HTMLElement, axis: 'x' | 'y'): number {
  const win = element.ownerDocument.defaultView;
  const style = win?.getComputedStyle(element);
  if (!style) return axis === 'x' ? element.offsetWidth : element.offsetHeight;

  const horizontal = axis === 'x';
  const size = Number.parseFloat(horizontal ? style.width : style.height) || 0;
  if (style.boxSizing === 'border-box') return size;

  const px = (value: string) => Number.parseFloat(value) || 0;
  return (
    size +
    (horizontal
      ? px(style.paddingLeft) +
        px(style.paddingRight) +
        px(style.borderLeftWidth) +
        px(style.borderRightWidth)
      : px(style.paddingTop) +
        px(style.paddingBottom) +
        px(style.borderTopWidth) +
        px(style.borderBottomWidth))
  );
}

/**
 * Compose a resize-only offset with the existing CSS individual `translate` value.
 * Keeping the original CSS tokens (instead of parseFloat) preserves percentages, calc(),
 * and variables. The `transform` channel remains exclusively owned by NgxDraggable.
 */
function writeTranslateWithOffset(
  element: HTMLElement,
  baseValue: string,
  offset: { x: number; y: number },
): void {
  const [baseX, baseY, baseZ] = splitCssComponents(
    !baseValue || baseValue === 'none' ? '0px 0px 0px' : baseValue,
  );
  const x = offset.x ? `calc(${baseX ?? '0px'} ${formatOffset(offset.x)})` : (baseX ?? '0px');
  const y = offset.y ? `calc(${baseY ?? '0px'} ${formatOffset(offset.y)})` : (baseY ?? '0px');
  element.style.translate = `${x} ${y} ${baseZ ?? '0px'}`;
}

function splitCssComponents(value: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let token = '';
  for (const char of value.trim()) {
    if (char === '(') depth++;
    if (char === ')') depth = Math.max(0, depth - 1);
    if (/\s/.test(char) && depth === 0) {
      if (token) result.push(token);
      token = '';
    } else {
      token += char;
    }
  }
  if (token) result.push(token);
  return result;
}

function formatOffset(value: number): string {
  return value < 0
    ? `- ${Number(Math.abs(value).toFixed(4))}px`
    : `+ ${Number(value.toFixed(4))}px`;
}
