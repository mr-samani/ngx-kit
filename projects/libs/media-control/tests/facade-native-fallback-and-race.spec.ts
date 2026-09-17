import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxMediaFacade } from '../facade/ngx-media-facade';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NGX_MEDIA_DECODER } from '../decoders/decoder.tokens';
import { NgxMediaDecoder } from '../decoders/decoder.interface';
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

describe('NgxMediaFacade — native failure falls back to a registered decoder', () => {
  it('uses the decoder-provided engine when the native engine genuinely fails to load (e.g. a fake/mislabeled extension)', async () => {
    const failingNative = fakeEngine({
      load: vi.fn(async () => {
        throw new Error('the browser could not decode this despite the extension');
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
        { provide: NgxMediaEngineFactory, useValue: { create: async () => failingNative } },
        { provide: NGX_MEDIA_DECODER, useValue: decoder, multi: true },
      ],
    });

    const facade = TestBed.inject(NgxMediaFacade);
    facade.setPlaylist([{ src: 'clip.mp4', type: 'video/mp4' }], 0, true);
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    expect(decoder.createEngine).toHaveBeenCalled();
    expect(failingNative.destroy).toHaveBeenCalled();
  });
});

describe('NgxMediaFacade — next() while a previous load is still in flight', () => {
  it('does not surface a stale "aborted" error and lands on the newly-selected track', async () => {
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
          useValue: {
            create: async () => (call++ === 0 ? slowEngine : fastEngine),
          },
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
    // first load is now pending on slowEngine.load(), never resolved yet
    await facade.next();
    // resolving the first (now-superseded) load afterwards must not resurrect it
    resolveFirstLoad!();
    await new Promise((r) => setTimeout(r, 0));

    expect(facade.currentIndex()).toBe(1);
    expect(facade.error()).toBeNull();
  });
});
