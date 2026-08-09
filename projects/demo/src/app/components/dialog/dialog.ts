import { Component } from '@angular/core';
import { Dialog, NgxDialogModule } from 'ngx-kit/dialog';
import { MyCostomDialog } from './my-costom-dialog/my-costom-dialog';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  imports: [NgxDialogModule, ExampleShowcaseComponent],
})
export class DialogDemo {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/dialog/dialog.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/dialog/dialog.html', language: 'html' },
    {
      label: 'my-costom-dialog.ts',
      path: '/examples/dialog/my-costom-dialog/my-costom-dialog.ts',
      language: 'typescript',
    },
  ];

  showModal() {
    Dialog.open(MyCostomDialog);
  }
}
