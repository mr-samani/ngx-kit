import { describe, expect, it } from 'vitest';
import {
  clamp,
  distanceBetweenTouches,
  midpointOfTouches,
  zoomAroundPoint,
} from '../utils/zoom-math';

describe('zoomAroundPoint', () => {
  it('اگه cursor دقیقاً روی مرکزِ container باشه، pan نباید تغییر کنه', () => {
    const result = zoomAroundPoint({ zoom: 1, panX: 0, panY: 0 }, 2, 200, 150, 400, 300);
    expect(result).toEqual({ zoom: 2, panX: 0, panY: 0 });
  });

  it('zoom-to-cursor باید pan رو طوری تنظیم کنه که نقطه‌ی زیرِ cursor ثابت بمونه', () => {
    // cursor سمتِ راستِ مرکز (400x300، مرکز در 200،150؛ cursor در 300،150)
    const result = zoomAroundPoint({ zoom: 1, panX: 0, panY: 0 }, 2, 300, 150, 400, 300);
    expect(result.zoom).toBe(2);
    expect(result.panX).toBe(-100);
    expect(result.panY).toBe(0);
  });

  it('باید با pan/zoom اولیه‌ی غیرصفر هم درست کار کنه', () => {
    const result = zoomAroundPoint({ zoom: 2, panX: 20, panY: -10 }, 3, 250, 160, 400, 300);
    // localX = (250-200-20)/2 = 15 ; newPanX = 250-200-15*3 = 5
    // localY = (160-150-(-10))/2 = 10 ; newPanY = 160-150-10*3 = -20
    expect(result.zoom).toBe(3);
    expect(result.panX).toBe(5);
    expect(result.panY).toBe(-20);
  });
});

describe('clamp', () => {
  it('باید مقدار رو بین min/max محدود کنه', () => {
    expect(clamp(5, 1, 3)).toBe(3);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe('distanceBetweenTouches / midpointOfTouches', () => {
  const a = { clientX: 0, clientY: 0 } as Touch;
  const b = { clientX: 6, clientY: 8 } as Touch;

  it('باید فاصله‌ی اقلیدسی بین دو touch رو حساب کنه', () => {
    expect(distanceBetweenTouches(a, b)).toBe(10); // مثلث 6-8-10
  });

  it('باید نقطه‌ی میانی رو حساب کنه', () => {
    expect(midpointOfTouches(a, b)).toEqual({ x: 3, y: 4 });
  });
});
