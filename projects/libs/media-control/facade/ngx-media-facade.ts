import { computed, DestroyRef, inject, Injectable, NgZone, signal } from '@angular/core';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NgxMediaEngine, NgxMediaKind } from '../engines/media-engine.interface';
import { NgxMediaSource, mediaSourcesEqual } from '../contracts/media-source';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaSessionBridge } from './media-session';
import { NgxWebAudioGraph } from '../audio/web-audio-graph';
import { isBrowser } from '../utils/capabilities';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly mediaSession = new NgxMediaSessionBridge();

  private webAudio: NgxWebAudioGraph | null = null;
  private loadAbort: AbortController | null = null;
  private kind: NgxMediaKind = 'audio';

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
   */
  readonly state = computed<NgxMediaState>(() => this._engine()?.state() ?? initialMediaState());
  readonly error = this._error.asReadonly();
  readonly currentSource = computed(() => this._playlist()[this._currentIndex()]);
  readonly mediaElement = computed(() => this._engine()?.mediaElement ?? null);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  configure(kind: NgxMediaKind): void {
    this.kind = kind;
  }

  setPlaylist(sources: NgxMediaSource[], startIndex = 0, autoLoad = true): void {
    const clampedIndex = Math.min(Math.max(startIndex, 0), Math.max(sources.length - 1, 0));
    // Defense-in-depth against reload loops: if a caller (typically a
    // component effect reacting to an input that got a content-equal but
    // reference-different array) asks for the playlist we already have
    // loaded, do nothing. Reloading identical content would destroy and
    // recreate the engine, re-fetch the media, and fire a fresh batch of
    // state events for zero actual change — exactly what produces the
    // "thousands of repeated requests" symptom if something upstream
    // recomputes an equivalent array on every change-detection tick.
    if (mediaSourcesEqual(this._playlist(), sources) && clampedIndex === this._currentIndex()) {
      return;
    }
    this._playlist.set(sources);
    this._currentIndex.set(clampedIndex);
    if (autoLoad && sources.length > 0) {
      void this.loadCurrent();
    }
  }

  async loadCurrent(playAfter = false): Promise<void> {
    const source = this.currentSource();
    if (!source || !isBrowser()) return;

    this.loadAbort?.abort();
    this.loadAbort = new AbortController();
    this._error.set(null);

    try {
      this.engine?.destroy();
      const newEngine = await this.engineFactory.create(
        this.kind,
        source,
        (fn) => this.zone.runOutsideAngular(fn),
        this.loadAbort.signal,
      );
      await newEngine.load(source, this.loadAbort.signal);
      this._engine.set(newEngine);
      this.mediaSession.setMetadata(source);
      this.bindMediaSession();
      if (playAfter) await this.play();
    } catch (err) {
      const mediaError =
        err instanceof NgxMediaError
          ? err
          : new NgxMediaError('UNKNOWN', 'Failed to load media.', err);
      this._error.set(mediaError);
    }
  }

  async play(): Promise<void> {
    try {
      await this.engine?.play();
      this.mediaSession.setPlaybackState('playing');
    } catch (err) {
      this._error.set(
        err instanceof NgxMediaError ? err : new NgxMediaError('UNKNOWN', 'Play failed.', err),
      );
    }
  }

  pause(): void {
    this.engine?.pause();
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
    debugger;
    const list = this._playlist();
    if (list.length === 0) return;
    const next = (this._currentIndex() + 1) % list.length;
    this._currentIndex.set(next);
    await this.loadCurrent(true);
  }

  async selectIndex(index: number): Promise<void> {
    if (index < 0 || index >= this._playlist().length) return;
    this._currentIndex.set(index);
    await this.loadCurrent(true);
  }

  /** Lazily creates the Web Audio graph — never touched unless a consumer asks for it. */
  getWebAudioGraph(): NgxWebAudioGraph {
    const el = this.mediaElement();
    if (!el)
      throw new NgxMediaError('MEDIA', 'No active media element to attach a Web Audio graph to.');
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
    this.mediaSession.unbind();
    this.webAudio?.destroy();
    this.engine?.destroy();
    this._engine.set(null);
  }
}
