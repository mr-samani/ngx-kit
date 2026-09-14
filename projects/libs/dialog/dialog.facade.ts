import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxDialogConfig } from './ngx-dialog-config';
import { NgxDialogRef } from './ngx-dialog-ref';
import { NgxDialogService } from './ngx-dialog.service';

const NOT_INITIALIZED_MESSAGE =
  '[ngx-kit/dialog] Dialog.* was called before provideNgxDialog() ran. ' +
  'Add provideNgxDialog() to your app providers, or inject NgxDialogService directly instead of using the static Dialog API.';

/**
 * Static convenience API over `NgxDialogService`, so you can call
 * `Dialog.open(...)` from anywhere without injecting the service manually.
 *
 * SSR note: the instance backing this static class is process-wide, not
 * per-request, so it is deliberately left unset on the server (see
 * `provideNgxDialog()`). Inject `NgxDialogService` directly in SSR code paths.
 */
export class Dialog {
  private static serviceInstance: NgxDialogService | null = null;

  /** @internal set by `provideNgxDialog()`'s environment initializer. */
  static _setService(svc: NgxDialogService): void {
    this.serviceInstance = svc;
  }

  private static get service(): NgxDialogService {
    if (!this.serviceInstance) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    return this.serviceInstance;
  }

  static open<R = any, DataType = any>(
    component: Type<any>,
    config?: Partial<NgxDialogConfig<DataType>>,
  ): NgxDialogRef<R> {
    return this.service.open<R, DataType>(component, config);
  }

  static closeAll(): void {
    this.service.closeAll();
  }
}
