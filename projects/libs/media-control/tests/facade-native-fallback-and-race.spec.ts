import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxMediaFacade } from '../facade/ngx-media-facade';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NGX_MEDIA_DECODER } from '../decoders/decoder.tokens';
import { NgxMediaDecoder } from '../decoders/decoder.interface';
import { NgxMediaEngine } from '../engines/media-engine.interface';
import { NgxMediaState, initialMediaState } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
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

const AUDIO_SOURCE = { src: 'clip.mp4', type: 'video/mp4' };

describe('NgxMediaFacade — decoder fallback policy (format failures only, never network/abort)', () => {
  function setupWithNativeFailure(nativeError: unknown) {
    const failingNative = fakeEngine({
      load: vi.fn(async () => {
        throw nativeError;
      }),
    });
    const decoderEngine = fakeEngine({ id: 'decoder-produced' });
    const decoder: NgxMediaDecoder = {
      id: 'fallback',
      formats: [],
      canDecode: () => true,
      createEngine: vi.fn(async () => decoderEngine),
      destroy: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        NgxMediaFacade,
        { provide: NgxMediaEngineFactory, useValue: { create: () => failingNative } },
        { provide: NGX_MEDIA_DECODER, useValue: decoder, multi: true },
      ],
    });
    return { facade: TestBed.inject(NgxMediaFacade), failingNative, decoder };
  }

  it('UNSUPPORTED_FORMAT -> decoder IS tried', async () => {
    const { facade, decoder, failingNative } = setupWithNativeFailure(
      new NgxMediaError('UNSUPPORTED_FORMAT', 'not natively playable'),
    );
    facade.setPlaylist([AUDIO_SOURCE], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    expect(decoder.createEngine).toHaveBeenCalled();
    expect(failingNative.destroy).toHaveBeenCalled();
  });

  it('DECODER (decode failure) -> decoder IS tried', async () => {
    const { facade, decoder } = setupWithNativeFailure(new NgxMediaError('DECODER', 'could not decode'));
    facade.setPlaylist([AUDIO_SOURCE], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    expect(decoder.createEngine).toHaveBeenCalled();
  });

  it('NETWORK failure (e.g. 404/CORS) -> decoder is NOT tried', async () => {
    const { facade, decoder } = setupWithNativeFailure(new NgxMediaError('NETWORK', 'could not fetch'));
    facade.setPlaylist([AUDIO_SOURCE], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    expect(decoder.createEngine).not.toHaveBeenCalled();
    expect(facade.error()?.category).toBe('NETWORK');
  });

  it('PERMISSION failure -> decoder is NOT tried', async () => {
    const { facade, decoder } = setupWithNativeFailure(new NgxMediaError('PERMISSION', 'blocked'));
    facade.setPlaylist([AUDIO_SOURCE], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    expect(decoder.createEngine).not.toHaveBeenCalled();
  });

  it('a plain (non-NgxMediaError) failure is treated conservatively -> decoder is NOT tried', async () => {
    const { facade, decoder } = setupWithNativeFailure(new Error('something unexpected'));
    facade.setPlaylist([AUDIO_SOURCE], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    expect(decoder.createEngine).not.toHaveBeenCalled();
  });
});

describe('NgxMediaFacade — next() while a previous load is still in flight (race/cancellation)', () => {
  it('does not surface a stale error and lands on the newly-selected track', async () => {
    let resolveFirstLoad!: () => void;
    const slowEngine = fakeEngine({
      load: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstLoad = resolve;
          }),
      ),
    });
    const fastEngine = fakeEngine({ id: 'track-2' });

    let call = 0;
    TestBed.configureTestingModule({
      providers: [
        NgxMediaFacade,
        {
          provide: NgxMediaEngineFactory,
          useValue: { create: () => (call++ === 0 ? slowEngine : fastEngine) },
        },
      ],
    });

    const facade = TestBed.inject(NgxMediaFacade);
    facade.setPlaylist(
      [
        { src: 'a.mp3', title: 'A' },
        { src: 'b.mp3', title: 'B' },
      ],
      0,
      true,
    );
    await facade.next();
    resolveFirstLoad!(); // the now-superseded first load finally resolves
    await new Promise((r) => setTimeout(r, 0));

    expect(facade.currentIndex()).toBe(1);
    expect(facade.error()).toBeNull();
  });

  it('transactional swap: a FAILED next() does not destroy the currently-playing engine', async () => {
    const currentEngine = fakeEngine({ id: 'current' });
    let call = 0;
    TestBed.configureTestingModule({
      providers: [
        NgxMediaFacade,
        {
          provide: NgxMediaEngineFactory,
          useValue: {
            create: () => {
              if (call++ === 0) return currentEngine;
              // The second (next) load's engine fails at load() time.
              return fakeEngine({
                load: vi.fn(async () => {
                  throw new NgxMediaError('NETWORK', 'boom');
                }),
              });
            },
          },
        },
      ],
    });

    const facade = TestBed.inject(NgxMediaFacade);
    facade.setPlaylist(
      [
        { src: 'a.mp3' },
        { src: 'b.mp3' },
      ],
      0,
      true,
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(currentEngine.destroy).not.toHaveBeenCalled();

    await facade.next(); // fails
    expect(facade.error()).not.toBeNull();
    // The OLD engine (track A) must still be the active one — a failed
    // next() must never leave playback stopped/destroyed for nothing.
    expect(currentEngine.destroy).not.toHaveBeenCalled();
  });
});
