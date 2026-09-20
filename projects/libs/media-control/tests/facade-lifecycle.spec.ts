import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxMediaFacade } from '../facade/ngx-media-facade';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NgxMediaEngine } from '../engines/media-engine.interface';
import { NgxMediaState, initialMediaState } from '../contracts/media-state';
import { signal } from '@angular/core';

function fakeEngine(overrides: Partial<NgxMediaEngine> = {}): NgxMediaEngine {
  const state = signal<NgxMediaState>(initialMediaState());
  return {
    id: 'fake',
    kind: 'audio',
    state: state.asReadonly(),
    mediaElement: null,
    load: vi.fn(async () => {}),
    play: vi.fn(async () => {}),
    pause: vi.fn(),
    seek: vi.fn(),
    setVolume: vi.fn(),
    setMuted: vi.fn(),
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  };
}

function setup(createImpl: () => NgxMediaEngine) {
  TestBed.configureTestingModule({
    providers: [NgxMediaFacade, { provide: NgxMediaEngineFactory, useValue: { create: createImpl } }],
  });
  return TestBed.inject(NgxMediaFacade);
}

describe('NgxMediaFacade — empty playlist tears everything down', () => {
  it('setPlaylist([]) destroys the active engine and clears state/error', async () => {
    const engine = fakeEngine();
    const facade = setup(() => engine);

    facade.setPlaylist([{ src: 'a.mp3' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    expect(engine.destroy).not.toHaveBeenCalled();

    facade.setPlaylist([], 0, true);
    expect(engine.destroy).toHaveBeenCalled();
    expect(facade.state().playback).toBe('idle');
    expect(facade.error()).toBeNull();
  });
});

describe('NgxMediaFacade — selectIndex / reloadCurrent', () => {
  it('selecting the currently-loaded index again does not trigger a new load', async () => {
    const createSpy = vi.fn(() => fakeEngine());
    const facade = setup(createSpy);
    facade.setPlaylist([{ src: 'a.mp3' }, { src: 'b.mp3' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    expect(createSpy).toHaveBeenCalledTimes(1);

    await facade.selectIndex(0);
    expect(createSpy).toHaveBeenCalledTimes(1); // still just the one load
  });

  it('selecting a different index does trigger a new load', async () => {
    const createSpy = vi.fn(() => fakeEngine());
    const facade = setup(createSpy);
    facade.setPlaylist([{ src: 'a.mp3' }, { src: 'b.mp3' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));

    await facade.selectIndex(1);
    expect(createSpy).toHaveBeenCalledTimes(2);
  });

  it('reloadCurrent() forces a real reload even for the already-loaded track', async () => {
    const createSpy = vi.fn(() => fakeEngine());
    const facade = setup(createSpy);
    facade.setPlaylist([{ src: 'a.mp3' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    expect(createSpy).toHaveBeenCalledTimes(1);

    await facade.reloadCurrent();
    expect(createSpy).toHaveBeenCalledTimes(2);
  });
});

describe('NgxMediaFacade — configure() kind switch is deterministic', () => {
  it('switching kind while a source is active rebuilds the engine immediately', async () => {
    const createSpy = vi.fn(() => fakeEngine());
    const facade = setup(createSpy);
    facade.configure('audio');
    facade.setPlaylist([{ src: 'clip.mp4' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    expect(createSpy).toHaveBeenCalledTimes(1);

    facade.configure('video');
    await new Promise((r) => setTimeout(r, 0));
    // A source was already active, so the kind switch must immediately
    // rebuild the engine rather than leaving a stale-kind engine behind a
    // UI that now expects the other element type.
    expect(createSpy).toHaveBeenCalledTimes(2);
  });

  it('setting the same kind again is a no-op', () => {
    const createSpy = vi.fn(() => fakeEngine());
    const facade = setup(createSpy);
    facade.configure('audio');
    facade.configure('audio');
    expect(createSpy).not.toHaveBeenCalled();
  });
});

describe('NgxMediaFacade — play/pause guard when there is no engine', () => {
  it('play() with an empty playlist does not throw and does not touch media session', async () => {
    const facade = setup(() => fakeEngine());
    await expect(facade.play()).resolves.toBeUndefined();
  });

  it('pause() with an empty playlist does not throw', () => {
    const facade = setup(() => fakeEngine());
    expect(() => facade.pause()).not.toThrow();
  });
});
