import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import { IResizableOutput, ResizeDirection } from '../contracts/IResizableOutput';

@Directive({
  selector: '[NgxResizable],[ngxResizable]',
  host: { '[style.touch-action]': '"none"' },
})
export class NgxResizable {
  @Input() disabled = false;
  @Input() minWidth = 20;
  @Input() minHeight = 20;
  @Input() maxWidth = Infinity;
  @Input() maxHeight = Infinity;
  @Input() directions: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
  @Input() grid?: number | { x: number; y: number };
  @Output() readonly resizeStart = new EventEmitter<IResizableOutput>();
  @Output() readonly resizeMove = new EventEmitter<IResizableOutput>();
  @Output() readonly resizeEnd = new EventEmitter<IResizableOutput>();
  readonly resizing = signal(false);
  private direction: ResizeDirection = 'se';
  private start!: DOMRect;
  private pointer = { x: 0, y: 0 };
  private before = '';
  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('pointerdown', ['$event']) onPointerDown(e: PointerEvent): void {
    if (this.disabled || e.button !== 0) return;
    const dir = this.hitDirection(e);
    if (!dir) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.direction = dir;
    this.start = this.el.nativeElement.getBoundingClientRect();
    this.pointer = { x: e.clientX, y: e.clientY };
    this.before = this.el.nativeElement.style.transition;
    this.resizing.set(true);
    this.el.nativeElement.style.transition = 'none';
    this.el.nativeElement.setPointerCapture?.(e.pointerId);
    this.resizeStart.emit(this.calculate(e));
  }
  @HostListener('document:pointermove', ['$event']) onPointerMove(e: PointerEvent): void {
    if (!this.resizing()) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeMove.emit(out);
  }
  @HostListener('document:pointerup', ['$event']) onPointerUp(e: PointerEvent): void {
    if (!this.resizing()) return;
    const out = this.calculate(e);
    this.apply(out);
    this.resizeEnd.emit(out);
    this.resizing.set(false);
    this.el.nativeElement.style.transition = this.before;
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
    width = this.snap(Math.max(this.minWidth, Math.min(this.maxWidth, width)), 'x');
    height = this.snap(Math.max(this.minHeight, Math.min(this.maxHeight, height)), 'y');
    if (this.direction.includes('w')) left = this.start.right - width;
    if (this.direction.includes('n')) top = this.start.bottom - height;
    return {
      width,
      height,
      moveLeft: left - this.start.left,
      moveTop: top - this.start.top,
      left,
      top,
      direction: this.direction,
    };
  }
  private apply(out: IResizableOutput): void {
    const el = this.el.nativeElement;
    el.style.width = `${out.width}px`;
    el.style.height = `${out.height}px`;
  }
  private snap(v: number, axis: 'x' | 'y'): number {
    const g = typeof this.grid === 'number' ? this.grid : this.grid?.[axis];
    return g && g > 0 ? Math.round(v / g) * g : v;
  }
  private hitDirection(e: PointerEvent): ResizeDirection | null {
    const r = this.el.nativeElement.getBoundingClientRect();
    const edge = Math.min(12, Math.max(6, Math.min(r.width, r.height) * 0.18));
    const left = e.clientX - r.left <= edge,
      right = r.right - e.clientX <= edge,
      top = e.clientY - r.top <= edge,
      bottom = r.bottom - e.clientY <= edge;
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
    return dir && this.directions.includes(dir) ? dir : null;
  }
}
