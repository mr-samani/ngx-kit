export interface NgxImageViewerItem {
  src: string;
  alt?: string;
  caption?: string;
  /** نام فایل هنگام دانلود؛ نبود یعنی از روی src حدس زده می‌شه */
  downloadFileName?: string;
}

/**
 * هر دکمه‌ی نوار ابزار جدا فعال/غیرفعال می‌شه — دقیقاً طبق خواسته: «این
 * دکمه‌های کانفیگی باشه که هر کدوم خواست فعال کنه».
 */
export interface NgxImageViewerToolbarConfig {
  prevNext?: boolean;
  counter?: boolean;
  zoomIn?: boolean;
  zoomOut?: boolean;
  resetZoom?: boolean;
  rotateLeft?: boolean;
  rotateRight?: boolean;
  download?: boolean;
  print?: boolean;
  fullscreen?: boolean;
  close?: boolean;
}

export const NGX_IMAGE_VIEWER_DEFAULT_TOOLBAR: Required<NgxImageViewerToolbarConfig> = {
  prevNext: true,
  counter: true,
  zoomIn: true,
  zoomOut: true,
  resetZoom: true,
  rotateLeft: true,
  rotateRight: true,
  download: true,
  print: true,
  fullscreen: true,
  close: false,
};
