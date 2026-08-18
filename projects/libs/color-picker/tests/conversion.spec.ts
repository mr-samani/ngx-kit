import { describe, expect, it } from 'vitest';
import {
  cmykToRgb,
  hexToRgb,
  hslToRgba,
  hsvToRgb,
  parseHslString,
  parseRgbString,
  rgbaToHex,
  rgbToCmyk,
  rgbToHsl,
  rgbToHsv,
} from '../utils/conversion';

describe('hexToRgb', () => {
  it('باید هگزِ ۶ کاراکتری (بدون آلفا) رو تبدیل کنه', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('باید هگزِ ۳ کاراکتری (مخفف) رو تبدیل کنه', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('باید هگزِ ۸ کاراکتری (با آلفا) رو تبدیل کنه', () => {
    const result = hexToRgb('#ff000080');
    expect(result.r).toBe(255);
    expect(result.g).toBe(0);
    expect(result.b).toBe(0);
    expect(result.a).toBeCloseTo(0.5, 1);
  });

  it('باید هگزِ ۴ کاراکتریِ مخفف با آلفا رو هم تبدیل کنه (باگی که رفع شد)', () => {
    const result = hexToRgb('#f008');
    expect(result.r).toBe(255);
    expect(result.g).toBe(0);
    expect(result.b).toBe(0);
    expect(result.a).toBeCloseTo(0.53, 1);
  });

  it('باید بدون # هم کار کنه', () => {
    expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it('باید برای طول‌های نامعتبر خطا بده', () => {
    expect(() => hexToRgb('#12345')).toThrow();
    expect(() => hexToRgb('#1234567')).toThrow();
  });
});

describe('parseRgbString / parseHslString', () => {
  it('باید rgba(...) رو parse کنه', () => {
    expect(parseRgbString('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('باید rgb(...) بدون آلفا رو parse کنه (آلفا پیش‌فرض ۱)', () => {
    expect(parseRgbString('rgb(1, 2, 3)')).toEqual({ r: 1, g: 2, b: 3, a: 1 });
  });

  it('باید hsl(...) رو parse کنه', () => {
    expect(parseHslString('hsl(120, 50%, 40%)')).toEqual({ h: 120, s: 50, l: 40, a: 1 });
  });

  it('باید برای رشته‌ی نامعتبر خطا بده', () => {
    expect(() => parseRgbString('not-a-color')).toThrow();
  });
});

describe('چرخه‌ی رفت‌وبرگشتِ RGB ↔ HSL ↔ HSV', () => {
  it('rgbToHsl برای قرمزِ خالص', () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('hslToRgba باید معکوسِ rgbToHsl باشه', () => {
    expect(hslToRgba(0, 100, 50, 1)).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('rgbToHsv برای قرمزِ خالص', () => {
    expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 });
  });

  it('hsvToRgb باید معکوسِ rgbToHsv باشه', () => {
    expect(hsvToRgb(0, 100, 100)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('برای سفید، اشباع باید صفر باشه (نه NaN)', () => {
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
  });
});

describe('rgbaToHex', () => {
  it('باید بدون آلفای شفاف، هگزِ ۶ کاراکتری بده', () => {
    expect(rgbaToHex(255, 0, 0, 1, true, false)).toBe('#ff0000');
  });

  it('باید با آلفای ناقص، هگزِ ۸ کاراکتری بده', () => {
    expect(rgbaToHex(255, 0, 0, 0.5, true, false)).toBe('#ff000080');
  });
});

describe('CMYK ↔ RGB', () => {
  it('cmykToRgb برای مشکیِ خالص', () => {
    expect(cmykToRgb(0, 0, 0, 100)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('rgbToCmyk برای قرمزِ خالص', () => {
    expect(rgbToCmyk(255, 0, 0)).toEqual({ c: 0, m: 100, y: 100, k: 0 });
  });
});
