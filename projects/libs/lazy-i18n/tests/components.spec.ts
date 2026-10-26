import { Component, computed, signal, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { I18nService, TR, injectT, provideI18n, translateSignal } from '../public-api';
import { FakeLoader } from './fake-loader.testing';

@Component({
  selector: 'app-host',
  imports: [TR],
  template: `
    <p id="pipe">{{ 'common.save' | tr }}</p>
    <p id="pipe-params">{{ 'hello' | tr: { name: name() } }}</p>
    <ng-container *tr="let t; prefix: 'common'">
      <p id="struct">{{ t('save') }}</p>
    </ng-container>
    <span id="attr" trKey="common.save"></span>
    <input id="ph" trKey="common.save" trAttr="placeholder" />
    <span id="attr-params" trKey="hello" [trParams]="{ name: name() }"></span>
    <span id="sig">{{ title() }}</span>
    <span id="t">{{ tt() }}</span>
  `,
})
class Host {
  name = signal('Ali');
  title = translateSignal('common.save');
  private t = injectT();
  tt = computed(() => this.t('hello', { name: 'Q' }));
}

beforeEach(() => FakeLoader.reset());
afterEach(() => TestBed.resetTestingModule());

describe('template bindings', () => {
  it('pipe, structural + attribute directives and signals render and react to language/param changes', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideI18n({ langs: ['fa', 'en'], defaultLang: 'fa', loader: FakeLoader, storageKey: null })],
    });
    const svc = TestBed.inject(I18nService);
    await svc.use('fa');
    const fx = TestBed.createComponent(Host);
    await fx.whenStable();
    const q = (id: string) => (fx.nativeElement as HTMLElement).querySelector('#' + id) as HTMLElement;

    expect(q('pipe').textContent).toBe('ذخیره');
    expect(q('pipe-params').textContent).toBe('سلام Ali');
    expect(q('struct').textContent).toBe('ذخیره');
    expect(q('attr').textContent).toBe('ذخیره');
    expect(q('ph').getAttribute('placeholder')).toBe('ذخیره');
    expect(q('attr-params').textContent).toBe('سلام Ali');
    expect(q('sig').textContent).toBe('ذخیره');
    expect(q('t').textContent).toBe('سلام Q');

    await svc.use('en');
    await fx.whenStable();
    expect(q('pipe').textContent).toBe('Save');
    expect(q('struct').textContent).toBe('Save');
    expect(q('attr').textContent).toBe('Save');
    expect(q('ph').getAttribute('placeholder')).toBe('Save');
    expect(q('sig').textContent).toBe('Save');
    expect(q('t').textContent).toBe('Hello Q');

    fx.componentInstance.name.set('Reza');
    await fx.whenStable();
    expect(q('pipe-params').textContent).toBe('Hello Reza');
    expect(q('attr-params').textContent).toBe('Hello Reza');
  });
});
