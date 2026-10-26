import { Component, inject, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { I18nService, i18nReadyGuard, provideI18n, provideI18nScope } from '../public-api';
import { FakeLoader } from './fake-loader.testing';

let seen: Record<string, string> = {};
@Component({ selector: 'a-1', template: '' }) class A { constructor() { seen = { request: inject(I18nService).instant('request') }; } }
@Component({ selector: 'a-2', template: '' }) class B { constructor() { seen = { request: inject(I18nService).instant('request') }; } }
@Component({ selector: 'a-3', template: '' }) class C { constructor() { seen = { title: inject(I18nService).instant('title') }; } }

beforeEach(() => { FakeLoader.reset(); seen = {}; });
afterEach(() => TestBed.resetTestingModule());

describe('routing', () => {
  it('route resolves only after its scope is loaded; children need no scope; lang switch is complete', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ langs: ['fa', 'en'], defaultLang: 'fa', loader: FakeLoader, storageKey: null, warnMissing: false }),
        provideRouter([
          { path: '', canActivateChild: [i18nReadyGuard], children: [
            { path: 'setting', providers: [provideI18nScope('setting')], children: [
              { path: '', component: A },
              { path: 'deep/er', component: B },
            ] },
            { path: 'orders', providers: [provideI18nScope('orders')], component: C },
          ] },
        ]),
      ],
    });
    const h = await RouterTestingHarness.create();
    await h.navigateByUrl('/setting');
    expect(seen.request).toBe('درخواست');
    await h.navigateByUrl('/setting/deep/er');
    expect(seen.request).toBe('درخواست');
    await h.navigateByUrl('/orders');
    expect(seen.title).toBe('سفارش‌ها');
    expect(FakeLoader.calls.filter((c) => c === 'fa|setting').length).toBe(1);

    await TestBed.inject(I18nService).use('en');
    await h.navigateByUrl('/setting');
    expect(seen.request).toBe('Request');
    await h.navigateByUrl('/orders');
    expect(seen.title).toBe('Orders');
  });
});
