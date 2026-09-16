import { Injectable, inject } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { NativeMediaEngine } from './native-media-engine';
import { NgxMediaDecoderRegistry } from '../decoders/decoder-registry';
import { canPlayNatively, isBrowser } from '../utils/capabilities';
import { NGX_MEDIA_REQUEST_HANDLER } from '../decoders/decoder.tokens';
import { NgxMediaError } from '../contracts/media-error';

/**
 * Resolution order per §38: native fast path first; if `canPlayType` says no,
 * try a registered decoder; MSE is deliberately NOT tried automatically for
 * plain sources — it's an opt-in backend a decoder or the facade's caller
 * requests explicitly (streaming a source doesn't mean every source wants
 * MSE's overhead).
 */
@Injectable({ providedIn: 'root' })
export class NgxMediaEngineFactory {
  private readonly registry = inject(NgxMediaDecoderRegistry);
  private readonly requestHandler = inject(NGX_MEDIA_REQUEST_HANDLER);

  async create(
    kind: NgxMediaKind,
    source: NgxMediaSource,
    runOutsideAngular: <T>(fn: () => T) => T,
    signal?: AbortSignal,
  ): Promise<NgxMediaEngine> {
    if (!isBrowser()) {
      throw NgxMediaError.unsupported('Media engines can only be created in a browser context (SSR guard).');
    }

    const probeEl = document.createElement(kind) as HTMLMediaElement;
    const capability = canPlayNatively(probeEl, source);

    if (capability !== '') {
      return new NativeMediaEngine(kind, runOutsideAngular);
    }

    // Not natively playable — defer to a registered decoder plugin, if any.
    const decoder = await this.registry.findDecoder(source);
    if (decoder) {
      return this.registry.createEngine(source, signal);
    }

    throw NgxMediaError.noDecoder(typeof source.src === 'string' ? source.src : '[blob/stream]');
  }

  /** Explicit opt-in path for callers that specifically want MSE (e.g. a decoder building on it). */
  async createMse(kind: NgxMediaKind): Promise<NgxMediaEngine> {
    const { MseMediaEngine } = await import('./mse-media-engine');
    return new MseMediaEngine(kind, this.requestHandler);
  }
}
