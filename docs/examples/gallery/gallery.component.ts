import { Component } from '@angular/core';
import {
  NgxImageViewerComponent,
  NgxImageViewerItem,
  NgxImageViewerService,
} from 'ngx-kit/gallery';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [NgxImageViewerComponent, ExampleShowcaseComponent],
})
export class GalleryComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/gallery/gallery.component.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/gallery/gallery.component.html', language: 'html' },
  ];

  protected readonly images: NgxImageViewerItem[] = [
    {
      src: 'https://picsum.photos/id/1015/1400/900',
      alt: 'Mountain and river',
      caption: 'Mountain and river',
    },
    {
      src: 'https://picsum.photos/id/1016/1400/900',
      alt: 'Coastal cliffs',
      caption: 'Coastal cliffs',
    },
    {
      src: 'https://picsum.photos/id/1018/1400/900',
      alt: 'Mountain lake',
      caption: 'Mountain lake',
    },
    { src: 'https://picsum.photos/id/1024/1400/900', alt: 'Dog in nature', caption: 'Dog in nature' },
  ];

  constructor(private readonly viewer: NgxImageViewerService) {}

  openInDialog() {
    this.viewer.open(this.images);
  }
}
