import { Component, inject } from '@angular/core';
import { Dialog, DIALOG_DATA } from 'ngx-kit/dialog';
import { NgxDialogModule } from 'ngx-kit/dialog';

@Component({
  selector: 'app-my-custom-dialog',
  imports: [NgxDialogModule],
  templateUrl: './my-custom-dialog.html',
  styleUrl: './my-custom-dialog.scss',
})
export class MyCustomDialog {
  data = inject<{ counter: number }>(DIALOG_DATA);
  openDialog() {
    Dialog.open(MyCustomDialog, {
      width: '768px',
      data: {
        counter: (this.data?.counter ?? 0) + 1,
      },
    });
  }
}
