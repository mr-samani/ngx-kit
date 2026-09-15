import { InjectionToken } from '@angular/core';
import { NgxInputColorConfig } from './input-color-config';

export const NGX_INPUT_COLOR_CONFIG_DEFAULT = new NgxInputColorConfig();
export const NGX_INPUT_COLOR_CONFIG = new InjectionToken<NgxInputColorConfig>(
  'ngx-input-color-config',
  {
    factory: () => NGX_INPUT_COLOR_CONFIG_DEFAULT,
  },
);
