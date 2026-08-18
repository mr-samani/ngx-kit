import { describe, expect, it } from 'vitest';
import { mergeConfig } from '../utils/merge-config';

describe('mergeConfig', () => {
  it('باید یه کپیِ عمیق از base رو برگردونه وقتی override داده نشده', () => {
    const base = { a: 1, nested: { b: 2 } };
    const result = mergeConfig(base);

    expect(result).toEqual(base);
    expect(result).not.toBe(base);
    expect(result.nested).not.toBe(base.nested);
  });

  it('باید فیلدهای primitive رو override کنه', () => {
    const result = mergeConfig({ a: 1, b: 'x' }, { a: 2 });
    expect(result).toEqual({ a: 2, b: 'x' });
  });

  it('باید آبجکت‌های تودرتو رو عمیقاً ادغام کنه (نه جایگزینی کامل)', () => {
    const base = { column: { minWidth: 80, maxWidth: 480 }, label: 'x' };
    // نکته: امضای mergeConfig از Partial<T> کم‌عمق استفاده می‌کنه، پس در
    // سطح تایپ override نمی‌تونه فقط بخشی از یه فیلدِ تودرتو رو بده — ولی
    // در عمل (runtime) کاملاً پارشیالِ عمیق رو قبول می‌کنه؛ همین رفتار
    // واقعیه که این تست داره چک می‌کنه.
    const result = mergeConfig(base, { column: { minWidth: 100 } as typeof base.column });

    expect(result).toEqual({
      column: { minWidth: 100, maxWidth: 480 },
      label: 'x',
    });
  });

  it('باید آرایه‌ها رو کامل جایگزین کنه، نه ادغام آیتم‌به‌آیتم', () => {
    const result = mergeConfig({ items: [1, 2, 3] }, { items: [9] });
    expect(result.items).toEqual([9]);
  });

  it('باید کلیدهایی که فقط توی override هستن رو هم اضافه کنه', () => {
    const result = mergeConfig<{ a: number; b?: number }>({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('باید override با مقدار undefined رو نادیده بگیره (مقدار base بمونه)', () => {
    const result = mergeConfig<{ a: number | undefined }>({ a: 1 }, { a: undefined });
    expect(result.a).toBe(1);
  });

  it('نباید اجازه‌ی آلوده‌شدنِ prototype رو بده (__proto__/constructor/prototype)', () => {
    const malicious = JSON.parse('{"__proto__": {"polluted": true}, "safe": 1}');
    const result = mergeConfig({ safe: 0 }, malicious);

    expect((result as any).polluted).toBeUndefined();
    expect(({} as any).polluted).toBeUndefined();
    expect(result.safe).toBe(1);
  });

  it('باید Date/RegExp رو به‌عنوان primitive جایگزین کنه، نه merge تلاش کنه', () => {
    const d = new Date('2024-01-01');
    const result = mergeConfig({ createdAt: new Date('2020-01-01') }, { createdAt: d });
    expect(result.createdAt).toBe(d);
  });
});
