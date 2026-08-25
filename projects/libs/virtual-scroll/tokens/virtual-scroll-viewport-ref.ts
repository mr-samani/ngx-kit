import { InjectionToken } from '@angular/core';
import { NgxVirtualScrollRange } from '../types/virtual-scroll-range.interface';

/**
 * قراردادی که هر Viewport باید پیاده‌سازی کند تا استراتژی‌ها
 * بدون وابستگی مستقیم به کامپوننت (و بدون وابستگی چرخه‌ای) بتوانند با آن کار کنند.
 */
export interface NgxVirtualScrollViewportRef {
  /** طول محور اسکرول (ارتفاع برای vertical / عرض برای horizontal) به px */
  getViewportSize(): number;

  /** تعداد کل آیتم‌های دیتاسورس */
  getDataLength(): number;

  /** میزان اسکرول فعلی روی محور اصلی، به px */
  getScrollOffset(): number;

  /** اندازه‌ی کل محتوا (برای ساخت اسکرول‌بار درست) */
  setTotalContentSize(size: number): void;

  /** بازه‌ی ایندکس‌هایی که باید رندر شوند */
  setRenderedRange(range: NgxVirtualScrollRange): void;

  /** آفست content-wrapper نسبت به ابتدای لیست (px) */
  setRenderedContentOffset(offset: number): void;
}

/** توکن تزریق برای انتخاب استراتژی سفارشی به‌جای FixedSize پیش‌فرض */
export const NGX_VIRTUAL_SCROLL_STRATEGY = new InjectionToken<
  import('../strategies/virtual-scroll-strategy').NgxVirtualScrollStrategy
>('NGX_VIRTUAL_SCROLL_STRATEGY');
