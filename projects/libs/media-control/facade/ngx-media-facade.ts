import { computed, DestroyRef, inject, Injectable, NgZone, signal } from '@angular/core';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NgxMediaEngine, NgxMediaKind } from '../engines/media-engine.interface';
import { NgxMediaSource, mediaSourcesEqual } from '../contracts/media-source';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';
import { NgxMediaError, NgxMediaErrorCategory } from '../contracts/media-error';
import { NgxMediaSessionBridge } from './media-session';
import { NgxWebAudioGraph } from '../audio/web-audio-graph';
import { isBrowser } from '../utils/capabilities';
import { NgxMediaDecoderRegistry } from '../decoders/decoder-registry';

/** Categories where falling back to a decoder is actually the right call — i.e. the format/codec itself is the problem, not the network or a deliberate cancellation. */
const DECODER_FALLBACK_CATEGORIES: ReadonlySet<NgxMediaErrorCategory> = new Set(['UNSUPPORTED_FORMAT', 'DECODER']);

/**
 * Everything the UI component needs, expressed as signals it can bind to
 * directly, plus imperative commands. This is the only class
 * `NgxMediaControl` talks to — it never touches an engine, a decoder, or the
 * DOM media element itself. Swapping native/MSE/WASM playback never touches
 * the component.
 */
@Injectable()
export class NgxMediaFacade {
  private readonly zone = inject(NgZone);
  private readonly engineFactory = inject(NgxMediaEngineFactory);
  private readonly decoderRegistry = inject(NgxMediaDecoderRegistry);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mediaSession = new NgxMediaSessionBridge();

  private webAudio: NgxWebAudioGraph | null = null;
  private loadAbort: AbortController | null = null;
  private kind: NgxMediaKind = 'audio';
  private preload: 'none' | 'metadata' | 'auto' = 'metadata';
  /**
   * Belt-and-suspenders alongside `AbortController`: not every operation a
   * superseded load might be mid-way through is actually cancellable (a
   * decoder's own internal work, a promise someone else is holding a
   * reference to, ...). Every `loadCurrent()` call captures the generation
   * counter at its start and checks it again before committing any result —
   * a stale generation means "a newer load has already started", full stop,
   * regardless of whether the stale one's `AbortSignal` was actually honored
   * by everything downstream.
   */
  private loadGeneration = 0;

  private readonly _playlist = signal<NgxMediaSource[]>([]);
  private readonly _currentIndex = signal(0);
  /** Holds the live engine instance; swapped whenever a new source loads. */
  private readonly _engine = signal<NgxMediaEngine | null>(null);
  private get engine(): NgxMediaEngine | null {
    return this._engine();
  }
  private readonly _error = signal<NgxMediaError | null>(null);

  readonly playlist = this._playlist.asReadonly();
  readonly currentIndex = this._currentIndex.asReadonly();
  /**
   * Reads through to the current engine's own state signal, so every native
   * media event (timeupdate, progress, ...) that the engine writes flows
   * straight through here with no polling, no manual refresh, and no risk of
   * going stale across an engine swap (native -> WASM fallback, etc.).
   *
   * When there is NO engine (playlist empty, or the engine was torn down
   * after a load failure) but `error()` is set, this reports `playback:
   * 'error'` rather than falling through to `idle` — otherwise `state()` and
   * `error()` would be two sources of truth that can disagree, and anything
   * built on `state().playback === 'error'` would silently miss real errors.
   */
  readonly state = computed<NgxMediaState>(() => {
    const engineState = this._engine()?.state();
    if (engineState) return engineState;
    if (this._error()) return { ...initialMediaState(), playback: 'error' };
    return initialMediaState();
  });
  readonly error = this._error.asReadonly();
  readonly currentSource = computed(() => this._playlist()[this._currentIndex()]);
  readonly mediaElement = computed(() => this._engine()?.mediaElement ?? null);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  /** Deterministic on a kind change: if a source is already active, immediately rebuilds the engine as the new kind (audio <-> video element) instead of leaving a stale-kind engine behind a UI that now expects the other one. */
  configure(kind: NgxMediaKind): void {
    if (this.kind === kind) return;
    this.kind = kind;
    if (this.currentSource()) {
      const wasPlaying = this.state().playback === 'playing';
      void this.loadCurrent(wasPlaying);
    }
  }

