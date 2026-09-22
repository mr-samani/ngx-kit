import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DIALOG_REF } from 'ngx-kit/dialog';
import { NgxImageViewer, type NgxImageViewerItem } from 'ngx-kit/image-viewer';

@Component({
  template: `
    <ngx-image-viewer [images]="data.images" />
    <button type="button" (click)="close()" class="close-btn">X</button>
  `,
  imports: [NgxImageViewer],
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .close-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      outline: none;
      font-family: cursive;
      font-size: 1.2rem;
    }
  `,
})
export class ImageViewDialog {
  readonly data = inject<{ images: NgxImageViewerItem[] }>(DIALOG_DATA);
  protected readonly dialogRef = inject(DIALOG_REF);
  close() {
    this.dialogRef.close();
  }
}
