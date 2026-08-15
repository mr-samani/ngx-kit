import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

/**
 * دستگیره‌ی درگ برای ریسایز ستون. روی لبه‌ی «انتهای منطقی» (inline-end) قرار
 * می‌گیرد، یعنی خودش زیر [dir="rtl"] جابه‌جا می‌شود؛ فقط جهت محاسبه‌ی دلتا هم
 * برعکس می‌شود تا حس درگ همیشه طبیعی باشد.
 *
 * مقدار نهایی توسط جدول در یک Map از عرض‌ها ذخیره می‌شود (نه در استایل مستقیم
 * ستون)، به همراه علامت‌گذاری «دستی ریسایز شده» — یعنی بعد از این، هیچ
 * re-render یا تغییر داده‌ای این عرض را از بین نمی‌برد.
 */
@Directive({
  selector: '[ngxColumnResize]',
  standalone: true,
  host: {
    class: 'ngx-table__resize-handle',
    role: 'separator',
    'aria-orientation': 'vertical',
  },
})
export class ColumnResize {
  readonly startWidth = input.required<number>({ alias: 'ngxColumnResizeWidth' });
  readonly minWidth = input<number>(40, { alias: 'ngxColumnResizeMin' });
  readonly maxWidth = input<number>(1000, { alias: 'ngxColumnResizeMax' });
  readonly direction = input<'ltr' | 'rtl'>('ltr', { alias: 'ngxColumnResizeDir' });

  readonly resizing = output<number>();
  readonly resizeEnd = output<number>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private dragging = false;
  private startX = 0;
  private baseWidth = 0;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = true;
    this.startX = event.clientX;
    // اندازه‌ی واقعیِ رندرشده‌ی ستون رو می‌گیریم، نه فقط input ورودی — چون
    // ستون‌هایی که width صریح ندارن (flex:1 1 0، فضای باقی‌مونده رو پر
    // می‌کنن) هیچ عرض عددیِ از‌پیش‌شناخته‌شده‌ای ندارن؛ تنها منبع درستِ
    // «عرض فعلی» برای شروع محاسبه‌ی درگ، خودِ DOM هست.
    const measured = this.elementRef.nativeElement.parentElement?.getBoundingClientRect().width;
    this.baseWidth = measured && measured > 0 ? measured : this.startWidth();
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
