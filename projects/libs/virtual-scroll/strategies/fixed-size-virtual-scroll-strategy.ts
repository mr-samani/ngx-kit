import { NgxVirtualScrollStrategy } from './virtual-scroll-strategy';
import { NgxVirtualScrollViewportRef } from '../tokens/virtual-scroll-viewport-ref';
import { NgxVirtualScrollRange, rangesEqual } from '../types/virtual-scroll-range.interface';

/**
 * استراتژی fixed-size: همه‌ی آیتم‌ها اندازه‌ی ثابت `itemSize` دارند.
 * هم برای عمودی (ردیف‌های جدول) و هم افقی (ستون‌های جدول) قابل استفاده است،
 * چون فقط با یک محور (اندازه‌ی خطی) کار می‌کند و viewport مسئول تفسیر جهت است.
 *
 * محاسبه‌ی بازه فقط زمانی دوباره انجام می‌شود که اسکرول به فاصله‌ی
 * کمتر از minBufferPx از لبه‌ی بازه‌ی فعلی برسد؛ نه در هر پیکسل اسکرول.
 * این دقیقاً همان بهینه‌سازی‌ای است که CDK هم استفاده می‌کند.
 */
export class NgxFixedSizeVirtualScrollStrategy implements NgxVirtualScrollStrategy {
  private viewport: NgxVirtualScrollViewportRef | null = null;

  private renderedRange: NgxVirtualScrollRange = { start: 0, end: 0 };
  /** آفست پیکسلی شروع بازه‌ی رندر شده (برای تشخیص نیاز به recalculation) */
  private renderedContentOffset = 0;

  constructor(
    private itemSize: number,
    private minBufferPx: number,
    private maxBufferPx: number
  ) {}

  /** برای تغییر پارامترها بدون ساخت استراتژی جدید (وقتی @Input تغییر می‌کند) */
  updateItemAndBufferSize(itemSize: number, minBufferPx: number, maxBufferPx: number): void {
    if (maxBufferPx < minBufferPx) {
      throw new Error('ngx-virtual-scroll: maxBufferPx باید بزرگ‌تر یا مساوی minBufferPx باشد.');
    }
    this.itemSize = itemSize;
    this.minBufferPx = minBufferPx;
    this.maxBufferPx = maxBufferPx;
    this.onViewportSizeChanged();
  }

  attach(viewport: NgxVirtualScrollViewportRef): void {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateRenderedRange(true);
  }

  detach(): void {
    this.viewport = null;
  }

  onDataLengthChanged(): void {
    this.updateTotalContentSize();
    this.updateRenderedRange(true);
  }

  onViewportSizeChanged(): void {
    this.updateRenderedRange(true);
  }

  onScrolled(): void {
    this.updateRenderedRange(false);
  }

  getOffsetForIndex(index: number): number {
    return index * this.itemSize;
  }

  private updateTotalContentSize(): void {
    if (!this.viewport || this.itemSize <= 0) return;
    const length = this.viewport.getDataLength();
    this.viewport.setTotalContentSize(length * this.itemSize);
  }

  private updateRenderedRange(force: boolean): void {
    const viewport = this.viewport;
    if (!viewport || this.itemSize <= 0) return;

    const scrollOffset = viewport.getScrollOffset();
    const viewportSize = viewport.getViewportSize();
    const dataLength = viewport.getDataLength();

    const renderedStartOffset = this.renderedRange.start * this.itemSize;
    const renderedEndOffset = this.renderedRange.end * this.itemSize;

    const distanceToStart = scrollOffset - renderedStartOffset;
    const distanceToEnd = renderedEndOffset - (scrollOffset + viewportSize);

    // اگر هنوز به اندازه‌ی کافی بافر باقی مانده، نیازی به محاسبه‌ی دوباره نیست
    if (!force && distanceToStart >= this.minBufferPx && distanceToEnd >= this.minBufferPx) {
      return;
    }

    const bufferStart = Math.max(0, scrollOffset - this.maxBufferPx);
    const bufferEnd = scrollOffset + viewportSize + this.maxBufferPx;

    const start = Math.max(0, Math.floor(bufferStart / this.itemSize));
    const end = Math.min(dataLength, Math.ceil(bufferEnd / this.itemSize));

    const newRange: NgxVirtualScrollRange = { start, end };

    if (!rangesEqual(newRange, this.renderedRange)) {
      this.renderedRange = newRange;
      viewport.setRenderedRange(newRange);
    }

    this.renderedContentOffset = start * this.itemSize;
    viewport.setRenderedContentOffset(this.renderedContentOffset);
  }
}
