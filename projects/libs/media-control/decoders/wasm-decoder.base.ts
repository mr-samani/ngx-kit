import { NgxMediaDecoder } from './decoder.interface';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine, NgxMediaKind } from '../engines/media-engine.interface';
import { NgxMediaError } from '../contracts/media-error';
import { signal, Signal } from '@angular/core';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';

/**
 * Base class for WASM-backed decoders. It does the two things every such
 * decoder needs regardless of which codec module it wraps:
 *
 *  1. Lazily `import()`s the codec module on first real use, in a Web Worker
 *     when a worker factory is supplied, so the (typically large) WASM binary
 *     never enters the main bundle or the main thread's JS heap unless a
 *     source actually needs it.
 *  2. Provides a cancellable, disposable lifecycle (`AbortSignal`-aware load,
 *     `destroy()` terminates the worker / frees the WASM instance).
 *
 * This class intentionally does NOT ship a real codec — bundling e.g.
 * `@ffmpeg/ffmpeg` here would violate "no WASM in the default bundle" for
 * every consumer, including ones who never touch this file. Concrete
 * decoders (FLAC, WMA, a consumer's own 3GP decoder, ...) extend this and
 * supply `moduleLoader` + `decodeInWorker`.
 */
export abstract class NgxWasmDecoderBase implements NgxMediaDecoder {
  abstract readonly id: string;
  abstract readonly formats: readonly string[];
  priority = 0;

  private worker: Worker | null = null;
  private modulePromise: Promise<unknown> | null = null;

  /** Import path/factory for the codec's WASM glue module. Not evaluated until first `canDecode()`/`createEngine()` call. */
  protected abstract loadModule(): Promise<unknown>;

  /** Optional: return a `Worker` to run decoding off the main thread. Omit for short clips where worker overhead isn't worth it. */
  protected createWorker?(): Worker;

  abstract canDecode(source: NgxMediaSource): boolean | Promise<boolean>;

  /**
   * Subclasses implement the actual decode-to-playable-engine step once the
   * module (and optionally worker) are ready. Typical strategies:
   *  - decode fully into an `AudioBuffer`, play via Web Audio (`AudioBufferSourceNode`)
   *  - decode progressively, feed an MSE `SourceBuffer`
   */
  protected abstract buildEngine(
    source: NgxMediaSource,
    module: unknown,
    worker: Worker | null,
    signal?: AbortSignal,
  ): Promise<NgxMediaEngine>;

  async createEngine(source: NgxMediaSource, signal?: AbortSignal): Promise<NgxMediaEngine> {
    const module = await this.ensureModuleLoaded();
    if (signal?.aborted) throw new NgxMediaError('ABORTED', `${this.id}: decode cancelled before start.`);
    if (this.createWorker && !this.worker) {
      this.worker = this.createWorker();
    }
    try {
      return await this.buildEngine(source, module, this.worker, signal);
    } catch (err) {
      throw new NgxMediaError('DECODER', `${this.id}: failed to build a playable engine.`, err);
    }
  }

  private ensureModuleLoaded(): Promise<unknown> {
    if (!this.modulePromise) {
      this.modulePromise = this.loadModule().catch((err) => {
        this.modulePromise = null; // allow retry on next call rather than caching a permanent failure
        throw new NgxMediaError('DECODER', `${this.id}: WASM module failed to load.`, err);
      });
    }
    return this.modulePromise;
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
    this.modulePromise = null;
  }
}

/**
 * Minimal playable-engine wrapper around a fully-decoded `AudioBuffer`,
 * useful for WASM decoders that decode short clips completely up front
 * rather than streaming. Reuses the browser's own `AudioContext` playback
 * graph instead of a native `<audio>` element, since there's no compressed
 * file for the browser to play directly anymore.
 */
export class DecodedBufferEngine implements NgxMediaEngine {
  readonly id: string;
  readonly kind: NgxMediaKind = 'audio';
  readonly mediaElement = null;

  private readonly _state = signal<NgxMediaState>(initialMediaState());
  readonly state: Signal<NgxMediaState> = this._state.asReadonly();

  private ctx: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private gain: GainNode;
  private startedAt = 0;
  private offset = 0;

  constructor(
    decoderId: string,
    ctx: AudioContext,
    private readonly buffer: AudioBuffer,
  ) {
    this.id = `wasm:${decoderId}`;
    this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.connect(ctx.destination);
    this._state.update((s) => ({ ...s, duration: buffer.duration, playback: 'ready' }));
  }

  async play(): Promise<void> {
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gain);
    this.source.onended = () => this._state.update((s) => ({ ...s, playback: 'ended' }));
    this.source.start(0, this.offset);
    this.startedAt = this.ctx.currentTime - this.offset;
    this._state.update((s) => ({ ...s, playback: 'playing' }));
  }

  pause(): void {
    if (!this.source) return;
    this.offset = this.ctx.currentTime - this.startedAt;
    this.source.stop();
    this.source = null;
    this._state.update((s) => ({ ...s, playback: 'paused' }));
  }

  seek(time: number): void {
    const wasPlaying = this._state().playback === 'playing';
    this.offset = Math.min(Math.max(time, 0), this.buffer.duration);
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    if (wasPlaying) void this.play();
  }

  setVolume(volume: number): void {
    this.gain.gain.value = volume;
  }
  setMuted(muted: boolean): void {
    this.gain.gain.value = muted ? 0 : 1;
  }
  setPlaybackRate(rate: number): void {
    if (this.source) this.source.playbackRate.value = rate;
  }
  async load(): Promise<void> {
    /* buffer is already decoded at construction time */
  }

  destroy(): void {
    this.source?.stop();
    this.source = null;
    this.gain.disconnect();
    this._state.update((s) => ({ ...s, playback: 'destroyed' }));
  }
}
