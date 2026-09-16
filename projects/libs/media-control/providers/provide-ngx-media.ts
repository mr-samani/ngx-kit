import { EnvironmentProviders, makeEnvironmentProviders, Provider, Type } from '@angular/core';
import { NGX_MEDIA_CONFIG, NGX_MEDIA_DECODER, NGX_MEDIA_REQUEST_HANDLER, NgxMediaConfig, NgxMediaRequestHandler } from '../decoders/decoder.tokens';
import { NgxMediaDecoder } from '../decoders/decoder.interface';

/** Root-level setup: `bootstrapApplication(App, { providers: [provideNgxMedia({...})] })`. */
export function provideNgxMedia(config?: Partial<NgxMediaConfig>): EnvironmentProviders {
  const providers: Provider[] = [];
  if (config) {
    providers.push({ provide: NGX_MEDIA_CONFIG, useValue: config });
  }
  return makeEnvironmentProviders(providers);
}

/**
 * Registers a decoder plugin into the `NGX_MEDIA_DECODER` multi-provider
 * token. Accepts a class (instantiated via DI, so it can itself inject
 * services) or a ready-made instance for simple cases.
 *
 *   bootstrapApplication(AppComponent, {
 *     providers: [provideNgxMediaDecoder(My3gpDecoder)],
 *   });
 */
export function provideNgxMediaDecoder(
  decoder: Type<NgxMediaDecoder> | NgxMediaDecoder,
): EnvironmentProviders {
  const provider: Provider =
    typeof decoder === 'function'
      ? { provide: NGX_MEDIA_DECODER, useClass: decoder, multi: true }
      : { provide: NGX_MEDIA_DECODER, useValue: decoder, multi: true };
  return makeEnvironmentProviders([provider]);
}

/** Registers a custom network layer (auth headers, signed URLs, a non-fetch HTTP client, ...). */
export function provideNgxMediaRequestHandler(handler: NgxMediaRequestHandler): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: NGX_MEDIA_REQUEST_HANDLER, useValue: handler }]);
}
