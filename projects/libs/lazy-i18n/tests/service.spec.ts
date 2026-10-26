import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, computed, effect } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nService, provideI18n, type I18nConfig } from '../public-api';
import { FakeLoader } from './fake-loader.testing';

function setup(cfg: Partial<I18nConfig> = {}) {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideI18n({ langs: ['fa', 'en'], defaultLang: 'fa', loader: FakeLoader, storageKey: null, warnMissing: false, ...cfg }),
    ],
  });
  return TestBed.inject(I18nService);
}
const init = async () => { await TestBed.inject(I18nService).use('fa'); };

beforeEach(() => { FakeLoader.reset(); });
afterEach(() => TestBed.resetTestingModule());

describe('I18nService', () => {
  it('translates, interpolates and handles nested keys', async () => {
    const s = setup(); await init();
    expect(s.t('hello', { name: 'Ali' })).toBe('سلام Ali');
    expect(s.t('common.save')).toBe('ذخیره');
  });

  it('missing: key (default), empty, and custom handler', async () => {
    let s = setup(); await init();
    expect(s.t('nope')).toBe('nope');
    TestBed.resetTestingModule();
    s = setup({ missing: 'empty' }); await init();
    expect(s.t('nope')).toBe('');
    TestBed.resetTestingModule();
    s = setup({ missing: (k, l) => `[${l}:${k}]` }); await init();
    expect(s.t('nope')).toBe('[fa:nope]');
  });

  it('warns once per missing key when enabled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const s = setup({ warnMissing: true }); await init();
    s.t('x.y'); s.t('x.y');
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('falls back to other languages, also for empty values', async () => {
    const s = setup({ fallbackLangs: ['en'] }); await init();
    expect(s.t('only_en')).toBe('Only EN');
    expect(s.t('blank')).toBe('Filled by EN'); // '' in fa -> fallback
    expect(s.t('only_fa')).toBe('فقط فارسی');
    expect(s.has('only_en')).toBe(true);
    expect(s.has('zzz')).toBe(false);
  });

  it('custom transpiler replaces interpolation', async () => {
    const s = setup({ transpile: (v, p, l) => `${l}:${v}:${JSON.stringify(p)}` }); await init();
    expect(s.t('common.save', { a: 1 })).toBe('fa:ذخیره:{"a":1}');
  });

  it('is reactive: computed re-evaluates on language change', async () => {
    const s = setup(); await init();
    const c = computed(() => s.t('common.save'));
    const sel = s.select('hello', () => ({ name: 'Z' }));
    expect(c()).toBe('ذخیره'); expect(sel()).toBe('سلام Z');
    await s.use('en');
    expect(c()).toBe('Save'); expect(sel()).toBe('Hello Z');
    expect(s.lang()).toBe('en');
  });

  it('effects see dictionary updates (setTranslation)', async () => {
    const s = setup(); await init();
    const seen: string[] = [];
    TestBed.runInInjectionContext(() => effect(() => { seen.push(s.t('late')); }));
    TestBed.tick();
    s.setTranslation('fa', { late: 'دیر' });
    TestBed.tick();
    expect(seen).toEqual(['late', 'دیر']);
  });

  it('scopes: keys have no prefix, files are fetched once, language switch keeps scopes', async () => {
    const s = setup(); await init();
    s.registerScope('setting'); s.registerScope('setting');
    await s.whenReady();
    expect(s.t('request')).toBe('درخواست');
    await s.use('en');
    expect(s.t('request')).toBe('Request');
    expect(FakeLoader.calls.filter((c) => c === 'fa|setting').length).toBe(1);
    expect(FakeLoader.calls.filter((c) => c === 'en|setting').length).toBe(1);
  });

  it('a scope registered during a language switch is not lost', async () => {
    const s = setup(); await init();
    const p = s.use('en');
    s.registerScope('orders'); // registered while en is loading
    await p; await s.whenReady();
    expect(s.t('title')).toBe('Orders');
  });

  it('use() activates only after everything is loaded; latest call wins', async () => {
    const s = setup(); await init();
    const a = s.use('en');
    expect(s.lang()).toBe('fa');
    const b = s.use('fa');
    await Promise.all([a, b]);
    expect(s.lang()).toBe('fa');
  });

  it('retries once, then reports failure without blocking whenReady', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const s = setup({ retries: 1 }); await init();
    FakeLoader.failures.set('fa|setting', 1);
    s.registerScope('setting'); await s.whenReady();
    expect(s.t('request')).toBe('درخواست'); // recovered by retry
    FakeLoader.failures.set('fa|orders', 5);
    s.registerScope('orders'); await s.whenReady(); // never rejects
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it('rejects unsupported languages', async () => {
    const s = setup(); await init();
    await expect(s.use('de')).rejects.toThrow(/Unsupported/);
  });

  it('manages <html lang dir> and persists the language', async () => {
    const s = setup({ storageKey: 'k' }); await init();
    await s.use('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(localStorage.getItem('k')).toBe('en');
    expect(s.detectInitialLang()).toBe('en');
    await s.use('fa');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    localStorage.clear();
  });

  it('getObject returns a nested object', async () => {
    const s = setup(); await init();
    expect(s.getObject('common')).toEqual({ save: 'ذخیره' });
  });
});
