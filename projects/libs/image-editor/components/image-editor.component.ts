import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from 'ngx-kit/shared';
import {
  NgxCropRect,
  NgxImageEditorAdjustments,
  NgxImageEditorResult,
  NgxImageFilterPreset,
} from '../contracts/image-editor-types';
import { NgxPointerDragDelta, NgxPointerDragDirective } from '../directives/pointer-drag.directive';
import { canvasToBlob, createWorkingCopy, loadImage } from '../utils/image-io';
import { renderComposite, renderRotated } from '../utils/render-pipeline';

type Corner = 'nw' | 'ne' | 'sw' | 'se';

/**
 * ویرایشگر تصویر: کراپ + چرخش + روشنایی/کنتراست/اشباع + فیلترهای آماده
 * (سیاه‌وسفید، سپیا، معکوس، کارتونی) + فشرده‌سازی خروجی. کاملاً روی Canvas
 * خام پیاده شده، بدون هیچ وابستگی خارجی‌ای.
 *
 * نکته‌ی مهمِ معماری: تمام تعامل زنده (چرخوندن، جابه‌جا/ریسایز کراپ‌باکس،
 * پیش‌نمایش فیلترها حتی کارتونی) روی یه کپیِ کوچیک‌شده از تصویر انجام می‌شه
 * (createWorkingCopy)، نه روی تصویر اصلی که ممکنه چند مگاپیکسل باشه — وگرنه
 * درگ‌کردن اسلایدرها/گوشه‌های کراپ رو کاربر حس تاخیر می‌کرد. فقط لحظه‌ی
 * save()، رندر نهایی از روی تصویر اصلیِ کامل انجام می‌شه.
 */
