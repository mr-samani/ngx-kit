import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { provideNgxMedia } from '../providers/provide-ngx-media';
import { NGX_MEDIA_CONFIG, NGX_MEDIA_CONFIG_DEFAULTS } from '../decoders/decoder.tokens';
import { NgxMediaDecoderRegistry } from '../decoders/decoder-registry';
import { NGX_MEDIA_DECODER } from '../decoders/decoder.tokens';
import { NgxMediaDecoder } from '../decoders/decoder.interface';
import { NgxMediaSessionBridge } from '../facade/media-session';

describe('provideNgxMedia — config merges over defaults instead of replacing them', () => {
  it('a partial config keeps the other defaults intact', () => {
    TestBed.configureTestingModule({ providers: [provideNgxMedia({ preload: 'auto' })] });
    const config = TestBed.inject(NGX_MEDIA_CONFIG);
    expect(config.preload).toBe('auto');
    expect(config.maxConcurrentDecoderProbes).toBe(NGX_MEDIA_CONFIG_DEFAULTS.maxConcurrentDecoderProbes);
  });

  it('no config at all -> pure defaults', () => {
    TestBed.configureTestingModule({ providers: [provideNgxMedia()] });
    const config = TestBed.inject(NGX_MEDIA_CONFIG);
    expect(config).toEqual(NGX_MEDIA_CONFIG_DEFAULTS);
  });
});

describe('NgxMediaDecoderRegistry — cheap pre-filter + bounded concurrency', () => {
  function makeDecoder(id: string, formats: string[], canDecodeImpl: () => boolean | Promise<boolean>): NgxMediaDecoder {
    return {
      id,
      formats,
      canDecode: vi.fn(canDecodeImpl),
      createEngine: vi.fn(async () => ({}) as any),
      destroy: vi.fn(),
    };
  }

  it('never calls canDecode() on a decoder whose formats list excludes the source extension', async () => {
    const threeGp = makeDecoder('3gp', ['3gp'], () => true);
    TestBed.configureTestingModule({ providers: [{ provide: NGX_MEDIA_DECODER, useValue: threeGp, multi: true }] });
    const registry = TestBed.inject(NgxMediaDecoderRegistry);

    await registry.findDecoder({ src: 'song.mp3' });
    expect(threeGp.canDecode).not.toHaveBeenCalled();
  });

  it('a decoder with no formats list is never excluded by the pre-filter', async () => {
    const generic = makeDecoder('generic', [], () => true);
    TestBed.configureTestingModule({ providers: [{ provide: NGX_MEDIA_DECODER, useValue: generic, multi: true }] });
    const registry = TestBed.inject(NgxMediaDecoderRegistry);

    const found = await registry.findDecoder({ src: 'song.mp3' });
    expect(found?.id).toBe('generic');
  });

  it('reports probe failures via onDecoderFailure instead of swallowing them invisibly', async () => {
    const broken = makeDecoder('broken', [], () => {
      throw new Error('boom');
    });
    const working = makeDecoder('working', [], () => true);
    TestBed.configureTestingModule({
      providers: [
        { provide: NGX_MEDIA_DECODER, useValue: broken, multi: true },
        { provide: NGX_MEDIA_DECODER, useValue: working, multi: true },
      ],
    });
    const registry = TestBed.inject(NgxMediaDecoderRegistry);
    const failures: unknown[] = [];
    registry.onDecoderFailure = (f) => failures.push(f);

    const found = await registry.findDecoder({ src: 'song.mp3' });
    expect(found?.id).toBe('working');
    expect(failures).toHaveLength(1);
    expect((failures[0] as any).decoderId).toBe('broken');
  });

  it('probing can be cancelled via signal', async () => {
    const slow = makeDecoder('slow', [], () => new Promise((resolve) => setTimeout(() => resolve(true), 50)));
    TestBed.configureTestingModule({ providers: [{ provide: NGX_MEDIA_DECODER, useValue: slow, multi: true }] });
    const registry = TestBed.inject(NgxMediaDecoderRegistry);
    const controller = new AbortController();
    controller.abort();

    const found = await registry.findDecoder({ src: 'song.mp3' }, controller.signal);
    expect(found).toBeUndefined();
  });
});

describe('NgxMediaSessionBridge — multiple players do not clobber each other', () => {
  const actions = {
    play: () => {},
    pause: () => {},
    previous: () => {},
    next: () => {},
    seekBackward: () => {},
    seekForward: () => {},
  };

  it('destroying an OLDER player after a newer one has bound does not clear the newer one', () => {
    if (!('mediaSession' in navigator)) return; // environment doesn't support it — nothing to test
    const setActionHandlerSpy = vi.spyOn(navigator.mediaSession, 'setActionHandler');

    const playerA = new NgxMediaSessionBridge();
    const playerB = new NgxMediaSessionBridge();
    playerA.bind(actions);
    playerB.bind(actions); // B now owns the session

    setActionHandlerSpy.mockClear();
    playerA.unbind(); // A is stale — must NOT clear B's handlers
    expect(setActionHandlerSpy).not.toHaveBeenCalled();

    playerB.unbind(); // B still owns it — this SHOULD clear
    expect(setActionHandlerSpy).toHaveBeenCalled();

    setActionHandlerSpy.mockRestore();
  });
});
