export interface NgxCropRect {
  /** همه به پیکسل‌های واقعیِ تصویر مبدأ (نه پیکسل صفحه) */
  x: number;
  y: number;
  width: number;
  height: number;
}

export type NgxImageFilterPreset = 'none' | 'grayscale' | 'sepia' | 'invert' | 'cartoon';

export interface NgxImageEditorAdjustments {
  /** همه ۱۰۰ یعنی بدون تغییر؛ بازه‌ی معقول ۰ تا ۲۰۰ */
  brightness: number;
  contrast: number;
  saturation: number;
  /** درجه، ۹۰-درجه‌ای یا آزاد */
  rotation: number;
  filter: NgxImageFilterPreset;
}

export interface NgxImageEditorResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}
