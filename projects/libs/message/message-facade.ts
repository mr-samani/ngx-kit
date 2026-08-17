import { Injector } from '@angular/core';
import { NGX_MESSAGE_API } from './models/tokens';
import { IMessageOptions } from './models/message-options.interface';

/**
 * Static facade so call sites can use: MSG.warn('msg', opts)
 * Module will set the service instance in its constructor.
 */
export class MSG {
  static injector: Injector;

  static show<T = any>(options?: IMessageOptions) {
    if (!MSG.injector) {
      throw new Error(
        'ngx-kit: Error on EnvironmentProvider. Ensure "provideMessage()" in root provider.',
      );
    }

    return MSG.injector.get(NGX_MESSAGE_API).show<T>(options);
  }

  static fire(options?: IMessageOptions) {
    return this.show(options);
  }

  static info(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'info',
      title,
      text,
      ...options,
    });
  }

  static success(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'success',
      title,
      text,
      ...options,
    });
  }
  static warning(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'warning',
      title,
      text,
      ...options,
    });
  }
  static error(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'error',
      title,
      text,
      ...options,
    });
  }
  static question(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'question',
      title,
      text,
      ...options,
      showConfirmButton: true,
      showCancelButton: true,
    });
  }
  static loading(title: string, text?: string, options?: IMessageOptions) {
    return this.show({
      icon: 'loading',
      title,
      text,
      ...options,
      showConfirmButton: false,
      showCancelButton: false,
      showDenyButton: false,
    });
  }
}

export class Modal extends MSG {}
