import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxNotificationComponent,
  Notify,
  NgxNotifyType,
  NgxNotifyOptions,
  NgxNotifyPositionType,
  type NgxNotifyPayload,
} from 'ngx-kit/notify';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

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
  ];

  message = 'Data saved Successfully!';

  description = '<p style="color:green;">this is a description</p>';

  type: NgxNotifyType = 'info';

  options: NgxNotifyOptions = {
    dismissible: true,
    allowHtml: true,
    timeout: 5000,
    position: 'center',
  };

  get payload(): NgxNotifyPayload {
    return {
      id: '1',
      message: this.message,
      description: this.description,
      type: this.type,
      options: this.options,
      onClose: new EventEmitter(),
      onFinish: new EventEmitter(),
      close: function (): void {
        throw new Error('Function not implemented.');
      },
    };
  }

  showNotify(): void {
    const notification = Notify.show(this.type, this.message, this.description, this.options);

    notification.onClose.subscribe((result) => {
      console.log('close', result.id);
    });

    notification.onFinish.subscribe((result) => {
      console.log('finish', result.id);
    });
  }
}
