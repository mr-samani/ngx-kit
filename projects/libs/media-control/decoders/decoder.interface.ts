import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine } from '../engines/media-engine.interface';

/**
 * A decoder plugin doesn't decode into a static buffer and hand it back —
 * real media needs streaming, seeking and duration discovery, so a decoder's
 * job is to produce a fully-formed {@link NgxMediaEngine} that the facade can
 * drive identically to the native engine. This keeps the abstraction usable
 * for both "decode once into an AudioBuffer" (short clips) and "feed a
 * MediaSource/SourceBuffer progressively" (long/streamed media) strategies,
 * which a flat `decode() -> ArrayBuffer` contract cannot support.
 */
export interface NgxMediaDecoder {
  /** Unique id, used for logging/priority/debugging. */
  readonly id: string;
  /** Formats this decoder claims, informational (used by the registry for a fast pre-filter). */
  readonly formats: readonly string[];
  /**
   * Higher runs first when multiple decoders claim the same source.
   * Default treated as 0 by the registry.
   */
  readonly priority?: number;

  /** Cheap capability check; may be async if it needs to sniff bytes. */
  canDecode(source: NgxMediaSource): boolean | Promise<boolean>;

  /**
   * Build a ready-to-use engine for this source. `signal` allows the caller
   * to cancel an in-flight WASM module load / stream open.
   */
  createEngine(source: NgxMediaSource, signal?: AbortSignal): Promise<NgxMediaEngine>;

  /** Release any module-level resources (worker pools, cached WASM instances) held by this decoder itself. */
  destroy(): void;
}
