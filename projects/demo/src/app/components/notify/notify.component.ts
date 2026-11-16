import { CommonModule } from '@angular/common';
import { Component, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxNotificationComponent,
  Notify,
  type INotifyEnd,
  type NgxNotifyOptions,
  type NgxNotifyPayload,
  type NgxNotifyPositionType,
  type NgxNotifyType,
} from 'ngx-kit/notify';
import { ExampleShowcaseComponent } from '../../shared/showcase/example-showcase.component';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxNotificationComponent, FormsModule, ExampleShowcaseComponent],
})
export class NotifyComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/notify/notify.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/notify/notify.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/notify/notify.component.scss',
      language: 'scss',
    },
  ];

  message = 'Data saved Successfully!';

  description = 'Your changes are ready to use.';

  type: NgxNotifyType = 'info';
  protected readonly types: NgxNotifyType[] = ['info', 'success', 'warning', 'error'];
  protected readonly positions: NgxNotifyPositionType[] = [
    'top-left',
    'top-center',
    'top-right',
    'center',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  options: NgxNotifyOptions = {
    dismissible: true,
    allowHtml: false,
    timeout: 5000,
    position: 'top-right',
    usePopover: true,
    pauseOnHover: true,
    closeOnTap: true,
  };

  protected readonly activity = signal('No notification shown yet.');
  protected readonly previewVisible = signal(true);

  get payload(): NgxNotifyPayload {
    return {
      id: '1',
      message: this.message,
      description: this.description,
      type: this.type,
      options: this.options,
      onClose: new EventEmitter<INotifyEnd>(),
      onFinish: new EventEmitter<INotifyEnd>(),
      close: () => this.previewVisible.set(false),
    };
  }

  resetPreview(): void {
    this.previewVisible.set(true);
  }

  showNotify(): void {
    const notification = Notify.show(this.type, this.message, this.description, this.options);

    this.activity.set(`Showing ${this.type} notification.`);
    notification.onClose.subscribe(() => {
      this.activity.set('Notification dismissed.');
    });

    notification.onFinish.subscribe(() => {
      this.activity.set('Notification timed out.');
    });
  }
}