  /** Applies to loads started after this call — not retroactive to an element already created. */
  setPreload(preload: 'none' | 'metadata' | 'auto'): void {
    this.preload = preload;
  }

  setPlaylist(sources: NgxMediaSource[], startIndex = 0, autoLoad = true): void {
    // If the content genuinely hasn't changed, do nothing — not even
    // reset `currentIndex` to `startIndex`. A component effect that always
    // passes `startIndex=0` must not be able to yank a user who has
    // manually navigated (next/previous) back to track 0 just because it
    // happened to re-run with an equivalent (but reference-different) array.
    if (mediaSourcesEqual(this._playlist(), sources)) {
      return;
    }

    const clampedIndex = Math.min(Math.max(startIndex, 0), Math.max(sources.length - 1, 0));
    this._playlist.set(sources);
    this._currentIndex.set(clampedIndex);

    if (sources.length === 0) {
      // Nothing left to play — tear down whatever was active instead of
      // leaving stale audio/video playing with no playlist entry backing it.
      this.loadAbort?.abort();
      this.loadGeneration++;
      this.webAudio?.destroy();
      this.webAudio = null;
      this.engine?.destroy();
      this._engine.set(null);
      this._error.set(null);
      return;
    }

    if (autoLoad) void this.loadCurrent();
  }

  async loadCurrent(playAfter = false): Promise<void> {
    const source = this.currentSource();
    if (!source || !isBrowser()) return;

    this.loadAbort?.abort();
    const controller = new AbortController();
    this.loadAbort = controller;
    const generation = ++this.loadGeneration;
    this._error.set(null);

    let newEngine: NgxMediaEngine | null = null;
    try {
      newEngine = await this.resolveEngine(source, controller.signal);

      if (generation !== this.loadGeneration) {
        // Superseded while the new engine was being built (next/previous/
        // another loadCurrent started meanwhile). Never commit it, and
        // never touch the engine that IS current now — that belongs to the
        // newer, still-in-flight or already-committed load.
        newEngine.destroy();
        return;
      }

      // Transactional swap: the OLD engine is only destroyed once the NEW
      // one is confirmed ready. This means a failed next()/previous() never
      // interrupts what was already playing, and the player never sits in a
      // null/blank state just because the next track failed to load.
      const old = this.engine;
      this.webAudio?.destroy();
      this.webAudio = null; // a Web Audio graph attached to the OLD element must never be reused for the new one
      this._engine.set(newEngine);
      old?.destroy();

      this.mediaSession.setMetadata(source);
      this.bindMediaSession();
      if (playAfter) await this.play();
    } catch (err) {
      newEngine?.destroy();
      if (generation !== this.loadGeneration) return; // a newer load owns error/state now; this failure is stale
      const mediaError =
        err instanceof NgxMediaError ? err : new NgxMediaError('UNKNOWN', 'Failed to load media.', err);
      this._error.set(mediaError);
    }
  }

  /** Forces the current track to actually reload from scratch — e.g. a "retry after error" action — bypassing the engine's own idempotent-load skip (which is otherwise correct: selecting the same, already-loaded track should NOT re-fetch it). */
  async reloadCurrent(): Promise<void> {
    this.engine?.destroy();
    this._engine.set(null);
    await this.loadCurrent(true);
  }

