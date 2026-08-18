import { Directive, HostListener, output } from '@angular/core';

export interface NgxPointerDragDelta {
  dx: number;
  dy: number;
}

/**
 * درگ عمومی روی پایه‌ی Pointer Events + setPointerCapture (دقیقاً همون
 * تکنیکی که در ngx-kit/data-table برای ریسایز ستون استفاده شده) — نیازی به
 * listener سطح document نداره چون بعد از setPointerCapture، رویدادهای
 * pointermove/pointerup حتی بیرون از محدوده‌ی المنت هم به خودش می‌رسن.
 *
 * dx/dy تجمعی از لحظه‌ی pointerdown هستن (نه دلتای بین دو move متوالی)، چون
 * معمولاً مصرف‌کننده می‌خواد «موقعیت شروع + دلتای کل» رو حساب کنه، نه جمع
 * تدریجی گرد شونده‌ی دلتاهای ریز.
 */
@Directive({
  selector: '[ngxPointerDrag]',
  standalone: true,
})
export class NgxPointerDragDirective {
  dragStart = output<void>();
  dragMove = output<NgxPointerDragDelta>();
  dragEnd = output<void>();

  private dragging = false;
  private startX = 0;
  private startY = 0;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dragging = true;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this.dragStart.emit();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent): void {
    if (!this.dragging) return;
    this.dragMove.emit({ dx: ev.clientX - this.startX, dy: ev.clientY - this.startY });
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  onPointerUp(): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.dragEnd.emit();
  }
}
