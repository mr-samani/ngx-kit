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
 *     `destroy()` terminates the worker / frees the WASM instance) that is
 *     safe under overlap: a `destroy()` that lands while `loadModule()` is
 *     still pending must not let that pending load "resurrect" a module
 *     reference for a decoder instance that's already gone, and must not
 *     let a subsequent `createEngine()` call kick off a SECOND concurrent
 *     module load while the first is still in flight.
 *
 * This class intentionally does NOT ship a real codec — bundling e.g.
 * `@ffmpeg/ffmpeg` here would violate "no WASM in the default bundle" for
 * every consumer, including ones who never touch this file. Concrete
 * decoders (FLAC, WMA, a consumer's own 3GP decoder, ...) extend this and
 * supply `loadModule` + `buildEngine`.
 */
export abstract class NgxWasmDecoderBase implements NgxMediaDecoder {
  abstract readonly id: string;
  abstract readonly formats: readonly string[];
  priority = 0;

  private worker: Worker | null = null;
  private modulePromise: Promise<unknown> | null = null;
  /** Bumped by every `destroy()`; lets an in-flight `loadModule()`/`createEngine()` notice it's talking to a dead instance once it resolves. */
  private generation = 0;

  /** Import path/factory for the codec's WASM glue module. Not evaluated until first `canDecode()`/`createEngine()` call. */
  protected abstract loadModule(): Promise<unknown>;

  /** Optional: return a `Worker` to run decoding off the main thread. Omit for short clips where worker overhead isn't worth it. */
  protected createWorker?(): Worker;

  abstract canDecode(source: NgxMediaSource, signal?: AbortSignal): boolean | Promise<boolean>;

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
    const myGeneration = this.generation;
    const module = await this.ensureModuleLoaded(myGeneration);

    if (signal?.aborted) throw new NgxMediaError('ABORTED', `${this.id}: decode cancelled before start.`);
    if (myGeneration !== this.generation) {
      throw new NgxMediaError('ABORTED', `${this.id}: decoder was destroyed while its module was loading.`);
    }
    if (this.createWorker && !this.worker) {
      this.worker = this.createWorker();
    }
    try {
      return await this.buildEngine(source, module, this.worker, signal);
    } catch (err) {
      // Preserve a category the caller already established (e.g. NETWORK
      // from fetching the source, ABORTED from a cancelled transcode,
      // UNSUPPORTED_FORMAT from a codec check) — only genuinely unknown
      // failures get relabeled as DECODER.
      if (err instanceof NgxMediaError) throw err;
      throw new NgxMediaError('DECODER', `${this.id}: failed to build a playable engine.`, err);
    }
  }

  private ensureModuleLoaded(myGeneration: number): Promise<unknown> {
    if (!this.modulePromise) {
      this.modulePromise = this.loadModule().catch((err) => {
        if (myGeneration === this.generation) this.modulePromise = null; // allow retry on next call rather than caching a permanent failure
        throw new NgxMediaError('DECODER', `${this.id}: WASM module failed to load.`, err);
      });
    }
    // Share the in-flight promise across concurrent createEngine() callers
    // instead of starting a second module load; but re-check generation
    // once it resolves, since `destroy()` may have run while we waited.
    return this.modulePromise.then((mod) => {
      if (myGeneration !== this.generation) {
        throw new NgxMediaError('ABORTED', `${this.id}: destroyed while its WASM module was loading.`);
      }
      return mod;
    });
  }

  destroy(): void {
    this.generation++;
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
 *
 * Playback-position bookkeeping: `offset` is the buffer-time position when
 * the current `AudioBufferSourceNode` was (re)started, `startedAt` is the
 * `AudioContext.currentTime` at that moment, and `rate` is the playback
 * rate in effect since then — so at any instant, position =
 * `offset + (ctx.currentTime - startedAt) * rate`. Every operation that
 * stops or restarts the source (pause, seek, rate change while playing,
 * replay after ended) re-baselines these three fields together so that
 * formula stays correct instead of drifting.
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
  private rate = 1;
  private volume = 1;
  private muted = false;
  private rafId: number | null = null;
  /** Bumped every time a NEW `AudioBufferSourceNode` is created, so a stale `onended` from a node that was `.stop()`-ed (rather than actually finishing) can recognize it's obsolete and not overwrite newer state. */
  private playToken = 0;

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

    if (this._state().playback === 'ended' || this.offset >= this.buffer.duration) {
      // Replaying after the buffer finished naturally (or after seeking
      // exactly to its end) must restart from zero and update the exposed
      // position immediately, before the next animation-frame tick.
      this.offset = 0;
      this._state.update((s) => ({ ...s, currentTime: 0 }));
    }

    const myToken = ++this.playToken;
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.playbackRate.value = this.rate;
    this.source.connect(this.gain);
    this.source.onended = () => {
      if (myToken !== this.playToken) return; // stopped intentionally (pause/seek/rate-change), not a real "ended"
      this.stopTimeTracking();
      this.offset = this.buffer.duration;
      this.source = null;
      this._state.update((s) => ({ ...s, playback: 'ended', currentTime: this.buffer.duration }));
    };
    this.startedAt = this.ctx.currentTime;
    this.source.start(0, this.offset);
    this._state.update((s) => ({ ...s, playback: 'playing' }));
    this.startTimeTracking();
  }

  pause(): void {
    if (!this.source) return;
    this.offset = this.currentPosition();
    this.playToken++; // the upcoming onended (if it fires at all) is now stale
    this.source.stop();
    this.source = null;
    this.stopTimeTracking();
    this._state.update((s) => ({ ...s, playback: 'paused', currentTime: this.offset }));
  }

  seek(time: number): void {
    const wasPlaying = this._state().playback === 'playing';
    this.offset = Math.min(Math.max(time, 0), this.buffer.duration);
    if (this.source) {
      this.playToken++; // stale-onended guard — this stop is intentional, not the buffer actually ending
      this.source.stop();
      this.source = null;
    }
    this._state.update((s) => ({ ...s, currentTime: this.offset, playback: wasPlaying ? s.playback : 'paused' }));
    if (wasPlaying) void this.play();
  }

  setVolume(volume: number): void {
    this.volume = Math.min(Math.max(volume, 0), 1);
    if (!this.muted) this.gain.gain.value = this.volume;
    this._state.update((s) => ({ ...s, volume: this.volume }));
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.gain.gain.value = muted ? 0 : this.volume;
    this._state.update((s) => ({ ...s, muted }));
  }

  setPlaybackRate(rate: number): void {
    if (this.source && this._state().playback === 'playing') {
      // Re-baseline position bookkeeping BEFORE changing rate, or the
      // offset+elapsed*rate formula would retroactively (and incorrectly)
      // apply the new rate to time that already played at the old one.
      this.offset = this.currentPosition();
      this.startedAt = this.ctx.currentTime;
      this.source.playbackRate.value = rate;
    }
    this.rate = rate;
    this._state.update((s) => ({ ...s, playbackRate: rate }));
  }

  async load(): Promise<void> {
    /* buffer is already decoded at construction time */
  }

  destroy(): void {
    this.playToken++;
    this.stopTimeTracking();
    this.source?.stop();
    this.source = null;
    this.gain.disconnect();
    this._state.update((s) => ({ ...s, playback: 'destroyed' }));
  }

  private currentPosition(): number {
    if (!this.source) return this.offset;
    return Math.min(this.offset + (this.ctx.currentTime - this.startedAt) * this.rate, this.buffer.duration);
  }

  /** Drives `currentTime` for the UI while actually playing — never runs during pause/ended/destroyed, so there's no animation loop burning frames when nothing is moving. */
  private startTimeTracking(): void {
    if (this.rafId !== null || typeof requestAnimationFrame === 'undefined') return;
    const tick = () => {
      if (this._state().playback !== 'playing') {
        this.rafId = null;
        return;
      }
      const t = this.currentPosition();
      if (t !== this._state().currentTime) {
        this._state.update((s) => ({ ...s, currentTime: t }));
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopTimeTracking(): void {
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = null;
  }
}
