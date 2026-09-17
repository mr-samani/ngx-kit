import { Injectable, inject } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { NativeMediaEngine } from './native-media-engine';
import { isBrowser } from '../utils/capabilities';
import { NGX_MEDIA_REQUEST_HANDLER } from '../decoders/decoder.tokens';
import { NgxMediaError } from '../contracts/media-error';

/**
 * Only ever returns a native engine (not yet loaded). `canPlayType()`/
 * extension/mime are just a hint and can lie (fake extension, a container
 * the browser opens but can't actually decode) — the only reliable signal
 * is a real `load()` attempt actually failing. So the native-vs-decoder
 * decision is no longer made here; `NgxMediaFacade.resolveEngine()` tries
 * native first and falls back to the decoder registry on a genuine
 * failure. This class stays responsible only for constructing engines.
 */
@Injectable({ providedIn: 'root' })
export class NgxMediaEngineFactory {
  private readonly requestHandler = inject(NGX_MEDIA_REQUEST_HANDLER);

  async create(
    kind: NgxMediaKind,
    source: NgxMediaSource,
    runOutsideAngular: <T>(fn: () => T) => T,
  ): Promise<NgxMediaEngine> {
    if (!isBrowser()) {
      throw NgxMediaError.unsupported('Media engines can only be created in a browser context (SSR guard).');
    }
    return new NativeMediaEngine(kind, runOutsideAngular);
  }

  /** Explicit opt-in path for callers that specifically want MSE (e.g. a decoder building on it). */
  async createMse(kind: NgxMediaKind): Promise<NgxMediaEngine> {
    const { MseMediaEngine } = await import('./mse-media-engine');
    return new MseMediaEngine(kind, this.requestHandler);
  }
}

