import { Injector } from '@angular/core';
import { NGX_MESSAGE_API } from './models/configs';
import { IMessageOptions } from './models/message-options.interface';
import { MessageResult } from './models/message-result';

/**
 * Static facade so call sites can use: MSG.warn('msg', opts)
 * Module will set the service instance in its constructor.
 */
export class MSG {
  static injector: Injector;

  static show(options?: IMessageOptions): Promise<MessageResult<any>> {
    if (!MSG.injector) {
      throw new Error(
        'ngx-kit: Error on EnvironmentProvider. Ensure "provideMessage()" in root provider.',
      );
    }

    return MSG.injector.get(NGX_MESSAGE_API).show(options);
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
}
