import { afterEach, describe, expect, it, vi } from 'vitest';
import { startDragSession } from '../utils/drag-session';

describe('startDragSession', () => {
  afterEach(() => {
    // برای اطمینان از این‌که هیچ listenerِ جامونده‌ای از یه تست به تستِ بعدی درز نمی‌کنه
    vi.restoreAllMocks();
  });

  it('باید بلافاصله بعدِ شروع، listenerهای mousemove/touchmove/mouseup/touchend/touchcancel رو روی document وصل کنه', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    startDragSession({ onMove: vi.fn() });

    const registeredTypes = addSpy.mock.calls.map((c) => c[0]);
    expect(registeredTypes).toContain('mousemove');
    expect(registeredTypes).toContain('touchmove');
    expect(registeredTypes).toContain('mouseup');
    expect(registeredTypes).toContain('touchend');
    expect(registeredTypes).toContain('touchcancel');
  });

  it('touchmove باید با { passive: false } وصل بشه (وگرنه preventDefault اثر نداره)', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    startDragSession({ onMove: vi.fn() });

    const touchmoveCall = addSpy.mock.calls.find((c) => c[0] === 'touchmove');
    expect(touchmoveCall?.[2]).toEqual({ passive: false });
  });

  it('onMove باید با هر mousemove صدا زده بشه', () => {
    const onMove = vi.fn();
    startDragSession({ onMove });

    const ev = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
    document.dispatchEvent(ev);

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(ev);
  });

  it('روی touchmove باید preventDefault صدا زده بشه (جلوگیری از اسکرول صفحه)', () => {
    const onMove = vi.fn();
    startDragSession({ onMove });

    const ev = new Event('touchmove', { cancelable: true }) as any;
    ev.touches = [];
    const preventSpy = vi.spyOn(ev, 'preventDefault');

    document.dispatchEvent(ev);

    expect(preventSpy).toHaveBeenCalled();
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('mouseup باید تمام listenerها رو پاک کنه و onEnd رو صدا بزنه', () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    startDragSession({ onMove, onEnd });

    const upEvent = new MouseEvent('mouseup');
    document.dispatchEvent(upEvent);

    expect(onEnd).toHaveBeenCalledWith(upEvent);
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

    // بعد از پایان، دیگه نباید به mousemove واکنش نشون بده
    onMove.mockClear();
    document.dispatchEvent(new MouseEvent('mousemove'));
    expect(onMove).not.toHaveBeenCalled();
  });

  it('صدازدنِ دستیِ stop() (مقدار برگشتی) هم باید listenerها رو پاک کنه، بدون فراخوانیِ onEnd', () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();

    const stop = startDragSession({ onMove, onEnd });
    stop();

    expect(onEnd).not.toHaveBeenCalled();

    document.dispatchEvent(new MouseEvent('mousemove'));
    expect(onMove).not.toHaveBeenCalled();
  });

  it('touchend و touchcancel هم باید نشست رو تموم کنن', () => {
    const onEnd1 = vi.fn();
    startDragSession({ onMove: vi.fn(), onEnd: onEnd1 });
    document.dispatchEvent(new Event('touchend'));
    expect(onEnd1).toHaveBeenCalledTimes(1);

    const onEnd2 = vi.fn();
    startDragSession({ onMove: vi.fn(), onEnd: onEnd2 });
    document.dispatchEvent(new Event('touchcancel'));
    expect(onEnd2).toHaveBeenCalledTimes(1);
  });
});
