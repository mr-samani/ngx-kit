import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxDialogService } from './services/ngx-dialog.service';
import { NgxDialogConfig } from './configs/dialog-config';
import { NGX_DIALOG_CONFIG } from './tokens/dialog.tokens';

export function provideNgxDialog(config?: NgxDialogConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_DIALOG_CONFIG,
      useValue: { ...new NgxDialogConfig(), ...(config || {}) },
    },
    NgxDialogService,
  ]);
}