  /**
   * Tries the native engine first (the normal fast path). Falls back to the
   * decoder registry ONLY when the failure category indicates the format
   * itself is the problem (`UNSUPPORTED_FORMAT`, `DECODER`) — never for
   * `NETWORK` (404/500/CORS/interrupted), `ABORTED`, or `PERMISSION`, where
   * retrying via a decoder would just repeat the same failing request
   * (or a fresh one to the same broken URL) for no benefit. This matters
   * because `canPlayType()`/extension/mime are only ever a hint and can be
   * wrong (a mislabeled or fake extension), so the decision to fall back
   * has to be made from the real failure, not guessed upfront.
   */
  private async resolveEngine(source: NgxMediaSource, signal: AbortSignal): Promise<NgxMediaEngine> {
    const native = this.engineFactory.create(this.kind, (fn) => this.zone.runOutsideAngular(fn), this.preload);
    try {
      await native.load(source, signal);
      return native;
    } catch (nativeErr) {
      native.destroy();
      if (signal.aborted) throw nativeErr; // deliberate cancellation, not a format failure — don't probe decoders
      if (!this.shouldFallbackToDecoder(nativeErr)) throw nativeErr;

      const decoder = await this.decoderRegistry.findDecoder(source, signal);
      if (!decoder) throw nativeErr;

      // The decoder returns an engine that's already loaded internally
      // (possibly against a transcoded blob, not the original source) — it
      // must NOT have `.load(source)` called on it again afterwards.
      return decoder.createEngine(source, signal);
    }
  }

  private shouldFallbackToDecoder(error: unknown): boolean {
    return error instanceof NgxMediaError && DECODER_FALLBACK_CATEGORIES.has(error.category);
  }

  async play(): Promise<void> {
    if (!this.engine) return;
    try {
      await this.engine.play();
      this.mediaSession.setPlaybackState('playing');
    } catch (err) {
      this._error.set(err instanceof NgxMediaError ? err : new NgxMediaError('UNKNOWN', 'Play failed.', err));
    }
  }

  pause(): void {
    if (!this.engine) return;
    this.engine.pause();
    this.mediaSession.setPlaybackState('paused');
  }

  togglePlayPause(): void {
    if (this.state().playback === 'playing') this.pause();
    else void this.play();
  }

  seek(time: number): void {
    this.engine?.seek(time);
  }

  skip(deltaSeconds: number): void {
    const t = this.state().currentTime + deltaSeconds;
    this.seek(Math.min(Math.max(t, 0), this.state().duration || t));
  }

  setVolume(volume: number): void {
    this.engine?.setVolume(volume);
  }

  setMuted(muted: boolean): void {
    this.engine?.setMuted(muted);
  }

  setPlaybackRate(rate: number): void {
    this.engine?.setPlaybackRate(rate);
  }

  async previous(): Promise<void> {
    const list = this._playlist();
    if (list.length === 0) return;
    const next = (this._currentIndex() - 1 + list.length) % list.length;
    this._currentIndex.set(next);
    await this.loadCurrent(true);
  }

  async next(): Promise<void> {
    const list = this._playlist();
    if (list.length === 0) return;
    const next = (this._currentIndex() + 1) % list.length;
    this._currentIndex.set(next);
    await this.loadCurrent(true);
  }

  async selectIndex(index: number): Promise<void> {
    if (index < 0 || index >= this._playlist().length) return;
    const alreadyOnIt =
      index === this._currentIndex() && (this.state().playback === 'ready' || this.state().playback === 'playing' || this.state().playback === 'paused');
    if (alreadyOnIt) {
      // Same track, already loaded — selecting it again must not trigger a
      // fresh network load. Use `reloadCurrent()` for an explicit restart.
      return;
    }
    this._currentIndex.set(index);
    await this.loadCurrent(true);
  }

  /** Lazily creates the Web Audio graph — never touched unless a consumer asks for it. Always tied to the CURRENT engine's element; invalidated automatically on every engine swap (see `loadCurrent`). */
  getWebAudioGraph(): NgxWebAudioGraph {
    const el = this.mediaElement();
    if (!el) throw new NgxMediaError('MEDIA', 'No active media element to attach a Web Audio graph to.');
    if (!this.webAudio) this.webAudio = new NgxWebAudioGraph(el);
    return this.webAudio;
  }

  private bindMediaSession(): void {
    this.mediaSession.bind({
      play: () => void this.play(),
      pause: () => this.pause(),
      previous: () => void this.previous(),
      next: () => void this.next(),
      seekBackward: (s) => this.skip(-s),
      seekForward: (s) => this.skip(s),
    });
  }

  destroy(): void {
    this.loadAbort?.abort();
    this.loadGeneration++;
    this.mediaSession.unbind();
    this.webAudio?.destroy();
    this.engine?.destroy();
    this._engine.set(null);
  }
}
