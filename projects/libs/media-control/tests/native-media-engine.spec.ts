import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NativeMediaEngine } from '../engines/native-media-engine';

/**
 * jsdom's HTMLMediaElement doesn't implement real playback, so we build a
 * minimal fake that behaves like one for the events/state the engine cares
 * about, and inject it via the engine's `existingElement` constructor param.
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
    removeAttribute: vi.fn(),
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
