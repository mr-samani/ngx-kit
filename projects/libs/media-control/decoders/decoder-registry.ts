import { Injectable, Optional, Inject, inject } from '@angular/core';
import { NGX_MEDIA_DECODER, NGX_MEDIA_CONFIG } from './decoder.tokens';
import { NgxMediaDecoder } from './decoder.interface';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine } from '../engines/media-engine.interface';
import { NgxMediaError } from '../contracts/media-error';

/** Emitted (via `onDecoderFailure`) whenever a decoder's `canDecode()` throws, so failures aren't silently invisible. */
export interface DecoderProbeFailure {
  decoderId: string;
  error: unknown;
}

function extensionOf(source: NgxMediaSource): string | undefined {
  if (typeof source.src !== 'string') return undefined;
  return source.src.split(/[?#]/)[0].split('.').pop()?.toLowerCase();
}

/**
 * Resolves a non-natively-playable source to a registered decoder, highest
 * `priority` first. Nothing here imports MSE/WASM code directly — decoders
 * bring their own (lazily, inside `createEngine`), so a consumer who never
 * registers a decoder never pays for one in their bundle.
 *
 * Probe strategy:
 *  1. Cheap synchronous pre-filter by `formats` (extension match) first —
 *     a decoder that lists `formats: ['3gp']` is never even asked
 *     `canDecode()` for an `.mp3` source.
 *  2. Remaining candidates are probed with bounded concurrency
 *     (`maxConcurrentDecoderProbes`) rather than one at a time, so N
 *     network/CPU-bound `canDecode()` checks don't serialize their latency.
 *  3. The whole probe is cancellable via `signal` (passed down from the
 *     facade's per-load `AbortController`), so switching tracks quickly
 *     doesn't leave abandoned probes burning CPU/network.
 */
@Injectable({ providedIn: 'root' })
export class NgxMediaDecoderRegistry {
  private readonly decoders: readonly NgxMediaDecoder[];
  private readonly config = inject(NGX_MEDIA_CONFIG);

  /** Set by a consumer that wants visibility into swallowed decoder errors (logging/telemetry), instead of them being silently invisible. */
  onDecoderFailure: ((failure: DecoderProbeFailure) => void) | null = null;

  constructor(@Optional() @Inject(NGX_MEDIA_DECODER) decoders: NgxMediaDecoder[] | null) {
    this.decoders = [...(decoders ?? [])].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  async findDecoder(source: NgxMediaSource, signal?: AbortSignal): Promise<NgxMediaDecoder | undefined> {
    if (this.decoders.length === 0) return undefined;

    // Step 1: cheap, synchronous pre-filter. A decoder with a non-empty
    // `formats` list is only a candidate if the source's extension matches
    // (or the source has no discoverable extension at all, in which case we
    // can't rule it out cheaply and let it through to the real probe).
    const ext = extensionOf(source);
    const candidates = this.decoders.filter(
      (d) => d.formats.length === 0 || !ext || d.formats.includes(ext),
    );
    if (candidates.length === 0) return undefined;

    // Step 2 + 3: bounded-concurrency, cancellable probing, highest
    // priority first among each concurrent batch (candidates is already
    // priority-sorted, so batching preserves that order for the final pick).
    const limit = Math.max(1, this.config.maxConcurrentDecoderProbes);
    for (let i = 0; i < candidates.length; i += limit) {
      if (signal?.aborted) return undefined;
      const batch = candidates.slice(i, i + limit);
      const results = await Promise.all(
        batch.map(async (decoder) => {
          try {
            return (await decoder.canDecode(source, signal)) ? decoder : null;
          } catch (error) {
            if (signal?.aborted) return null;
            // A misbehaving decoder shouldn't block evaluating the rest,
            // but the failure is no longer silently swallowed.
            this.onDecoderFailure?.({ decoderId: decoder.id, error });
            return null;
          }
        }),
      );
      if (signal?.aborted) return undefined;
      const found = results.find((d): d is NgxMediaDecoder => d !== null);
      if (found) return found;
    }
    return undefined;
  }

  async createEngine(source: NgxMediaSource, signal?: AbortSignal): Promise<NgxMediaEngine> {
    const decoder = await this.findDecoder(source, signal);
    if (!decoder) {
      throw NgxMediaError.noDecoder(typeof source.src === 'string' ? source.src : '[blob]');
    }
    return decoder.createEngine(source, signal);
  }

  destroyAll(): void {
    this.decoders.forEach((d) => d.destroy());
  }
}

/** Injects the registry outside DI (e.g. from a factory function). */
export function injectDecoderRegistry(): NgxMediaDecoderRegistry {
  return inject(NgxMediaDecoderRegistry);
}
