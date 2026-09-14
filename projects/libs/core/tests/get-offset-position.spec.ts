import { describe, expect, it, vi } from 'vitest';
import { getOffsetPosition } from '../utils/get-offset-position';

function mockParentRect(el: HTMLElement, rect: Partial<DOMRect>) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {},
    ...rect,
  } as DOMRect);
}

function fakeMouseEvent(pageX: number, pageY: number): MouseEvent {
  // Object.create(MouseEvent.prototype) یعنی instanceof MouseEvent درسته، ولی
  // چون خودِ آبجکت پراپرتیِ خاصِ خودشو نداره، defineProperty برای pageX/pageY
  // (که MouseEvent واقعی توی jsdom معمولاً به‌صورت getter تعریفشون می‌کنه و
  // شاید non-configurable باشن) بدون خطا کار می‌کنه.
  const ev = Object.create(MouseEvent.prototype);
  Object.defineProperty(ev, 'pageX', { value: pageX, configurable: true });
  Object.defineProperty(ev, 'pageY', { value: pageY, configurable: true });
  return ev;
}

describe('getOffsetPosition', () => {
  it('باید موقعیتِ MouseEvent رو نسبت به گوشه‌ی بالا-چپِ parent حساب کنه', () => {
    const parent = document.createElement('div');
    mockParentRect(parent, { left: 50, top: 20 });

    const ev = fakeMouseEvent(150, 120);
    const pos = getOffsetPosition(ev, parent);

    expect(pos.x).toBe(150 - 50 - window.scrollX);
    expect(pos.y).toBe(120 - 20 - window.scrollY);
  });

  it('باید موقعیتِ اولین touch رو برای TouchEvent حساب کنه', () => {
    const parent = document.createElement('div');
    mockParentRect(parent, { left: 10, top: 10 });

    const fakeTouch = { pageX: 60, pageY: 40 } as Touch;
    const ev = {
      touches: [fakeTouch],
    } as unknown as TouchEvent;

    const pos = getOffsetPosition(ev, parent);

    expect(pos.x).toBe(60 - 10 - window.scrollX);
    expect(pos.y).toBe(40 - 10 - window.scrollY);
  });

  it('باید برای TouchEvent بدون هیچ touch فعالی، صفر برگردونه (منهای آفستِ parent)', () => {
    const parent = document.createElement('div');
    mockParentRect(parent, { left: 5, top: 5 });

    const ev = { touches: [] } as unknown as TouchEvent;
    const pos = getOffsetPosition(ev, parent);

    expect(pos.x).toBe(0 - 5 - window.scrollX);
    expect(pos.y).toBe(0 - 5 - window.scrollY);
  });
});
