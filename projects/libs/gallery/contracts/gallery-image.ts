export interface NgxGalleryImage {
  src: string;
  /** برای گرید/نوار تصاویر کوچک؛ نبود یعنی از src استفاده می‌شه */
  thumbSrc?: string;
  alt?: string;
  caption?: string;
}

export type NgxGalleryTheme = 'grid' | 'carousel' | 'slideshow';
