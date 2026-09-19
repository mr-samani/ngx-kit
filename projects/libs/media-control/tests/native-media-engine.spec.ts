import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NativeMediaEngine } from '../engines/native-media-engine';

/**
 * jsdom's HTMLMediaElement doesn't implement real playback, so we build a
 * minimal fake that behaves like one for the events/state the engine cares
 * about, and inject it via the engine's `existingElement` constructor param.
 * `load` resolves asynchronously (via `queueMicrotask`) to mimic a real
 * network round-trip, which is what lets the "same source while loading"
 * tests below actually exercise the promise-reuse path.
 */
function fakeAudioElement() {
  const target = new EventTarget();
  const fake: any = Object.assign(target, {
    paused: true,
    duration: NaN,
    currentTime: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    buffered: { length: 0, start: () => 0, end: () => 0 },
    networkState: 0,
    preload: 'metadata',
    playsInline: false,
    src: '',
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    play: vi.fn(async () => {
      fake.paused = false;
      fake.dispatchEvent(new Event('playing'));
    }),
    pause: vi.fn(() => {
      fake.paused = true;
      fake.dispatchEvent(new Event('pause'));
    }),
    load: vi.fn(() => {
      queueMicrotask(() => {
        fake.duration = 42;
        fake.dispatchEvent(new Event('loadedmetadata'));
      });
    }),
  });
  return fake as HTMLMediaElement;
}

