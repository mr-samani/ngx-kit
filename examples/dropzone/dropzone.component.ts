import { Component, signal } from '@angular/core';
import { NgxDropzoneComponent, NgxDropzoneRejectedFile } from 'ngx-kit/dropzone';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  imports: [NgxDropzoneComponent, ExampleShowcaseComponent],
})
export class DropzoneComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/dropzone/dropzone.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/dropzone/dropzone.component.html', language: 'html' },
  ];

  protected readonly acceptedCount = signal(0);
  protected readonly rejected = signal<NgxDropzoneRejectedFile[]>([]);

  onFilesAdded(files: File[]) {
    this.acceptedCount.update((n) => n + files.length);
  }

  onFilesRejected(files: NgxDropzoneRejectedFile[]) {
    this.rejected.set(files);
  }
}
