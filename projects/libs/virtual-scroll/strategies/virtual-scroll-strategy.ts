import { NgxVirtualScrollViewportRef } from '../tokens/virtual-scroll-viewport-ref';

/**
 * پایه‌ی هر استراتژی محاسبه‌ی بازه‌ی رندر.
 * برای اندازه‌ی متغیر (variable-size) کافیست همین اینترفیس را پیاده‌سازی کنید
 * و در viewport با [scrollStrategy] جایگزین کنید.
 */
export abstract class NgxVirtualScrollStrategy {
  /** viewport به استراتژی متصل می‌شود */
  abstract attach(viewport: NgxVirtualScrollViewportRef): void;

  /** جدا شدن و پاکسازی منابع (subscriptions و ...) */
  abstract detach(): void;

  /** طول دیتاسورس تغییر کرد */
  abstract onDataLengthChanged(): void;

  /** اندازه‌ی viewport (به‌خاطر resize) تغییر کرد */
  abstract onViewportSizeChanged(): void;

  /** رویداد اسکرول رخ داد */
  abstract onScrolled(): void;

  /** درخواست اسکرول برنامه‌ای به یک ایندکس مشخص، باید offset پیکسلی را برگرداند */
  abstract getOffsetForIndex(index: number): number;
}
