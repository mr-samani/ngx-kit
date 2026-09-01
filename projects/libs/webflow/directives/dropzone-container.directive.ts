import {
  Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, inject
} from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { DropPositionService } from '../services/drop-position.service';
import { FlowAxis } from '../models/types';

/**
 * ngxDropzoneContainer
 * -------------------------------------------------------------
 * روی هر کانتینری که فرزندانش قابل‌درگ‌اند‌دراپ هستند قرار می‌گیرد
 * (چه ریشهٔ صفحه، چه یک بلاک تو‌در‌تو).
 *
 * فقط یک pointermove-listener سراسری (روی document، حین یک درگ فعال)
 * دارد و با event.target.closest('[data-flow-id]') هدف را پیدا می‌کند.
 * این یعنی صرف‌نظر از اینکه چند هزار فرزند وجود دارد، هزینهٔ هر حرکتِ
 * ماوس ثابت (O(1)) است — نه O(n).
 *
 * هر فرزند مستقیمِ قابل‌درگ باید attribute زیر را داشته باشد
 * (به‌صورت خودکار توسط DraggableDirective/تمپلیت ست می‌شود):
 *   [attr.data-flow-id]="item.id"
 *   [attr.data-flow-container]="isContainer ? '' : null"
 */
@Directive({
  selector: '[ngxDropzoneContainer]',
  standalone: true,
  exportAs: 'ngxDropzoneContainer',
})
export class DropzoneContainerDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly dragDrop = inject(DragDropService);
  private readonly dropPos = inject(DropPositionService);

  /** جهت چیدمان فرزندان مستقیم این کانتینر */
  @Input() ngxDropzoneAxis: FlowAxis = 'row';

  /** آیا خودِ این کانتینر می‌تواند میزبان nest شدن باشد */
  @Input() ngxDropzoneNestable = true;

  private unlistenMove: (() => void) | null = null;
  private unlistenLeave: (() => void) | null = null;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.unlistenMove = this.renderer.listen(this.el, 'pointermove', (e: PointerEvent) => {
        if (!this.dragDrop.isDragging) return;
        this.handleMove(e);
      });
    });
  }

  private handleMove(e: PointerEvent): void {
    const targetEl = (e.target as HTMLElement)?.closest<HTMLElement>('[data-flow-id]');
    if (!targetEl || !this.el.contains(targetEl) || targetEl === this.el) return;

    const targetId = targetEl.getAttribute('data-flow-id');
    const activeId = this.dragDrop.activeId();
    if (!targetId || targetId === activeId) return; // نمی‌توان روی خودش دراپ کرد

    const isContainer = this.ngxDropzoneNestable && targetEl.hasAttribute('data-flow-container');

    const result = this.dropPos.evaluate({
      targetEl,
      targetId,
      isContainer,
      parentAxis: this.ngxDropzoneAxis,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    this.dragDrop.setPendingDrop(result);
  }

  ngOnDestroy(): void {
    this.unlistenMove?.();
    this.unlistenLeave?.();
  }
}
