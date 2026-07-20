import { Type } from '@angular/core';
import { NgxDialogConfig } from './ngx-dialog-config';
import { NgxOverlayService } from './ngx-dialog.service';
import { NgxDialogRef } from './ngx-dialog-ref';

export class Dialog {
  private static serviceInstance: NgxOverlayService | null = null;
  static _setService(svc: NgxOverlayService) {
    this.serviceInstance = svc;
  }

  static open<DataType>(component: Type<any>, config?: NgxDialogConfig<DataType>): NgxDialogRef {
    if (!this.serviceInstance) {
      throw Error('ngx-dialog: service not initialized. Ensure NgxDialogModule is imported.');
    }
    return this.serviceInstance.open(component, config);
  }
}
