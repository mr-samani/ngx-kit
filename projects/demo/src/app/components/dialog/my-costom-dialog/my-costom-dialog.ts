import { Component } from '@angular/core';
import { Dialog } from 'ngx-kit/dialog';
import { NgxDialogModule } from 'ngx-kit/dialog';

@Component({
  selector: 'app-my-custom-dialog',
  imports: [NgxDialogModule],
  templateUrl: './my-costom-dialog.html',
  styleUrl: './my-costom-dialog.scss',
})
export class MyCostomDialog {
  openDialog() {
    Dialog.open(MyCostomDialog, {
      width: '50dvw',
    });
  }
}
