/**
 * افکت «کارتونی»: چون ctx.filter استاندارد چیزی شبیه cartoon نداره (فقط
 * brightness/contrast/saturate/grayscale/sepia/invert/blur/hue-rotate)، این
 * یکی رو واقعاً با پردازش پیکسلی پیاده کردیم؛ دو مرحله:
 *
 *   ۱) Posterize: هر کانال رنگ به تعداد محدودی سطح گرد می‌شه (پهنه‌های رنگیِ
 *      صاف و یکدست، حسِ کارتونی رنگ می‌ده).
 *   ۲) لبه‌یابی Sobel روی نسخه‌ی خاکستریِ تصویر: هرجا شدت لبه از حد آستانه
 *      بیشتر باشه، پیکسل تیره می‌شه (حسِ خط دور کارتونی).
 *
 * روی خودِ ImageData کار می‌کنه، پس هزینه‌ش با اندازه‌ی تصویر خطی‌ست؛ برای
 * تصاویر خیلی بزرگ (>~3000px) بهتره قبلش resize بشه (که در کامپوننت اصلی
 * با fitWithin قبل از اعمال فیلتر انجام می‌شه).
 */
export function applyCartoonEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { levels?: number; edgeThreshold?: number } = {},
): void {
  const levels = options.levels ?? 5;
  const edgeThreshold = options.edgeThreshold ?? 80;

  const imageData = ctx.getImageData(0, 0, width, height);
  const src = imageData.data;

  // ۱) خاکستری برای Sobel
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    gray[p] = (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114) | 0;
  }

  // ۲) Posterize رنگ‌ها
  const step = 255 / (levels - 1);
  for (let i = 0; i < src.length; i += 4) {
    src[i] = Math.round(Math.round(src[i] / step) * step);
    src[i + 1] = Math.round(Math.round(src[i + 1] / step) * step);
    src[i + 2] = Math.round(Math.round(src[i + 2] / step) * step);
  }

  // ۳) Sobel روی gray، خط دور تیره روی src
  const gxKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gyKernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;
      let k = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const v = gray[(y + dy) * width + (x + dx)];
          gx += v * gxKernel[k];
          gy += v * gyKernel[k];
          k++;
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      if (magnitude > edgeThreshold) {
        const idx = (y * width + x) * 4;
        src[idx] = 20;
        src[idx + 1] = 20;
        src[idx + 2] = 20;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
