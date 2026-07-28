import { Injector } from '@angular/core';
import { NgxNotifyOptions } from './models/notify-options';
import { NGX_NOTIFY_API } from './models/notify-config';
import { NgxNotifyPayload } from './models/notify.model';

/**
 * Static facade so call sites can use: Notify.warn('msg', opts)
 * Module will set the service instance in its constructor.
 */
export class Notify {
  static injector: Injector;

  static show(
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    message: string,
    description?: string,
    options?: NgxNotifyOptions,
  ): NgxNotifyPayload {
    if (!Notify.injector) {
      throw new Error(
        'ngx-kit: Error on EnvironmentProvider. Ensure "provideNotify()" in root provider.',
      );
    }
    return Notify.injector.get(NGX_NOTIFY_API).show(message, description, type, options);
  }

  static info(message: string, description?: string, options?: NgxNotifyOptions) {
    return this.show('info', message, description, options);
  }

  static success(message: string, description?: string, options?: NgxNotifyOptions) {
    return this.show('success', message, description, options);
  }
  static warning(message: string, description?: string, options?: NgxNotifyOptions) {
    return this.show('warning', message, description, options);
  }
  static error(message: string, description?: string, options?: NgxNotifyOptions) {
    return this.show('error', message, description, options);
  }
}
