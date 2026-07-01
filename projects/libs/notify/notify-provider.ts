import {
  EnvironmentProviders,
  inject,
  Injector,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { NGX_NOTIFY_API, NGX_NOTIFY_CONFIG, NGX_NOTIFY_DEFAULTS } from './models/notify-config';
import { NgxNotifyOptions } from './models/notify-options';
import { Notify as NotifyFacade } from './notify-facade';
import { NgxNotifyService } from './services/notify.service';
export function provideNotify(options?: NgxNotifyOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_NOTIFY_CONFIG,
      useValue: { ...NGX_NOTIFY_DEFAULTS, ...(options || {}) },
    },
    {
      provide: NGX_NOTIFY_API,
      useExisting: NgxNotifyService,
    },
    provideEnvironmentInitializer(() => {
      NotifyFacade.injector = inject(Injector);
    }),
  ]);
}
