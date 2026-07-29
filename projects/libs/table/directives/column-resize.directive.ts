import { Directive, HostListener, input, output } from '@angular/core';

/**
 * Drag handle placed on the inline-end edge of a <th>. Emits live width
 * updates while dragging (`resizing`) and a final value on release
 * (`resizeEnd`), which the table uses to lock the column at that width via
 * <colgroup><col style="width..."> — so it never silently reflows again.
 *
 * Direction-aware: in RTL the handle sits visually on the left and dragging
 * left grows the column, exactly mirroring LTR behavior on the right edge.
 */
@Directive({
  selector: '[ngxColumnResize]',
  standalone: true,
  host: {
    '[class.ngx-table__resize-handle]': 'resizable()',
    role: 'separator',
    'aria-orientation': 'vertical',
  },
})
export class ColumnResizeDirective {
  readonly resizable = input<boolean>(true, { alias: 'ngxColumnResizeEnable' });
  readonly startWidth = input.required<number>({ alias: 'ngxColumnResizeWidth' });
  readonly minWidth = input<number>(40, { alias: 'ngxColumnResizeMin' });
  readonly maxWidth = input<number>(1000, { alias: 'ngxColumnResizeMax' });
  readonly direction = input<'ltr' | 'rtl'>('ltr', { alias: 'ngxColumnResizeDir' });

  readonly resizing = output<number>();
  readonly resizeEnd = output<number>();

  private dragging = false;
  private startX = 0;
  private baseWidth = 0;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.resizable()) return;

    this.dragging = true;
    this.startX = event.clientX;
    this.baseWidth = this.startWidth();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.resizing.emit(this.computeWidth(event.clientX));
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.resizeEnd.emit(this.computeWidth(event.clientX));
  }

  private computeWidth(clientX: number): number {
    const delta = clientX - this.startX;
    const signedDelta = this.direction() === 'rtl' ? -delta : delta;
    const raw = this.baseWidth + signedDelta;
    return Math.min(this.maxWidth(), Math.max(this.minWidth(), raw));
  }
}
