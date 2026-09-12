import { Injectable, signal, computed } from '@angular/core';
import { DropZone, IndicatorState, Rect } from '../models/types';

/**
 * DropPositionService
 * -------------------------------------------------------------
 * قلب الگوریتمِ «دقیقاً مثل Webflow» اینجاست.
 *
 * نکتهٔ کلیدی پرفورمنسی: این سرویس هیچ‌وقت روی همهٔ آیتم‌های لیست حلقه نمی‌زند.
 * فقط با استفاده از event delegation (یک لیستنر روی کانتینر) و event.target
 * دقیقاً همان یک المنتی که ماوس رویش است پیدا می‌شود -> O(1) صرف‌نظر از
 * تعداد آیتم‌ها (چه ۱۰ تا باشند چه ۱۰,۰۰۰ تا).
 *
 * منطق تشخیص zone (همانی که Webflow استفاده می‌کند):
 *  ۱. جهت چیدمان پدرِ آیتم هدف را می‌خوانیم (row یا column؛ از flex-direction
 *     یا داده‌شده به‌صورت دستی).
 *  ۲. موقعیت نسبی ماوس داخل rect آیتم هدف را به درصد تبدیل می‌کنیم.
 *  ۳. اگر آیتم هدف خودش یک container (قابل‌نست) باشد و ماوس در «هستهٔ
 *     مرکزی» rect باشد (مثلاً ۲۵٪ تا ۷۵٪ در هر دو محور) -> zone = inside.
 *  ۴. در غیر این صورت، محور اصلیِ چیدمان (که هم‌ردیفی معنی می‌دهد) با
 *     نوار نازک لبه (٪ آستانه) بررسی می‌شود:
 *       - چیدمان row:    نزدیک لبهٔ چپ/راست -> before/after (کنار هم)
 *                        نزدیک لبهٔ بالا/پایین -> above/below (ردیف جدید)
 *       - چیدمان column:  برعکسِ بالا
 */

const EDGE_THRESHOLD = 0.33; // ۳۳٪ نزدیک هر لبه => درج در همان محور
const NEST_CORE = 0.25; // فاصله از هر لبه برای اینکه «هسته» حساب شود

@Injectable({ providedIn: 'root' })
export class DropPositionService {
  private readonly _indicator = signal<IndicatorState>({
    visible: false,
    orientation: null,
    x: 0,
    y: 0,
    length: 0,
    highlightRect: null,
  });

  /** استیت فقط‌خواندنیِ اندیکاتور برای بایند در تمپلیت */
  readonly indicator = computed(() => this._indicator());

  private lastTargetId: string | null = null;
  private lastZone: DropZone | null = null;

  /**
   * فراخوانی در هر pointermove حین درگ.
   * targetEl باید همان element.closest('[data-flow-id]') باشد که در
   * دایرکتیو کانتینر با event delegation پیدا شده — نه یک لوپ روی آیتم‌ها.
   */
  evaluate(params: {
    targetEl: HTMLElement;
    targetId: string;
    isContainer: boolean;
    parentAxis: 'row' | 'column';
    clientX: number;
    clientY: number;
  }): { targetId: string; zone: DropZone } {
    const { targetEl, targetId, isContainer, parentAxis, clientX, clientY } = params;
    const rect = targetEl.getBoundingClientRect();

    const rx = clamp((clientX - rect.left) / rect.width, 0, 1);
    const ry = clamp((clientY - rect.top) / rect.height, 0, 1);

    let zone: DropZone;

    const insideCore =
      isContainer &&
      rx > NEST_CORE && rx < 1 - NEST_CORE &&
      ry > NEST_CORE && ry < 1 - NEST_CORE;

    if (insideCore) {
      zone = 'inside';
    } else if (parentAxis === 'row') {
      if (rx < EDGE_THRESHOLD) zone = 'before';
      else if (rx > 1 - EDGE_THRESHOLD) zone = 'after';
      else zone = ry < 0.5 ? 'above' : 'below';
    } else {
      if (ry < EDGE_THRESHOLD) zone = 'above';
      else if (ry > 1 - EDGE_THRESHOLD) zone = 'below';
      else zone = rx < 0.5 ? 'before' : 'after';
    }

    this.lastTargetId = targetId;
    this.lastZone = zone;
    this.paintIndicator(rect, zone);

    return { targetId, zone };
  }

  /** رسم خط/کادر راهنما - فقط نوشتن به یک signal، بدون لمس بقیهٔ DOM */
  private paintIndicator(rect: DOMRect, zone: DropZone): void {
    const asRect: Rect = {
      top: rect.top, left: rect.left, width: rect.width, height: rect.height,
      right: rect.right, bottom: rect.bottom,
    };

    if (zone === 'inside') {
      this._indicator.set({
        visible: true,
        orientation: null,
        x: 0, y: 0, length: 0,
        highlightRect: asRect,
      });
      return;
    }

    if (zone === 'above' || zone === 'below') {
      this._indicator.set({
        visible: true,
        orientation: 'h',
        x: rect.left,
        y: zone === 'above' ? rect.top : rect.bottom,
        length: rect.width,
        highlightRect: null,
      });
    } else {
      this._indicator.set({
        visible: true,
        orientation: 'v',
        x: zone === 'before' ? rect.left : rect.right,
        y: rect.top,
        length: rect.height,
        highlightRect: null,
      });
    }
  }

  clear(): void {
    this.lastTargetId = null;
    this.lastZone = null;
    this._indicator.set({
      visible: false, orientation: null, x: 0, y: 0, length: 0, highlightRect: null,
    });
  }

  get current(): { targetId: string; zone: DropZone } | null {
    if (!this.lastTargetId || !this.lastZone) return null;
    return { targetId: this.lastTargetId, zone: this.lastZone };
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
