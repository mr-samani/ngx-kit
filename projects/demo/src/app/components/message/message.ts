import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageOptions, MSG, type MessageResult } from 'ngx-kit/message';
import { ExampleShowcaseComponent } from '../../shared/showcase/example-showcase.component';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-message',
  imports: [CommonModule, FormsModule, ExampleShowcaseComponent],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class MessageComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/message/message.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/message/message.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/message/message.scss',
      language: 'scss',
    },
  ];

  options = new MessageOptions();
  protected readonly iconOptions: NonNullable<MessageOptions['icon']>[] = [
    'success',
    'error',
    'info',
    'warning',
    'question',
    'loading',
  ];

  htmlContent = '';
  result = signal<MessageResult | null>(null);

  constructor() {
    this.options.title = 'Message Title';
    this.options.text = 'Message Body';
    this.options.icon = 'success';

    this.options.useOverlay = true;

    this.options.showCloseButton = true;
    this.options.showCancelButton = true;
  }

  openModal(): void {
    this.options.html = this.htmlContent;
    MSG.show(this.options).afterClose.subscribe((result) => {
      this.result.set(result);
    });
  }

  showLoading(): void {
    const message = MSG.fire({
      icon: 'loading',
      text: 'Please Wait...',

      showConfirmButton: false,
      showCancelButton: false,
      showDenyButton: false,

      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,

      showCloseButton: false,
    });

    let timeout: ReturnType<typeof setTimeout> | undefined;
    message.afterClose.subscribe((result) => {
      if (timeout !== undefined) clearTimeout(timeout);
      this.result.set(result);
    });

    timeout = setTimeout(() => {
      message.close();
    }, 5000);
  }
}
