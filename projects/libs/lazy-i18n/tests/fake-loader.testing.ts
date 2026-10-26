import { Injectable } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import type { Dictionary, I18nLoader } from '../types/types';

export const FILES: Record<string, Dictionary> = {
  'fa|': { hello: 'سلام {{ name }}', common: { save: 'ذخیره' }, only_fa: 'فقط فارسی', blank: '' },
  'en|': { hello: 'Hello {{ name }}', common: { save: 'Save' }, only_en: 'Only EN', blank: 'Filled by EN' },
  'fa|setting': { request: 'درخواست' },
  'en|setting': { request: 'Request' },
  'fa|orders': { title: 'سفارش‌ها' },
  'en|orders': { title: 'Orders' },
};

@Injectable({ providedIn: 'root' })
export class FakeLoader implements I18nLoader {
  static calls: string[] = [];
  static failures = new Map<string, number>();
  static latency = 20;
  load(lang: string, scope?: string) {
    const id = `${lang}|${scope ?? ''}`;
    FakeLoader.calls.push(id);
    const left = FakeLoader.failures.get(id) ?? 0;
    if (left > 0) { FakeLoader.failures.set(id, left - 1); return throwError(() => new Error('boom ' + id)); }
    const f = FILES[id];
    return f ? of(structuredClone(f)).pipe(delay(FakeLoader.latency)) : throwError(() => new Error('404 ' + id));
  }
  static reset() { FakeLoader.calls = []; FakeLoader.failures.clear(); FakeLoader.latency = 20; }
}
