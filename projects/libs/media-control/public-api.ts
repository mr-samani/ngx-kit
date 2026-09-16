// New primary component
export * from './components/ngx-media-control';

// Contracts / types
export * from './contracts/media-source';
export * from './contracts/media-state';
export * from './contracts/media-error';

// Engine contracts (public so advanced consumers can implement their own engine/decoder)
export * from './engines/media-engine.interface';
export * from './decoders/decoder.interface';
export * from './decoders/wasm-decoder.base';

// DI: tokens + provider helpers
export * from './decoders/decoder.tokens';
export * from './providers/provide-ngx-media';

// Utilities consumers may find useful directly
export * from './utils/format-time';
export * from './utils/capabilities';
