import { Component, inject } from '@angular/core';
import { NgxImageViewer, NgxImageViewerItem } from 'ngx-kit/image-viewer';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
import { NgxDialogService } from 'ngx-kit/dialog';
import { ImageViewDialog } from './image-viewer-dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  imports: [NgxImageViewer, ExampleShowcaseComponent],
})
export class ImageViewerDemoComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/image-viewer/image-viewer.component.ts', language: 'typescript' },
    { label: 'TS', path: 'examples/image-viewer/image-viewer-dialog.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/image-viewer/image-viewer.component.html', language: 'html' },
  ];

  protected readonly images: NgxImageViewerItem[] = [
    {
      src: 'images/gallery/1.jpg',
      alt: 'Nature',
      caption: 'Nature',
    },
    {
      src: 'images/gallery/2.jpg',
      alt: 'Coastal cliffs',
      caption: 'Coastal cliffs',
    },
    {
      src: 'images/gallery/3.jpg',
      alt: 'Mountain lake',
      caption: 'Mountain lake',
    },
    {
      src: 'images/gallery/4.jpg',
      alt: 'Dog in nature',
      caption: 'Dog in nature',
    },
  ];

  protected readonly dialog = inject(NgxDialogService);

  openInDialog() {
    this.dialog.open(ImageViewDialog, {
      data: {
        images: this.images,
      },
      size: 'full',
    });
  }
}
