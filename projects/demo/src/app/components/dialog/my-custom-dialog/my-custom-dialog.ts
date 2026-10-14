import { Component, inject } from '@angular/core';
import { DIALOG_DATA, NgxDialogService } from 'ngx-kit/dialog';
import { NgxDialogModule } from 'ngx-kit/dialog';

@Component({
  selector: 'app-my-custom-dialog',
  imports: [NgxDialogModule],
  templateUrl: './my-custom-dialog.html',
  styleUrl: './my-custom-dialog.scss',
})
export class MyCustomDialog {
  data = inject<{ counter: number }>(DIALOG_DATA);
  private readonly dialog = inject(NgxDialogService);

  openDialog() {
    this.dialog.open(MyCustomDialog, {
      width: '50dvw',
      height: '50dvh',
      data: {
        counter: (this.data?.counter ?? 0) + 1,
      },
      header: {
        showMaximizeButton: false,
      },
    });
  }
}
