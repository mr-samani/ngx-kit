import { NgxCropRect, NgxImageEditorAdjustments } from '../contracts/image-editor-types';
import { applyCartoonEffect } from './cartoonify';
import { fitWithin } from './image-io';

/** تصویر مبدأ رو با زاویه‌ی داده‌شده روی یه canvas جدید (به اندازه‌ی bounding-box نتیجه) می‌چرخونه */
export function renderRotated(
  source: CanvasImageSource,
  width: number,
  height: number,
  degrees: number,
): HTMLCanvasElement {
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.max(1, Math.round(width * cos + height * sin));
  const newH = Math.max(1, Math.round(width * sin + height * cos));

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.drawImage(source, -width / 2, -height / 2, width, height);
  return canvas;
}

function buildCssFilter(adjustments: NgxImageEditorAdjustments): string {
  const parts = [
    `brightness(${adjustments.brightness}%)`,
    `contrast(${adjustments.contrast}%)`,
    `saturate(${adjustments.saturation}%)`,
  ];
  if (adjustments.filter === 'grayscale') parts.push('grayscale(1)');
  if (adjustments.filter === 'sepia') parts.push('sepia(1)');
  if (adjustments.filter === 'invert') parts.push('invert(1)');
  return parts.join(' ');
}

/**
 * کراپ + فیلترها رو روی یه canvas خروجی می‌سازه. brightness/contrast/
 * saturation/grayscale/sepia/invert همه با ctx.filter بومیِ Canvas 2D انجام
 * می‌شن (شتاب‌دهی‌شده توسط مرورگر، بدون حلقه‌ی پیکسلی دستی)؛ فقط cartoon
 * (که معادل بومی نداره) با پردازش پیکسلی جدا انجام می‌شه.
 *
 * maxWidth/maxHeight برای دو حالت استفاده می‌شه: پیش‌نمایش زنده (عدد کوچیک،
 * برای واکنش‌گرا موندن حین کشیدن اسلایدرها) و خروجی نهایی (بدون محدودیت یا
 * محدودیت دلخواه کاربر).
 */
export function renderComposite(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  crop: NgxCropRect,
  adjustments: NgxImageEditorAdjustments,
  maxWidth?: number,
  maxHeight?: number,
): HTMLCanvasElement {
  const { width: outW, height: outH } = fitWithin(crop.width, crop.height, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, outW);
  canvas.height = Math.max(1, outH);
  const ctx = canvas.getContext('2d')!;

  ctx.filter = buildCssFilter(adjustments);
  ctx.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';

  if (adjustments.filter === 'cartoon') {
    applyCartoonEffect(ctx, canvas.width, canvas.height);
  }

  return canvas;
}
