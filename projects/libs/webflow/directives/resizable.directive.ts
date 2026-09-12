import {
  Directive, ElementRef, EventEmitter, Input, Output,
  Renderer2, inject, NgZone, OnDestroy, signal
} from '@angular/core';
import { ResizeHandlePosition, ResizeMoveEvent } from '../models/types';

/**
 * ngxResizable
 * -------------------------------------------------------------
 * تنها دایرکتیو مسئول ریسایز. مستقل از DraggableDirective.
 * روی عنصر اصلی قرار می‌گیرد و به همراه ۸ هندل (که خودت در تمپلیت با
 * class مشخص می‌کنی، مثلاً <span class="rz-handle" data-handle="se">)
 * کار می‌کند.
 *
 * فقط CSS width/height/left/top آپدیت می‌شود (از طریق خروجی flowResize)
 * و مصرف‌کننده تصمیم می‌گیرد این مقادیر را چطور به مدل/استایل بایند کند —
 * دایرکتیو خودش مستقیماً مدل داده را تغییر نمی‌دهد.
 */
@Directive({
  selector: '[ngxResizable]',
  standalone: true,
  exportAs: 'ngxResizable',
})
export class ResizableDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);

  @Input({ required: true }) ngxResizableId!: string;
  @Input() ngxResizableMinWidth = 24;
  @Input() ngxResizableMinHeight = 24;
  @Input() ngxResizableDisabled = false;

  /** انتخاب‌گر هندل‌ها؛ باید attribute یا data-handle داشته باشند */
  @Input() ngxResizeHandleSelector = '[data-handle]';

  @Output() flowResizeStart = new EventEmitter<{ id: string; handle: ResizeHandlePosition }>();
  @Output() flowResizeMove = new EventEmitter<ResizeMoveEvent>();
  @Output() flowResizeEnd = new EventEmitter<ResizeMoveEvent>();

  readonly resizing = signal(false);

  private startX = 0;
  private startY = 0;
  private startW = 0;
  private startH = 0;
  private handle: ResizeHandlePosition = 'se';
  private rafId: number | null = null;
  private pending: { w: number; h: number; ox: number; oy: number } | null = null;
  private unlisten: (() => void) | null = null;

  constructor() {
    this.zone.runOutsideAngular(() => {
      this.unlisten = this.renderer.listen(this.el, 'pointerdown', (e: PointerEvent) => this.onDown(e));
    });
  }

  private onDown(e: PointerEvent): void {
    if (this.ngxResizableDisabled) return;
    const handleEl = (e.target as HTMLElement)?.closest<HTMLElement>(this.ngxResizeHandleSelector);
    if (!handleEl || !this.el.contains(handleEl)) return;

    e.preventDefault();
    e.stopPropagation();

    this.handle = (handleEl.getAttribute('data-handle') as ResizeHandlePosition) || 'se';
    const rect = this.el.getBoundingClientRect();
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startW = rect.width;
    this.startH = rect.height;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.resizing.set(true);
    this.zone.run(() => this.flowResizeStart.emit({ id: this.ngxResizableId, handle: this.handle }));

    const move = (ev: PointerEvent) => this.onMove(ev);
    const up = (ev: PointerEvent) => this.onUp(ev, move, up);
    handleEl.addEventListener('pointermove', move as EventListener);
    handleEl.addEventListener('pointerup', up as EventListener);
    handleEl.addEventListener('pointercancel', up as EventListener);
  }

  private onMove(e: PointerEvent): void {
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const h = this.handle;

    let w = this.startW;
    let ht = this.startH;
    let ox = 0, oy = 0;

    if (h.includes('e')) w = this.startW + dx;
    if (h.includes('w')) { w = this.startW - dx; ox = dx; }
    if (h.includes('s')) ht = this.startH + dy;
    if (h.includes('n')) { ht = this.startH - dy; oy = dy; }

    w = Math.max(this.ngxResizableMinWidth, w);
    ht = Math.max(this.ngxResizableMinHeight, ht);

    this.pending = { w, h: ht, ox, oy };

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        if (!this.pending) return;
        this.zone.run(() => {
          this.flowResizeMove.emit({
            id: this.ngxResizableId, handle: this.handle,
            width: this.pending!.w, height: this.pending!.h,
            offsetX: this.pending!.ox, offsetY: this.pending!.oy,
          });
        });
      });
    }
  }

  private onUp(e: PointerEvent, move: (ev: PointerEvent) => void, up: (ev: PointerEvent) => void): void {
    const handleEl = e.target as HTMLElement;
    handleEl.removeEventListener('pointermove', move as EventListener);
    handleEl.removeEventListener('pointerup', up as EventListener);
    handleEl.removeEventListener('pointercancel', up as EventListener);

    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this.resizing.set(false);

    if (this.pending) {
      this.zone.run(() => {
        this.flowResizeEnd.emit({
          id: this.ngxResizableId, handle: this.handle,
          width: this.pending!.w, height: this.pending!.h,
          offsetX: this.pending!.ox, offsetY: this.pending!.oy,
        });
      });
    }
    this.pending = null;
  }

  ngOnDestroy(): void {
    this.unlisten?.();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
