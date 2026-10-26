import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { run, scanText, scopeOf, unflattenObj } from './extractor.mjs';

describe('scanText', () => {
  it('finds pipe keys, ternaries and params', () => {
    const r = scanText(`<p>{{ 'a.b' | tr }}</p><p [title]="'c.d' | tr: {x: 1}"></p><p>{{ (ok ? 'e.f' : 'g.h') | tr }}</p>`);
    expect(r.keys.sort()).toEqual(['a.b', 'c.d', 'e.f', 'g.h']);
  });
  it('applies *tr prefix to t() calls (and ternaries) but ignores unrelated t()', () => {
    const r = scanText(`
      <ng-container *tr="let t; prefix: 'orders'">
        <h1>{{ t('title') }}</h1><p>{{ t(x ? 'yes' : 'no', { n: f(1) }) }}</p>
      </ng-container>
      <ng-container *tr="let tr">{{ tr('plain') }}</ng-container>`);
    expect(r.keys.sort()).toEqual(['orders.no', 'orders.title', 'orders.yes', 'plain']);
    expect(scanText(`{{ t('ghost') }}`).keys).toEqual([]);
  });
  it('finds trKey attributes with trPrefix', () => {
    const r = scanText(`<span trKey="a.b"></span><i [trKey]="'c'" trPrefix="p"></i><b trKey="d" [trParams]="{a: 1}"></b>`);
    expect(r.keys.sort()).toEqual(['a.b', 'd', 'p.c']);
  });
  it('finds TS calls and counts dynamic ones', () => {
    const r = scanText(`
      this.i18n.t('x.one'); i18n.select("x.two"); const s = translateSignal('x.three');
      const k = marker('x.four'); this.i18n.t(\`dyn.\${id}\`); this.i18n.t(variable);`);
    expect(r.keys.sort()).toEqual(['x.four', 'x.one', 'x.three', 'x.two']);
    expect(r.dynamic).toBe(2);
  });
  it('reads tr-keys comment markers', () => {
    const r = scanText(`// tr-keys: a.b, c.d\n<!-- tr-keys(status): open, closed -->`);
    expect(r.keys.sort()).toEqual(['a.b', 'c.d', 'status.closed', 'status.open']);
  });
});

describe('helpers', () => {
  it('scopeOf picks the longest directory', () => {
    const scopes = { a: '/p/src/app', b: '/p/src/app/deep' };
    expect(scopeOf('/p/src/app/x.ts', scopes)).toBe('a');
    expect(scopeOf('/p/src/app/deep/x.ts', scopes)).toBe('b');
    expect(scopeOf('/p/src/other/x.ts', scopes)).toBeNull();
  });
  it('unflatten keeps dotted key on leaf/branch conflict', () => {
    expect(unflattenObj({ 'a.b': '1', 'a.c': '2', a: 'x' })).toEqual({ a: { b: '1', c: '2' } , });
  });
});

describe('run', () => {
  function project() {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-'));
    const w = (p, c) => { fs.mkdirSync(path.dirname(path.join(d, p)), { recursive: true }); fs.writeFileSync(path.join(d, p), c); };
    w('src/app/app.html', `{{ 'common.save' | tr }}`);
    w('src/app/setting/s.html', `{{ 'request' | tr }} {{ 'common.save' | tr }}`);
    w('src/assets/i18n/fa.json', JSON.stringify({ common: { save: 'ذخیره' }, old: 'x' }));
    return d;
  }
  const opts = (d, extra = {}) => ({ cwd: d, input: ['src/app'], output: 'src/assets/i18n', langs: ['fa', 'en'], scopes: { setting: 'src/app/setting' }, ...extra });

  it('splits keys per scope, keeps existing values, adds placeholders, keeps unused unless --remove', () => {
    const d = project();
    const rep = run(opts(d));
    const fa = JSON.parse(fs.readFileSync(path.join(d, 'src/assets/i18n/fa.json'), 'utf8'));
    expect(fa).toEqual({ 'common.save': 'ذخیره', old: 'x' });
    const setting = JSON.parse(fs.readFileSync(path.join(d, 'src/assets/i18n/setting/en.json'), 'utf8'));
    expect(setting).toEqual({ 'common.save': '', request: '' });
    expect(rep.scopes['(global)'].unused.fa).toEqual(['old']);
    run(opts(d, { remove: true }));
    expect(JSON.parse(fs.readFileSync(path.join(d, 'src/assets/i18n/fa.json'), 'utf8'))).toEqual({ 'common.save': 'ذخیره' });
  });
  it('unflat output + idempotent second run', () => {
    const d = project();
    run(opts(d, { unflat: true }));
    const fa = JSON.parse(fs.readFileSync(path.join(d, 'src/assets/i18n/fa.json'), 'utf8'));
    expect(fa.common.save).toBe('ذخیره');
    expect(run(opts(d, { unflat: true })).written).toEqual([]);
  });
  it('check mode writes nothing and fails when keys are missing', () => {
    const d = project();
    const rep = run(opts(d, { check: true }));
    expect(rep.ok).toBe(false);
    expect(fs.existsSync(path.join(d, 'src/assets/i18n/en.json'))).toBe(false);
    run(opts(d));
    expect(run(opts(d, { check: true })).ok).toBe(true);
  });
});
