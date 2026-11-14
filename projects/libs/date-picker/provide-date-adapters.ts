import { Provider } from '@angular/core';
import { DateAdapterRegistration, DEFAULT_DATE_ADAPTERS } from './adapters/consts';
import { DATE_ADAPTERS } from './tokens/adapters';
import {
  DEFAULT_DATE_CONFIG,
  NGX_DATE_CONFIG,
  NgxCalendarLocalization,
  NgxDateConfig,
} from './tokens/config';

function dedupeAdapters(adapters: DateAdapterRegistration[]): DateAdapterRegistration[] {
  return Array.from(new Map(adapters.map((a) => [a.locale, a])).values());
}

export function provideDateAdapters(configs?: NgxDateConfig): Provider[] {
  const adapters = configs?.adapters ?? [];
  const all = dedupeAdapters([...DEFAULT_DATE_ADAPTERS, ...adapters]);
  const config: NgxDateConfig = {
    ...DEFAULT_DATE_CONFIG,
    ...configs,
    // a partially supplied localization must not drop the other labels
    localization: {
      ...new NgxCalendarLocalization(),
      ...DEFAULT_DATE_CONFIG.localization,
      ...configs?.localization,
    },
  };

  return [
    ...all.map((adapter) => ({
      provide: DATE_ADAPTERS,
      multi: true,
      useValue: adapter,
    })),
    {
      provide: NGX_DATE_CONFIG,
      useValue: config,
    },
  ];
}
