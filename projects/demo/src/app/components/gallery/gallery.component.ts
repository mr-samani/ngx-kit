import { Component, signal } from '@angular/core';
import { NgxGalleryComponent, NgxGalleryImage, NgxGalleryTheme } from 'ngx-kit/gallery';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [NgxGalleryComponent, ExampleShowcaseComponent],
})
export class GalleryComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/gallery/gallery.component.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/gallery/gallery.component.html', language: 'html' },
  ];

  protected readonly theme = signal<NgxGalleryTheme>('grid');

  protected readonly images: NgxGalleryImage[] = [
    {
      src: 'https://picsum.photos/id/1015/1200/800',
      thumbSrc: 'https://picsum.photos/id/1015/200/200',
      alt: 'کوه و رودخانه',
      caption: 'کوه و رودخانه',
    },
    {
      src: 'https://picsum.photos/id/1016/1200/800',
      thumbSrc: 'https://picsum.photos/id/1016/200/200',
      alt: 'صخره‌های ساحلی',
      caption: 'صخره‌های ساحلی',
    },
    {
      src: 'https://picsum.photos/id/1018/1200/800',
      thumbSrc: 'https://picsum.photos/id/1018/200/200',
      alt: 'دریاچه‌ی کوهستانی',
      caption: 'دریاچه‌ی کوهستانی',
    },
    {
      src: 'https://picsum.photos/id/1022/1200/800',
      thumbSrc: 'https://picsum.photos/id/1022/200/200',
      alt: 'بیابان',
      caption: 'بیابان',
    },
    {
      src: 'https://picsum.photos/id/1024/1200/800',
      thumbSrc: 'https://picsum.photos/id/1024/200/200',
      alt: 'سگ در طبیعت',
      caption: 'سگ در طبیعت',
    },
    {
      src: 'https://picsum.photos/id/1035/1200/800',
      thumbSrc: 'https://picsum.photos/id/1035/200/200',
      alt: 'جنگل مه‌آلود',
      caption: 'جنگل مه‌آلود',
    },
  ];

  setTheme(t: NgxGalleryTheme) {
    this.theme.set(t);
  }
}
