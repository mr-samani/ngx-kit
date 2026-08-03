import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

export type Direction = 'ltr' | 'rtl';

/**
 * جهت واقعیِ سند را تشخیص می‌دهد: اول dir روی <body>، بعد dir روی <html>،
 * و در نهایت مقدار محاسبه‌شده‌ی CSS (getComputedStyle) به‌عنوان fallback
 * (برای وقتی جهت با استایل/کلاس تنظیم شده، نه attribute مستقیم).
 */
function resolveDirection(doc: Document): Direction {
  const bodyDir = doc.body?.dir;
  if (bodyDir === 'rtl' || bodyDir === 'ltr') return bodyDir;

  const htmlDir = doc.documentElement.dir;
  if (htmlDir === 'rtl' || htmlDir === 'ltr') return htmlDir;

  return getComputedStyle(doc.documentElement).direction === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * جهت صفحه را به‌صورت خودکار و زنده تشخیص می‌دهد — بدون این‌که کاربرِ این
 * سرویس مجبور باشد چیزی به آن بدهد. هر تغییری در attribute های dir/class
 * روی <html> یا <body> (چه از طریق Angular، چه با یک تم‌سوییچر خارج از
 * Angular) بلافاصله signal را آپدیت می‌کند.
 *
 * نکته: effect() اینجا جواب نمی‌دهد چون هیچ‌کدام از این مقادیر (attribute
 * روی DOM) یک Signal نیستند؛ effect فقط به تغییر Signalها reactive است، نه
 * به تغییرات دلخواه DOM. برای گوش‌دادن به تغییرات DOM باید از MutationObserver
 * استفاده کرد و مقدار را دستی داخل یک Signal نوشت (که دقیقاً کاری است که
 * این سرویس انجام می‌دهد).
 */
@Injectable({ providedIn: 'root' })
export class DirectionService {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _direction = signal<Direction>(resolveDirection(this.doc));

  /** جهت جاری، به‌صورت Signal فقط-خواندنی. */
  readonly direction = this._direction.asReadonly();
  readonly isRtl = computed(() => this._direction() === 'rtl');

  constructor() {
    const observer = new MutationObserver(() => {
      const next = resolveDirection(this.doc);
      if (next !== this._direction()) {
        this._direction.set(next);
      }
    });

    const options: MutationObserverInit = { attributes: true, attributeFilter: ['dir', 'class'] };
    observer.observe(this.doc.documentElement, options);
    if (this.doc.body) observer.observe(this.doc.body, options);

    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
