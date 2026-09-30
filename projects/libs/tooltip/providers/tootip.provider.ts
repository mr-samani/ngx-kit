import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { NgxTooltipConfig } from '../types/configs';

export const NGX_TOOLTIP_CONFIG = new InjectionToken<NgxTooltipConfig>('ngx-tooltip-config', {
  factory: () => new NgxTooltipConfig(),
});
export function provideTooltip(configs?: NgxTooltipConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NGX_TOOLTIP_CONFIG,
      useValue: { ...new NgxTooltipConfig(), ...(configs || {}) },
    },
  ]);
}
