import {
  EnvironmentProviders,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { NgxDialogService } from './services/ngx-dialog.service';
import { Dialog } from './dialog.facade';
import { NgxDialogConfig } from './configs/dialog-config';
import { NGX_DIALOG_CONFIG } from './tokens/dialog.tokens';

export function provideNgxDialog(config?: NgxDialogConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_DIALOG_CONFIG,
      useValue: { ...new NgxDialogConfig(), ...(config || {}) },
    },
    NgxDialogService,
    provideEnvironmentInitializer(() => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return;
      }

      Dialog._setService(inject(NgxDialogService));
    }),
  ]);
}
