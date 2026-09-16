import { Component, signal } from '@angular/core';
import { NgxDropzoneComponent } from 'ngx-kit/dropzone';
import { NgxImageEditorComponent, NgxImageEditorResult } from 'ngx-kit/image-editor';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss',
  imports: [NgxDropzoneComponent, NgxImageEditorComponent, ExampleShowcaseComponent],
})
export class ImageEditorComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/image-editor/image-editor.component.ts',
      language: 'typescript',
    },
    { label: 'HTML', path: 'examples/image-editor/image-editor.component.html', language: 'html' },
  ];

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly result = signal<NgxImageEditorResult | null>(null);

  onFilesAdded(files: File[]) {
    if (files[0]) {
      this.selectedFile.set(files[0]);
      this.result.set(null);
    }
  }

  onSaved(result: NgxImageEditorResult) {
    this.result.set(result);
    this.selectedFile.set(null);
  }

  onCancelled() {
    this.selectedFile.set(null);
  }

  reset() {
    this.result.set(null);
    this.selectedFile.set(null);
  }
}
