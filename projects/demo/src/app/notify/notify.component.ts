import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPgNotificationComponent, Notify, NgxNotifyPayload } from 'ngx-kit/notify';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxPgNotificationComponent, FormsModule],
  providers: [],
})
export class NotifyComponent implements OnInit {
  payload = signal<NgxNotifyPayload>({
    id: 'ddd',
    message: 'Data saved Successfully!',
    description: '<p style="color:red;">this is a description</p>',
    type: 'info',
    options: {
      dismissible: true,
      timeout: 5000,
      position: 'center',
    },
  });
  ngOnInit() {}

  showNotify() {
    Notify.show(
      this.payload().type,
      this.payload().message,
      this.payload().description,
      this.payload().options,
    );
  }
}
