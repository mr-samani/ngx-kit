import { Component, inject, signal } from '@angular/core';
import { NgxDialogService, type NgxDialogSize } from 'ngx-kit/dialog';
import { MyCustomDialog } from './my-custom-dialog/my-custom-dialog';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';

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
    { label: 'SCSS', path: 'examples/dialog/dialog.scss', language: 'scss' },
    { label: 'Module', path: 'examples/dialog/dialog.module.ts', language: 'typescript' },
    {
      label: 'my-custom-dialog.ts',
      path: 'examples/dialog/my-custom-dialog/my-custom-dialog.ts',
      language: 'typescript',
    },
    {
      label: 'my-custom-dialog.html',
      path: 'examples/dialog/my-custom-dialog/my-custom-dialog.html',
      language: 'html',
    },
    {
      label: 'my-custom-dialog.scss',
      path: 'examples/dialog/my-custom-dialog/my-custom-dialog.scss',
      language: 'scss',
    },
  ];

  protected readonly size = signal<NgxDialogSize>('md');
  protected readonly sizeOptions: NgxDialogSize[] = ['sm', 'md', 'lg', 'xl'];
  protected readonly animation = signal<'zoom' | 'fade' | 'slide-up' | 'none'>('zoom');
  protected readonly animationOptions: Array<'zoom' | 'fade' | 'slide-up' | 'none'> = [
    'zoom',
    'fade',
    'slide-up',
    'none',
  ];
  protected readonly closeOnOutsideClick = signal(true);
  protected readonly openCount = signal(0);

  protected readonly dialog = inject(NgxDialogService);

  showModal(): void {
    const counter = this.openCount() + 1;
    this.openCount.set(counter);

    this.dialog.open(MyCustomDialog, {
      size: this.size(),
      animation: this.animation(),
      closeOnOutsideClick: this.closeOnOutsideClick(),
      ariaLabel: 'Dialog playground example',
      data: { counter },
    });
  }
}
