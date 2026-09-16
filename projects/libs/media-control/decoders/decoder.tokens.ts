import { InjectionToken } from '@angular/core';
import { NgxMediaDecoder } from './decoder.interface';
import { NgxMediaSource } from '../contracts/media-source';

/**
 * Multi-provider token: every decoder a consumer (or a future ngx-kit
 * add-on package, e.g. `ngx-kit/decoder-flac`) registers here is picked up
 * automatically by the registry — no central "known formats" list to edit.
 */
export const NGX_MEDIA_DECODER = new InjectionToken<NgxMediaDecoder[]>(
  'NGX_MEDIA_DECODER',
);

// export const NGX_MEDIA_DECODER = new InjectionToken<NgxMediaDecoder>('NGX_MEDIA_DECODER');

/** Pluggable network layer so auth/signed URLs don't require coupling the core to HttpClient. */
export interface NgxMediaRequestHandler {
  request(source: NgxMediaSource, signal?: AbortSignal): Promise<Response>;
}

export const NGX_MEDIA_REQUEST_HANDLER = new InjectionToken<NgxMediaRequestHandler>(
  'NGX_MEDIA_REQUEST_HANDLER',
  {
    providedIn: 'root',
    factory: () => ({
      request: (source, signal) =>
        fetch(typeof source.src === 'string' ? source.src : '', {
          headers: source.requestHeaders,
          signal,
        }),
    }),
  },
);

export interface NgxMediaConfig {
  /** Default preload hint for native engines. */
  preload?: 'none' | 'metadata' | 'auto';
  /** Ceiling for the number of decoder `canDecode` probes run in parallel. */
  maxConcurrentDecoderProbes?: number;
}

export const NGX_MEDIA_CONFIG = new InjectionToken<NgxMediaConfig>('NGX_MEDIA_CONFIG', {
  providedIn: 'root',
  factory: () => ({ preload: 'metadata', maxConcurrentDecoderProbes: 3 }),
});
