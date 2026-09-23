import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DIALOG_REF } from 'ngx-kit/dialog';
import {
  NgxImageViewer,
  NgxImageViewerItem,
  NgxImageViewerToolbarConfig,
} from 'ngx-kit/image-viewer';

@Component({
  template: `
    <ngx-image-viewer [images]="data.images" [toolbar]="toolbar" (closed)="close()" />
  `,
  imports: [NgxImageViewer],
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class ImageViewDialog {
  toolbar: NgxImageViewerToolbarConfig = {
    close: true,
  };
  readonly data = inject<{ images: NgxImageViewerItem[] }>(DIALOG_DATA);
  protected readonly dialogRef = inject(DIALOG_REF);
  close() {
    this.dialogRef.close();
  }
}
