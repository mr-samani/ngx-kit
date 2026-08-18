export interface PanZoomState {
  zoom: number;
  panX: number;
  panY: number;
}

/**
 * با تغییر zoom، pan رو طوری تنظیم می‌کنه که نقطه‌ی زیر cursor/انگشت‌ها
 * (نسبت به مرکز کانتینر) سرجاش بمونه — یعنی zoom-to-cursor به‌جای
 * zoom-to-center (که تجربه‌ی خیلی بهتری داره، دقیقاً مثل هر ویوئر حرفه‌ای).
 *
 * ریاضیِ پشتش: با transform="translate(panX,panY) scale(zoom)"، موقعیتِ
 * صفحه‌ایِ یه نقطه‌ی محلیِ p (نسبت به مرکز) برابره با
 * center + pan + p*zoom. اول p رو از روی وضعیت فعلی حساب می‌کنیم، بعد pan
 * جدید رو طوری می‌سازیم که با zoom تازه، همون p به همون مختصات صفحه برسه.
 */
export function zoomAroundPoint(
  current: PanZoomState,
  newZoom: number,
  cursorX: number,
  cursorY: number,
  containerWidth: number,
  containerHeight: number,
): PanZoomState {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const localX = (cursorX - centerX - current.panX) / current.zoom;
  const localY = (cursorY - centerY - current.panY) / current.zoom;
  return {
    zoom: newZoom,
    panX: cursorX - centerX - localX * newZoom,
    panY: cursorY - centerY - localY * newZoom,
  };
}

export function distanceBetweenTouches(a: Touch, b: Touch): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export function midpointOfTouches(a: Touch, b: Touch): { x: number; y: number } {
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
