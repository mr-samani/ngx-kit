import { Provider } from '@angular/core';
import { DATE_ADAPTERS, DateAdapterRegistration, DEFAULT_DATE_ADAPTERS } from './adapters/consts';

function dedupeAdapters(adapters: DateAdapterRegistration[]): DateAdapterRegistration[] {
  return Array.from(new Map(adapters.map((a) => [a.locale, a])).values());
}

export function provideDateAdapters(...additional: DateAdapterRegistration[]): Provider[] {
  const all = dedupeAdapters([...DEFAULT_DATE_ADAPTERS, ...additional]);
  return all.map((adapter) => ({
    provide: DATE_ADAPTERS,
    multi: true,
    useValue: adapter,
  }));
}
