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
/**
 * `NativeMediaEngine` is otherwise an internal implementation detail, but
 * it's exported here for one specific reason: a WASM decoder that
 * transcodes an unsupported format into a natively-playable one (the
 * `@ffmpeg/ffmpeg` pattern — see `decoders/ffmpeg-transcode-decoder.example.ts`)
 * needs a way to hand the result back as a real `NgxMediaEngine`, and
 * wrapping a transcoded `Blob` in the same native `<audio>`/`<video>`
 * element the fast path already uses is simpler and more correct than
 * reimplementing playback. Decoder authors are the intended audience for
 * this export, not component consumers.
 */
export { NativeMediaEngine } from './engines/native-media-engine';

// DI: tokens + provider helpers
export * from './decoders/decoder.tokens';
export * from './providers/provide-ngx-media';

// Utilities consumers may find useful directly
export * from './utils/format-time';
export * from './utils/capabilities';
