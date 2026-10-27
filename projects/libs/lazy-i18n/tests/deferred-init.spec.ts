import {
  ApplicationInitStatus,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nService, provideI18n } from '../public-api';
import { FakeLoader } from './fake-loader.testing';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
beforeEach(() => FakeLoader.reset());
afterEach(() => TestBed.resetTestingModule());

describe('deferred configuration', () => {
  it('provideI18n() without languages: no initializer, clear error until configured', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ loader: FakeLoader, storageKey: null }),
      ],
    });
    await TestBed.inject(ApplicationInitStatus).donePromise; // nothing blocks startup
    const s = TestBed.inject(I18nService);
    expect(FakeLoader.calls).toEqual([]);
    expect(s.t('hello')).toBe('hello'); // renders the key, no crash
    expect(s.ready()).toBe(false);
    await expect(s.use('fa')).rejects.toThrow(/No languages configured/);
  });

  it('init() sets langs/defaultLang and activates the requested language only', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ loader: FakeLoader, storageKey: null, warnMissing: false }),
      ],
    });
    const s = TestBed.inject(I18nService);
    await s.init({ langs: ['fa', 'en'], defaultLang: 'fa', lang: 'en' });
    expect(s.langs()).toEqual(['fa', 'en']);
    expect(s.lang()).toBe('en');
    expect(s.ready()).toBe(true);
    expect(s.t('common.save')).toBe('Save');
    expect(FakeLoader.calls).toEqual(['en|']); // fa was not downloaded
  });

  it('an unsupported preferred lang falls back to the default instead of failing', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ loader: FakeLoader, storageKey: null }),
      ],
    });
    const s = TestBed.inject(I18nService);
    await s.init({ langs: ['fa', 'en'], defaultLang: 'fa', lang: 'de' });
    expect(s.lang()).toBe('fa');
  });

  it('the real flow: slow backend inside provideAppInitializer, app starts only after translations are ready', async () => {
    let t0 = 0;
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({
          loader: FakeLoader,
          storageKey: null,
          fallbackLangs: ['en'],
          warnMissing: false,
        }),
        provideAppInitializer(async () => {
          const i18n = inject(I18nService);
          await sleep(80); // GET appconfig.json + /api/Common/InitialApp
          t0 = Date.now();
          await i18n.init({ langs: ['fa', 'en'], defaultLang: 'fa', lang: 'fa' }); // awaited!
        }),
      ],
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    const s = TestBed.inject(I18nService);
    expect(Date.now() - t0).toBeGreaterThanOrEqual(15); // the app waited for the file
    expect(s.t('hello', { name: 'Ali' })).toBe('سلام Ali');
    expect(s.t('only_en')).toBe('Only EN'); // fallback language was configured at provide time and loaded
  });

  it('scopes registered before init are remembered and loaded by init; whenReady waits for init', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ loader: FakeLoader, storageKey: null }),
      ],
    });
    const s = TestBed.inject(I18nService);
    s.registerScope('setting');
    expect(FakeLoader.calls).toEqual([]); // not ready yet: nothing downloaded
    const p = s.init({ langs: ['fa', 'en'], defaultLang: 'fa' });
    await s.whenReady(); // waits for the in-flight init
    expect(s.t('request')).toBe('درخواست');
    await p;
  });

  it('init() is idempotent and shares in-flight downloads', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ loader: FakeLoader, storageKey: null }),
      ],
    });
    const s = TestBed.inject(I18nService);
    await Promise.all([
      s.init({ langs: ['fa'], defaultLang: 'fa' }),
      s.init({ langs: ['fa'], defaultLang: 'fa' }),
    ]);
    expect(FakeLoader.calls).toEqual(['fa|']);
  });

  it('autoInit: false keeps the initializer off even when langs are given', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideI18n({ langs: ['fa'], defaultLang: 'fa', autoInit: false, loader: FakeLoader }),
      ],
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    expect(FakeLoader.calls).toEqual([]);
  });
});

describe('default HTTP loader URLs (config supplied after startup)', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideI18n({ storageKey: null, retries: 0 }),
      ],
    });
    return { s: TestBed.inject(I18nService), http: TestBed.inject(HttpTestingController) };
  }

  it('uses baseUrl from init(), never "undefined" and never "//"', async () => {
    const { s, http } = setup();
    const p = s.init({ langs: ['fa'], defaultLang: 'fa', baseUrl: 'https://api.example.com/' });
    const global = await vi.waitFor(() => http.expectOne('https://api.example.com/fa.json'));
    global.flush({ a: 'A' });
    await p;
    s.registerScope('setting');
    const scoped = await vi.waitFor(() =>
      http.expectOne('https://api.example.com/setting/fa.json'),
    );
    scoped.flush({ b: 'B' });
    await s.whenReady();
    expect(s.t('a') + s.t('b')).toBe('AB');
    http.verify();
  });

  it('defaults to /i18n and honours an empty extension', async () => {
    const { s, http } = setup();
    const p = s.init({ langs: ['fa'], defaultLang: 'fa', fileExtension: '' });
    (await vi.waitFor(() => http.expectOne('/i18n/fa'))).flush({});
    await p;
    http.verify();
  });
});
