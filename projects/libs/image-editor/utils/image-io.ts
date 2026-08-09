/** یه File/Blob/data-URL/URL رو به یک HTMLImageElement بارگذاری‌شده تبدیل می‌کنه */
export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // برای URLهای cross-origin لازم می‌شه، وگرنه canvas بعداً «tainted» می‌شه
    // و toBlob/toDataURL با SecurityError شکست می‌خوره.
    img.crossOrigin = 'anonymous';

    const objectUrl = typeof source === 'string' ? null : URL.createObjectURL(source);
    const url = objectUrl ?? (source as string);

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('بارگذاری تصویر شکست خورد'));
    };
    img.src = url;
  });
}

/** canvas.toBlob به‌صورت Promise، به‌همراه fallback برای مرورگرهای قدیمی‌تر */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('تبدیل canvas به blob شکست خورد'));
      },
      type,
      quality,
    );
  });
}

/**
 * یه کپیِ کوچیک‌شده از تصویر اصلی می‌سازه که کل UI ویرایشگر (چرخش، کراپ،
 * پیش‌نمایش فیلترها/کارتونی) روی همین کار می‌کنه، نه روی تصویر اصلی که
 * ممکنه چند مگاپیکسل باشه. این باعث می‌شه درگ‌کردنِ اسلایدرها یا لبه‌های
 * کراپ روون بمونه؛ خروجی نهایی (save) همیشه از روی تصویر اصلیِ کامل رندر
 * می‌شه، نه از روی این کپی.
 */
export function createWorkingCopy(img: HTMLImageElement, maxSize = 1200): HTMLCanvasElement {
  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, maxSize, maxSize);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/** ابعاد جدید رو طوری حساب می‌کنه که از maxWidth/maxHeight بیشتر نشه، با حفظ نسبت تصویر */
export function fitWithin(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) return { width, height };
  let ratio = 1;
  if (maxWidth) ratio = Math.min(ratio, maxWidth / width);
  if (maxHeight) ratio = Math.min(ratio, maxHeight / height);
  if (ratio >= 1) return { width, height };
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}