@Component({
  selector: 'ngx-image-editor',
  standalone: true,
  imports: [FormsModule, DecimalPipe, SliderComponent, NgxPointerDragDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss',
  host: { class: 'ngx-image-editor-host' },
})
export class NgxImageEditorComponent {
  source = input<File | Blob | string | null>(null);
  /** قفل نسبتِ کراپ (مثلاً ۱ برای آواتار مربعی)؛ undefined یعنی آزاد */
  aspectRatio = input<number | undefined>(undefined);
  outputMaxWidth = input<number | undefined>(undefined);
  outputMaxHeight = input<number | undefined>(undefined);
  outputType = input<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  /** حداکثر عرض نمایشِ ناحیه‌ی کراپ روی صفحه (پیکسل) */
  displayMaxWidth = input<number>(420);

  saved = output<NgxImageEditorResult>();
  cancelled = output<void>();

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly loadError = signal<string | null>(null);

  private readonly originalImage = signal<HTMLImageElement | null>(null);
  private readonly workingCanvas = signal<HTMLCanvasElement | null>(null);

  protected readonly rotation = signal(0);
  protected readonly brightness = signal(100);
  protected readonly contrast = signal(100);
  protected readonly saturation = signal(100);
  protected readonly filterPreset = signal<NgxImageFilterPreset>('none');
  protected readonly quality = signal(0.92);

  protected readonly crop = signal<NgxCropRect>({ x: 0, y: 0, width: 0, height: 0 });

  protected readonly adjustments = computed<NgxImageEditorAdjustments>(() => ({
    brightness: this.brightness(),
    contrast: this.contrast(),
    saturation: this.saturation(),
    rotation: this.rotation(),
    filter: this.filterPreset(),
  }));

  /** تصویرِ (کوچیک‌شده‌یِ) چرخیده — پایه‌ی نمایش صحنه‌ی کراپ */
  protected readonly rotatedWorkingCanvas = computed(() => {
    const wc = this.workingCanvas();
    if (!wc) return null;
    return renderRotated(wc, wc.width, wc.height, this.rotation());
  });

  protected readonly displayScale = computed(() => {
    const rc = this.rotatedWorkingCanvas();
    if (!rc) return 1;
    return Math.min(1, this.displayMaxWidth() / rc.width);
  });

  protected readonly stageImageUrl = computed(() => {
    const rc = this.rotatedWorkingCanvas();
    return rc ? rc.toDataURL('image/png') : null;
  });

  protected readonly stageSize = computed(() => {
    const rc = this.rotatedWorkingCanvas();
    const scale = this.displayScale();
    return rc ? { width: rc.width * scale, height: rc.height * scale } : { width: 0, height: 0 };
  });

  protected readonly cropOverlayStyle = computed(() => {
    const scale = this.displayScale();
    const c = this.crop();
    return {
      left: `${c.x * scale}px`,
      top: `${c.y * scale}px`,
      width: `${c.width * scale}px`,
      height: `${c.height * scale}px`,
    };
  });

  /** پیش‌نمایش نهایی (کوچیک، حداکثر ۴۸۰ پیکسل) — شامل همه‌چیز، حتی افکت کارتونی */
  protected readonly previewUrl = computed(() => {
    const rc = this.rotatedWorkingCanvas();
    const c = this.crop();
    if (!rc || c.width <= 0 || c.height <= 0) return null;
    const canvas = renderComposite(rc, rc.width, rc.height, c, this.adjustments(), 480, 480);
    return canvas.toDataURL('image/png');
  });

  private moveSnapshot: NgxCropRect | null = null;
  private resizeSnapshot: NgxCropRect | null = null;

  constructor() {
    // بارگذاری تصویر هروقت source عوض بشه
    effect(() => {
      const src = this.source();
      if (!src) {
        this.originalImage.set(null);
        this.workingCanvas.set(null);
        return;
      }
      this.loading.set(true);
      this.loadError.set(null);
      loadImage(src)
        .then((img) => {
          this.originalImage.set(img);
          this.workingCanvas.set(createWorkingCopy(img));
          this.resetAdjustments();
        })
        .catch((err) => this.loadError.set(err?.message ?? 'Failed to load image'))
        .finally(() => this.loading.set(false));
    });

    // هر وقت چرخیده‌شده عوض بشه (بارگذاریِ تصویر جدید یا چرخش)، کراپ روی کل قاب ریست بشه
    effect(() => {
      const rc = this.rotatedWorkingCanvas();
      if (rc) {
        this.crop.set({ x: 0, y: 0, width: rc.width, height: rc.height });
      }
    });
  }

  private resetAdjustments(): void {
    this.rotation.set(0);
    this.brightness.set(100);
    this.contrast.set(100);
    this.saturation.set(100);
    this.filterPreset.set('none');
  }

  protected rotateBy(delta: number): void {
    this.rotation.update((r) => {
      let next = r + delta;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });
  }

  protected setFilter(preset: NgxImageFilterPreset): void {
    this.filterPreset.set(preset);
  }

  // ---------- درگ جابه‌جاییِ کل کراپ‌باکس ----------
  protected onMoveDragStart(): void {
    this.moveSnapshot = { ...this.crop() };
  }

  protected onMoveDragMove(delta: NgxPointerDragDelta): void {
    const rc = this.rotatedWorkingCanvas();
    const snap = this.moveSnapshot;
    if (!rc || !snap) return;
    const scale = this.displayScale();
    const dxSrc = delta.dx / scale;
    const dySrc = delta.dy / scale;
    const maxX = Math.max(0, rc.width - snap.width);
    const maxY = Math.max(0, rc.height - snap.height);
    const x = Math.min(Math.max(0, snap.x + dxSrc), maxX);
    const y = Math.min(Math.max(0, snap.y + dySrc), maxY);
    this.crop.set({ ...snap, x, y });
  }

  // ---------- درگ ریسایز از گوشه‌ها ----------
  protected onResizeDragStart(): void {
    this.resizeSnapshot = { ...this.crop() };
  }

  protected onResizeDragMove(corner: Corner, delta: NgxPointerDragDelta): void {
    const rc = this.rotatedWorkingCanvas();
    const snap = this.resizeSnapshot;
    if (!rc || !snap) return;

    const scale = this.displayScale();
    const dxSrc = delta.dx / scale;
    const dySrc = delta.dy / scale;
    const minSize = 24;

    let { x, y, width, height } = snap;

    if (corner === 'nw' || corner === 'sw') {
      const newX = Math.min(snap.x + dxSrc, snap.x + snap.width - minSize);
      x = Math.max(0, newX);
      width = snap.x + snap.width - x;
    }
    if (corner === 'ne' || corner === 'se') {
      width = Math.min(Math.max(minSize, snap.width + dxSrc), rc.width - snap.x);
    }
    if (corner === 'nw' || corner === 'ne') {
      const newY = Math.min(snap.y + dySrc, snap.y + snap.height - minSize);
      y = Math.max(0, newY);
      height = snap.y + snap.height - y;
    }
    if (corner === 'sw' || corner === 'se') {
      height = Math.min(Math.max(minSize, snap.height + dySrc), rc.height - snap.y);
    }

    const ratio = this.aspectRatio();
    if (ratio) {
      height = width / ratio;
    }

    this.crop.set({ x, y, width, height });
  }

  protected cancel(): void {
    this.cancelled.emit();
  }

  async save(): Promise<void> {
    const original = this.originalImage();
    const working = this.workingCanvas();
    if (!original || !working) return;

    this.saving.set(true);
    try {
      // نسبت مقیاس بین کپیِ کوچیک‌شده (که کراپ/چرخش روش تعریف شده) و تصویر
      // اصلیِ کامل. چون createWorkingCopy مقیاس یکنواخت (هم‌جهت) اعمال
      // می‌کنه، همین یه ضریب برای هر دو بعد و بعد از چرخش هم معتبر می‌مونه.
      const scaleToOriginal = original.naturalWidth / working.width;

      const rotatedFull = renderRotated(
        original,
        original.naturalWidth,
        original.naturalHeight,
        this.rotation(),
      );

      const c = this.crop();
      const cropInFullRes: NgxCropRect = {
        x: c.x * scaleToOriginal,
        y: c.y * scaleToOriginal,
        width: c.width * scaleToOriginal,
        height: c.height * scaleToOriginal,
      };

      const finalCanvas = renderComposite(
        rotatedFull,
        rotatedFull.width,
        rotatedFull.height,
        cropInFullRes,
        this.adjustments(),
        this.outputMaxWidth(),
        this.outputMaxHeight(),
      );

      const type = this.outputType();
      const blob = await canvasToBlob(finalCanvas, type, this.quality());
      const dataUrl = finalCanvas.toDataURL(type, this.quality());
      this.saved.emit({ blob, dataUrl, width: finalCanvas.width, height: finalCanvas.height });
    } finally {
      this.saving.set(false);
    }
  }
}
