import { Inject, inject, Injectable, Optional } from '@angular/core';
import { NGX_MEDIA_DECODER } from './decoder.tokens';
import { NgxMediaDecoder } from './decoder.interface';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine } from '../engines/media-engine.interface';
import { NgxMediaError } from '../contracts/media-error';

/**
 * Resolves a non-natively-playable source to a registered decoder, highest
 * `priority` first. Nothing here imports MSE/WASM code directly — decoders
 * bring their own (lazily, inside `createEngine`), so a consumer who never
 * registers a decoder never pays for one in their bundle.
 */
@Injectable({ providedIn: 'root' })
export class NgxMediaDecoderRegistry {
  private readonly decoders: readonly NgxMediaDecoder[];

  constructor(
    @Optional()
    @Inject(NGX_MEDIA_DECODER)
    decoders: NgxMediaDecoder[] | null,
  ) {
    this.decoders = [...(decoders ?? [])].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  async findDecoder(source: NgxMediaSource): Promise<NgxMediaDecoder | undefined> {
    if (!this.decoders) return undefined;

    for (const decoder of this.decoders) {
      try {
        if (await decoder.canDecode(source)) return decoder;
      } catch {
        // A misbehaving decoder shouldn't block evaluating the rest.
        continue;
      }
    }
    return undefined;
  }

  async createEngine(source: NgxMediaSource, signal?: AbortSignal): Promise<NgxMediaEngine> {
    const decoder = await this.findDecoder(source);
    if (!decoder) {
      throw NgxMediaError.noDecoder(typeof source.src === 'string' ? source.src : '[blob]');
    }
    return decoder.createEngine(source, signal);
  }

  destroyAll(): void {
    if (!this.decoders) return;
    this.decoders.forEach((d) => d.destroy());
  }
}

/** Injects the registry outside DI (e.g. from a factory function). */
export function injectDecoderRegistry(): NgxMediaDecoderRegistry {
  return inject(NgxMediaDecoderRegistry);
}
