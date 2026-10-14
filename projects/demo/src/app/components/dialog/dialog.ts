import { Component, inject, Injector } from '@angular/core';
import { Dialog, NgxDialogService } from 'ngx-kit/dialog';
import { MyCustomDialog } from './my-custom-dialog/my-custom-dialog';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  standalone: false,
})
export class DialogDemo {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/dialog/dialog.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/dialog/dialog.html', language: 'html' },
    {
      label: 'my-custom-dialog.ts',
      path: 'examples/dialog/my-custom-dialog/my-custom-dialog.ts',
      language: 'typescript',
    },
  ];
  protected readonly dialog = inject(NgxDialogService);
  protected readonly injector = inject(Injector);

  showModal() {
    this.dialog.open(MyCustomDialog, {
      maxWidth: '1200px',
      width: '70dvw',
      injector: this.injector,
    });
  }
}
