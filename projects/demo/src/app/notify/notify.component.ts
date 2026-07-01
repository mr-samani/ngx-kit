import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Notify } from 'ngx-kit/notify';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [],
})
export class NotifyComponent implements OnInit {
  counter = 0;
  ngOnInit() {}

  showNotify() {
    this.counter++;
    Notify.success('this is a test!' + this.counter);
  }
}
