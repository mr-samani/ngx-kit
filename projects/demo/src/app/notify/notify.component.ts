import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxNotificationComponent,
  Notify,
  NgxNotifyType,
  NgxNotifyOptions,
  NgxNotifyPositionType,
} from 'ngx-kit/notify';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxNotificationComponent, FormsModule],
  providers: [],
})
export class NotifyComponent implements OnInit {
  message = 'Data saved Successfully!';
  description = '<p style="color:red;">this is a description</p>';
  type: NgxNotifyType = 'info';
  options: NgxNotifyOptions = {
    dismissible: true,
    timeout: 50000,
    position: 'center',
  };

  payload: any = {
    id: '1',
    message: this.message,
    description: this.description,
    type: this.type,
    options: this.options,
  };
  ngOnInit() {}

  showNotify() {
    console.log(this.options);
    const m = Notify.show(this.type, this.message, this.description, this.options);
    m.onClose.subscribe((r) => {
      console.log('close', r.id);
    });
    m.onFinish.subscribe((r) => {
      console.log('finish', r.id);
    });
  }
}
