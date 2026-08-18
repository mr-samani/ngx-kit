import {
  EnvironmentProviders,
  inject,
  Injector,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { IMessageOptions } from './models/message-options.interface';
import { NGX_MESSAGE_API, NGX_MESSAGE_CONFIGS, NGX_MESSAGE_DEFAULT_OPTIONS } from './models/tokens';
import { NgxMessageService } from './services/message.service';
import { MSG as MessageFacade } from './message-facade';
import { Modal as ModalFacade } from './message-facade';

export function provideMessage(options?: IMessageOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_MESSAGE_CONFIGS,
      useValue: { ...NGX_MESSAGE_DEFAULT_OPTIONS, ...(options || {}) },
    },
    {
      provide: NGX_MESSAGE_API,
      useExisting: NgxMessageService,
    },
    provideEnvironmentInitializer(() => {
      MessageFacade.injector = inject(Injector);
      ModalFacade.injector = inject(Injector);
    }),
  ]);
}
