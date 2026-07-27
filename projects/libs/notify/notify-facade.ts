import { Injector } from '@angular/core';
import { NgxNotifyOptions } from './models/notify-options';
import { NGX_NOTIFY_API } from './models/notify-config';

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
  ) {
    if (!Notify.injector) {
      console.error(
        'ngx-notify: Error on EnvironmentProvider. Ensure "provideNotify()" in root provider.',
      );
      return;
    }
    Notify.injector.get(NGX_NOTIFY_API).show(message, description, type, options);
  }

  static info(message: string, description?: string, options?: NgxNotifyOptions) {
    this.show('info', message, description, options);
  }

  static success(message: string, description?: string, options?: NgxNotifyOptions) {
    this.show('success', message, description, options);
  }
  static warning(message: string, description?: string, options?: NgxNotifyOptions) {
    this.show('warning', message, description, options);
  }
  static error(message: string, description?: string, options?: NgxNotifyOptions) {
    this.show('error', message, description, options);
  }
}
