import { describe, expect, it } from 'vitest';
import { flatten, interpolate, marker, shallowEqual } from '../utils/utils';

describe('flatten', () => {
  it('flattens nested objects and stringifies leaves', () => {
    const m = flatten({ a: { b: 'x', c: { d: 1 } }, e: true, n: null });
    expect(Object.fromEntries(m)).toEqual({ 'a.b': 'x', 'a.c.d': '1', e: 'true' });
  });
  it('keeps literal dotted keys', () => {
    expect(flatten({ 'a.b': 'x' }).get('a.b')).toBe('x');
  });
  it('reports conflicts only for different non-empty values', () => {
    const seen: string[] = [];
    const m = flatten({ a: 'x' });
    flatten({ a: 'y', b: '' }, m, (k) => seen.push(k));
    flatten({ a: 'y' }, m, (k) => seen.push('again:' + k));
    expect(seen).toEqual(['a']);
  });
});

describe('interpolate', () => {
  it('replaces placeholders, nested paths and keeps unknown ones', () => {
    expect(interpolate('Hi {{ name }} / {{user.id}} / {{ nope }}', { name: 'Ali', user: { id: 7 } })).toBe('Hi Ali / 7 / {{ nope }}');
  });
  it('is a no-op without params or placeholders', () => {
    expect(interpolate('plain', { a: 1 })).toBe('plain');
    expect(interpolate('{{ a }}')).toBe('{{ a }}');
  });
  it('supports 0 and false', () => {
    expect(interpolate('{{ n }}-{{ f }}', { n: 0, f: false })).toBe('0-false');
  });
});

describe('misc', () => {
  it('shallowEqual', () => {
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallowEqual(undefined, undefined)).toBe(true);
    expect(shallowEqual({}, undefined)).toBe(false);
  });
  it('marker is identity', () => expect(marker('a.b')).toBe('a.b'));
});
