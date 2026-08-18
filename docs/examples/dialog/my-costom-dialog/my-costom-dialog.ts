import { Component } from '@angular/core';
import { Dialog, NgxDialogModule } from 'ngx-kit/dialog';

@Component({
  selector: 'app-my-costom-dialog',
  imports: [NgxDialogModule],
  templateUrl: './my-costom-dialog.html',
  styleUrl: './my-costom-dialog.scss',
})
export class MyCostomDialog {
  openDialog() {
    Dialog.open(MyCostomDialog);
  }
}
