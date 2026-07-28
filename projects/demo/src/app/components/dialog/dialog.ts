import { Component } from '@angular/core';
import { Dialog, NgxDialogModule } from 'ngx-kit/dialog';
import { MyCostomDialog } from './my-costom-dialog/my-costom-dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  imports: [NgxDialogModule],
})
export class DialogDemo {
  showModal() {
    Dialog.open(MyCostomDialog);
  }
}
