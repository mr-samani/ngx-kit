import { Component, inject } from '@angular/core';
import { Dialog, DIALOG_DATA } from 'ngx-kit/dialog';
import { MyTestService } from '../test.service';

@Component({
  selector: 'app-my-custom-dialog',
  templateUrl: './my-custom-dialog.html',
  styleUrl: './my-custom-dialog.scss',
  standalone: false,
})
export class MyCustomDialog {
  data = inject<{ counter: number }>(DIALOG_DATA);

  protected readonly myService = inject(MyTestService);
  openDialog() {
    Dialog.open(MyCustomDialog, {
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
