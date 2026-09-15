import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import type { NgxInputColorConfig } from './tokens/input-color-config';
import { NGX_INPUT_COLOR_CONFIG, NGX_INPUT_COLOR_CONFIG_DEFAULT } from './tokens/input-color.token';

export function provideInputColor(options?: NgxInputColorConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_INPUT_COLOR_CONFIG,
      useValue: { ...NGX_INPUT_COLOR_CONFIG_DEFAULT, ...options },
    },
  ]);
}