describe('NativeMediaEngine', () => {
  let el: HTMLMediaElement;
  let engine: NativeMediaEngine;

  beforeEach(() => {
    el = fakeAudioElement();
    engine = new NativeMediaEngine('audio', (fn) => fn(), el);
  });

  it('reaches "ready" with the discovered duration after load()', async () => {
    await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
    expect(engine.state().playback).toBe('ready');
    expect(engine.state().duration).toBe(42);
  });

  it('transitions to "playing" on play()', async () => {
    await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
    await engine.play();
    expect(engine.state().playback).toBe('playing');
  });

  it('transitions to "paused" on pause()', async () => {
    await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
    await engine.play();
    engine.pause();
    expect(engine.state().playback).toBe('paused');
  });

  it('clamps volume to [0, 1]', async () => {
    engine.setVolume(5);
    expect((el as any).volume).toBe(1);
    engine.setVolume(-1);
    expect((el as any).volume).toBe(0);
  });

  it('creates and revokes an object URL for Blob sources', async () => {
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const blob = new Blob(['x'], { type: 'audio/mpeg' });

    await engine.load({ src: blob, type: 'audio/mpeg' });
    expect(createSpy).toHaveBeenCalledWith(blob);

    await engine.load({ src: 'other.mp3', type: 'audio/mpeg' });
    expect(revokeSpy).toHaveBeenCalledWith('blob:fake');

    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });

  it('destroy() is idempotent and moves state to "destroyed"', async () => {
    await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
    engine.destroy();
    engine.destroy();
    expect(engine.state().playback).toBe('destroyed');
    expect(() => engine.seek(1)).toThrow();
  });

  it('methods throw NgxMediaError after destroy() (assertNotDestroyed)', async () => {
    await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
    engine.destroy();
    await expect(engine.load({ src: 'other.mp3' })).rejects.toThrow();
    expect(() => engine.seek(5)).toThrow();
    await expect(engine.play()).rejects.toThrow();
  });

  describe('load-state machine (duplicate-network-request prevention)', () => {
    it('a normal load calls el.load() exactly once', async () => {
      const loadSpy = vi.spyOn(el as any, 'load');
      await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      expect(loadSpy).toHaveBeenCalledTimes(1);
    });

    it('same source already loaded -> resolves immediately, no el.load() call', async () => {
      await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      const loadSpy = vi.spyOn(el as any, 'load');
      await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('same source requested again WHILE the first load is still pending -> reuses the SAME promise, only one el.load() call', async () => {
      const loadSpy = vi.spyOn(el as any, 'load');
      const first = engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      const second = engine.load({ src: 'song.mp3', type: 'audio/mpeg' }); // fired before `first` resolves
      expect(first).toBe(second); // literally the same Promise instance
      await Promise.all([first, second]);
      expect(loadSpy).toHaveBeenCalledTimes(1);
      expect(engine.state().playback).toBe('ready');
    });

    it('a genuinely different source triggers exactly one new el.load() call', async () => {
      await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      const loadSpy = vi.spyOn(el as any, 'load');
      await engine.load({ src: 'other-song.mp3', type: 'audio/mpeg' });
      expect(loadSpy).toHaveBeenCalledTimes(1);
    });

    it('same URL but different requestHeaders is treated as a different source (reloads)', async () => {
      await engine.load({ src: 'song.mp3', requestHeaders: { Authorization: 'Bearer a' } });
      const loadSpy = vi.spyOn(el as any, 'load');
      await engine.load({ src: 'song.mp3', requestHeaders: { Authorization: 'Bearer b' } });
      expect(loadSpy).toHaveBeenCalledTimes(1);
    });

    it('same URL and equivalent (differently-ordered) requestHeaders does NOT reload', async () => {
      await engine.load({ src: 'song.mp3', requestHeaders: { A: '1', B: '2' } });
      const loadSpy = vi.spyOn(el as any, 'load');
      await engine.load({ src: 'song.mp3', requestHeaders: { B: '2', A: '1' } });
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('a failed load resets identity, so retrying the same source afterwards actually retries (not treated as already-loaded)', async () => {
      const failing = fakeAudioElement();
      (failing as any).load = vi.fn(() => {
        queueMicrotask(() => failing.dispatchEvent(new Event('error')));
      });
      (failing as any).networkState = 3; // NETWORK_NO_SOURCE
      const failingEngine = new NativeMediaEngine('audio', (fn) => fn(), failing);

      await expect(failingEngine.load({ src: 'flaky.mp3' })).rejects.toThrow();
      expect((failing as any).load).toHaveBeenCalledTimes(1);

      // Retry: since the previous attempt failed, this must NOT be treated
      // as "already loaded" — it should genuinely try again.
      (failing as any).load = vi.fn(() => {
        queueMicrotask(() => {
          (failing as any).duration = 10;
          failing.dispatchEvent(new Event('loadedmetadata'));
        });
      });
      await failingEngine.load({ src: 'flaky.mp3' });
      expect((failing as any).load).toHaveBeenCalledTimes(1);
      expect(failingEngine.state().playback).toBe('ready');
    });

    it('respects the preload option passed at construction', () => {
      const el2 = fakeAudioElement();
      new NativeMediaEngine('audio', (fn) => fn(), el2, 'auto');
      expect((el2 as any).preload).toBe('auto');
    });
  });

  describe('allocation-aware state patching', () => {
    it('does not write a new buffered array when the ranges have not actually moved', async () => {
      await engine.load({ src: 'song.mp3', type: 'audio/mpeg' });
      const before = engine.state().buffered;
      (el as any).buffered = { length: 0, start: () => 0, end: () => 0 }; // still empty, "unchanged"
      (el as EventTarget).dispatchEvent(new Event('progress'));
      expect(engine.state().buffered).toBe(before); // same array reference — no signal write happened
    });
  });

  it('rejects with NgxMediaError when the element fires an error event during load', async () => {
    const failing = fakeAudioElement();
    (failing as any).load = () => {
      queueMicrotask(() => failing.dispatchEvent(new Event('error')));
    };
    (failing as any).networkState = 3; // NETWORK_NO_SOURCE
    const failingEngine = new NativeMediaEngine('audio', (fn) => fn(), failing);
    await expect(failingEngine.load({ src: 'missing.mp3' })).rejects.toThrow();
  });
});
