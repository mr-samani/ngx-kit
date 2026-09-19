import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DecodedBufferEngine } from '../decoders/wasm-decoder.base';

/** Minimal fake AudioContext/AudioBuffer/nodes — jsdom has no real Web Audio implementation. */
function fakeAudioSetup(durationSeconds = 10) {
  let currentTime = 0;
  const sources: any[] = [];

  const ctx: any = {
    state: 'running',
    get currentTime() {
      return currentTime;
    },
    resume: vi.fn(async () => {
      ctx.state = 'running';
    }),
    createGain: () => {
      const gain: any = { value: 1 };
      return { gain, connect: vi.fn(), disconnect: vi.fn() };
    },
    createBufferSource: () => {
      const node: any = {
        buffer: null,
        playbackRate: { value: 1 },
        onended: null as null | (() => void),
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(() => {
          // A manual .stop() must NOT itself fire onended in a real
          // AudioBufferSourceNode unless the browser decides to (it
          // usually does NOT for an explicit stop before natural end) —
          // our fake matches that: stop() alone does nothing further.
        }),
      };
      sources.push(node);
      return node;
    },
    destination: {},
  };

  const buffer: any = { duration: durationSeconds };
  const advanceTime = (seconds: number) => {
    currentTime += seconds;
  };
  return { ctx, buffer, advanceTime, sources };
}

describe('DecodedBufferEngine', () => {
  let ctx: any;
  let buffer: any;
  let advanceTime: (s: number) => void;
  let engine: DecodedBufferEngine;

  beforeEach(() => {
    ({ ctx, buffer, advanceTime } = fakeAudioSetup(10));
    engine = new DecodedBufferEngine('test-decoder', ctx, buffer);
  });

  it('starts ready with the buffer duration', () => {
    expect(engine.state().playback).toBe('ready');
    expect(engine.state().duration).toBe(10);
  });

  it('play() then pause() preserves position (offset) correctly', async () => {
    await engine.play();
    advanceTime(3);
    engine.pause();
    expect(engine.state().currentTime).toBeCloseTo(3, 5);
    expect(engine.state().playback).toBe('paused');
  });

  it('setMuted(true) then setMuted(false) restores the PREVIOUS volume, not 1', () => {
    engine.setVolume(0.35);
    engine.setMuted(true);
    engine.setMuted(false);
    expect(engine.state().volume).toBeCloseTo(0.35, 5);
    expect(engine.state().muted).toBe(false);
  });

  it('setPlaybackRate persists across pause/resume instead of resetting to 1', async () => {
    engine.setPlaybackRate(1.5);
    await engine.play();
    engine.pause();
    await engine.play();
    expect(engine.state().playbackRate).toBe(1.5);
  });

  it('position accounts for playback rate, not just elapsed wall-clock time', async () => {
    engine.setPlaybackRate(2);
    await engine.play();
    advanceTime(3); // 3 real seconds at 2x = 6 buffer-seconds
    engine.pause();
    expect(engine.state().currentTime).toBeCloseTo(6, 5);
  });

  it('replays from the beginning after the buffer ends', async () => {
    await engine.play();
    // Simulate the source naturally finishing (onended fires from the browser).
    const lastSource = (engine as any).source;
    lastSource.onended();
    expect(engine.state().playback).toBe('ended');

    await engine.play();
    expect(engine.state().currentTime).toBeCloseTo(0, 5);
    expect(engine.state().playback).toBe('playing');
  });

  it('a stale onended (from a node stopped by pause/seek) does not override newer state', async () => {
    await engine.play();
    const firstNode = (engine as any).source;
    engine.pause(); // this should invalidate firstNode's onended via the token guard
    // Simulate the browser firing onended late for the OLD node anyway.
    firstNode.onended();
    // Must still be paused, not "ended" — the stale callback must be a no-op.
    expect(engine.state().playback).toBe('paused');
  });

  it('destroy() stops playback and marks state destroyed', async () => {
    await engine.play();
    engine.destroy();
    expect(engine.state().playback).toBe('destroyed');
  });
});
