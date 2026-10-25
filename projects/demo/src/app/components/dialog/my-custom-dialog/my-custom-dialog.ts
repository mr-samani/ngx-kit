import { Component, inject, Injector, signal, type OnInit } from '@angular/core';
import { DIALOG_DATA, NgxDialogService } from 'ngx-kit/dialog';
import { MyTestService } from '../test.service';

@Component({
  selector: 'app-my-custom-dialog',
  templateUrl: './my-custom-dialog.html',
  styleUrl: './my-custom-dialog.scss',
  standalone: false,
})
export class MyCustomDialog {
  data = inject<{ counter: number }>(DIALOG_DATA);

  showData = signal(false);

  protected readonly myService = inject(MyTestService);
  protected readonly injector = inject(Injector);
  protected readonly dialog = inject(NgxDialogService);
  ngOnInit(): void {
    //  setTimeout(() => {
    this.showData.set(true);
    //  }, 500);
  }

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
      // injector: this.injector,
    });
  }
}
