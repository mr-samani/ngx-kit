import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  PLATFORM_ID,
  Provider,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { NgxDialogService } from './services/ngx-dialog.service';
import { Dialog } from './dialog.facade';

export function provideNgxDialog(): EnvironmentProviders {
  return makeEnvironmentProviders([
    NgxDialogService,

    provideEnvironmentInitializer(() => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return;
      }

      Dialog._setService(inject(NgxDialogService));
    }),
  ]);
}
