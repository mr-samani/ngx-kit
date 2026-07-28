import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
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
    MSG.show(this.options).then((result) => {
      this.result = result;
    });
  }
}
