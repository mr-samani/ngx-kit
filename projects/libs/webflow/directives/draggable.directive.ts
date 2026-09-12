import {
  Directive, ElementRef, EventEmitter, Input, Output,
  Renderer2, effect, inject, signal, NgZone, OnDestroy, HostBinding
} from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { DropPositionService } from '../services/drop-position.service';
import { DragStartEvent, DragEndEvent, DropZone } from '../models/types';

/**
 * ngxDraggable
 * -------------------------------------------------------------
 * تنها دایرکتیو مسئول درگ. کل منطق حرکت با CSS transform (translate3d)
 * روی خودِ عنصر درگ‌شونده انجام می‌شود — نه با جابجایی واقعی در DOM لیست.
 * جابجاییِ واقعیِ داده فقط یک‌بار، در لحظهٔ drop، از طریق خروجی
 * (flowDrop) اتفاق می‌افتد و آن‌وقت مصرف‌کننده (کامپوننت کانتینر) با
 * *ngFor + trackBy مدل را آپدیت می‌کند.
 *
 * دلیل مقیاس‌پذیری با هزاران آیتم:
 *  - در حین pointermove هیچ آیتم دیگری لمس/محاسبه نمی‌شود.
 *  - listener مربوط به تشخیص هدف روی کانتینر (event delegation) است،
 *    نه روی تک‌تک آیتم‌ها (این بخش در ContainerDropzoneDirective است).
 *  - آپدیت transform با requestAnimationFrame throttle می‌شود تا از
 *    چندبار layout/paint در هر فریم جلوگیری شود.
 */
@Directive({
  selector: '[ngxDraggable]',
  standalone: true,
  exportAs: 'ngxDraggable',
})
export class DraggableDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);
  private readonly dragDrop = inject(DragDropService);
  private readonly dropPos = inject(DropPositionService);

  /** شناسهٔ یکتای بلاک — برای شناسایی هنگام درگ لازم است */
  @Input({ required: true }) ngxDraggableId!: string;

  /** غیرفعال کردن موقت درگ (مثلاً حین ادیت متن داخل بلاک) */
  @Input() ngxDraggableDisabled = false;

  /** هندلِ اختصاصی؛ اگر ندهی، کل عنصر هندل می‌شود */
  @Input() ngxDragHandleSelector: string | null = null;

  @Output() flowDragStart = new EventEmitter<DragStartEvent>();
  @Output() flowDragEnd = new EventEmitter<DragEndEvent>();

  readonly dragging = signal(false);

  @HostBinding('class.ngx-dragging')
  get draggingClass() { return this.dragging(); }

  @HostBinding('style.touchAction')
  get touchAction() { return 'none'; }

  private startX = 0;
  private startY = 0;
  private originLeft = 0;
  private originTop = 0;
  private rafId: number | null = null;
  private pendingTransform: { x: number; y: number } | null = null;
  private cleanupFns: Array<() => void> = [];

  constructor() {
    this.zone.runOutsideAngular(() => {
      this.cleanupFns.push(
        this.renderer.listen(this.el, 'pointerdown', (e: PointerEvent) => this.onPointerDown(e))
      );
    });
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.ngxDraggableDisabled) return;
    if (e.button !== 0) return;

    if (this.ngxDragHandleSelector) {
      const handle = this.el.querySelector(this.ngxDragHandleSelector);
      if (!handle || !handle.contains(e.target as Node)) return;
    }

    e.preventDefault();
    e.stopPropagation();

    const rect = this.el.getBoundingClientRect();
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.originLeft = rect.left;
    this.originTop = rect.top;

    this.el.setPointerCapture(e.pointerId);
    this.dragging.set(true);
    this.dragDrop.startDrag(this.ngxDraggableId);

    this.zone.run(() => {
      this.flowDragStart.emit({
        id: this.ngxDraggableId,
        pointerId: e.pointerId,
        originRect: {
          top: rect.top, left: rect.left, width: rect.width, height: rect.height,
          right: rect.right, bottom: rect.bottom,
        },
      });
    });

    this.renderer.addClass(this.el, 'ngx-drag-ghost');

    const move = (ev: PointerEvent) => this.onPointerMove(ev);
    const up = (ev: PointerEvent) => this.onPointerUp(ev, move, up);

    this.el.addEventListener('pointermove', move as EventListener);
    this.el.addEventListener('pointerup', up as EventListener);
    this.el.addEventListener('pointercancel', up as EventListener);
  }

  private onPointerMove(e: PointerEvent): void {
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.pendingTransform = { x: dx, y: dy };

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        if (!this.pendingTransform) return;
        // تنها لمسِ DOM در کل چرخهٔ درگ: نوشتن transform روی خودِ عنصر.
        this.renderer.setStyle(
          this.el,
          'transform',
          `translate3d(${this.pendingTransform.x}px, ${this.pendingTransform.y}px, 0)`
        );
      });
    }

    // نتیجهٔ zone فعلی (اگر کانتینر آن را محاسبه کرده) در سرویس در دسترس است.
  }

  private onPointerUp(e: PointerEvent, move: (ev: PointerEvent) => void, up: (ev: PointerEvent) => void): void {
    this.el.removeEventListener('pointermove', move as EventListener);
    this.el.removeEventListener('pointerup', up as EventListener);
    this.el.removeEventListener('pointercancel', up as EventListener);

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.renderer.removeStyle(this.el, 'transform');
    this.renderer.removeClass(this.el, 'ngx-drag-ghost');
    this.dragging.set(false);

    const result = this.dragDrop.endDrag();
    this.dropPos.clear();

    this.zone.run(() => {
      this.flowDragEnd.emit({ id: this.ngxDraggableId, drop: result });
    });
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
