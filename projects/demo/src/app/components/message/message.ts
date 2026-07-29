import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MessageOptions, MessageResult, MSG } from 'ngx-kit/message';

@Component({
  selector: 'app-message',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './message.html',
  styleUrl: './message.scss',
  providers: [],
})
export class MessageComponent {
  options = new MessageOptions();
  result?: MessageResult;
  constructor() {
    this.options.title = 'Message Title';
    this.options.text = 'Message Body';
    this.options.icon = 'success';
    this.options.useOverlay = true;
    this.options.showCloseButton = true;
    this.options.showCancelButton = true;
  }

  ngOnInit(): void {}

  openModal() {
    MSG.show(this.options).afterClose.subscribe((result) => {
      this.result = result;
    });
  }

  showLoading() {
    let msg = MSG.fire({
      icon: 'loading',
      text: 'Please Wait...',
      showConfirmButton: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCloseButton: false,
    });
    msg.afterClose.subscribe((r) => {
      console.log(r);
    });
    setTimeout(() => {
      msg.close();
    }, 5000);
  }
}
