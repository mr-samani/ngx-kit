import { signal, Signal } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { initialMediaState, NgxMediaState, NgxTimeRange } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { canPlayNatively, getAudioContextCtor } from '../utils/capabilities';

/**
 * Default fast-path engine: plays through a real `<audio>`/`<video>` element.
 * Zero WASM, zero MediaSource — the browser's own decode pipeline does the work,
 * which is why this is preferred whenever `canPlayType` says yes.
 *
 * Performance notes:
 *  - `timeupdate`/`progress` fire far more often than the UI needs to re-render;
 *    listeners run via the caller-provided `runOutsideAngular` so they never trigger
 *    zone-based change detection, and writes to the `state` signal are the only
 *    thing that can schedule a render (OnPush + signals coalesce naturally).
 *  - No polling: every field on `NgxMediaState` is driven by a native media event.
 */
export class NativeMediaEngine implements NgxMediaEngine {
  readonly id = 'native';
  readonly kind: NgxMediaKind;

  private readonly _state = signal<NgxMediaState>(initialMediaState());
  readonly state: Signal<NgxMediaState> = this._state.asReadonly();

  private readonly el: HTMLMediaElement;
  private objectUrl: string | null = null;
  private destroyed = false;
  private readonly cleanupFns: Array<() => void> = [];
  /** Tracks which source (by URL) is currently loaded/loading, so a repeated `load()` for the same source is a no-op instead of a fresh network fetch. */
  private loadedSrcKey: string | null = null;

  constructor(
    kind: NgxMediaKind,
    /** Provided by the facade so listener callbacks never re-enter Angular's zone. */
    private readonly runOutsideAngular: <T>(fn: () => T) => T = (fn) => fn(),
    existingElement?: HTMLMediaElement,
  ) {
    this.kind = kind;
    this.el = existingElement ?? (document.createElement(kind) as HTMLMediaElement);
    this.el.preload = 'metadata';
    this.el.setAttribute('playsinline', 'true');
    this.attachListeners();
  }

  get mediaElement(): HTMLMediaElement {
    return this.el;
  }

  async load(source: NgxMediaSource, abort?: AbortSignal): Promise<void> {
    this.assertNotDestroyed();

    // Idempotent load: if this exact source is already loaded (or currently
    // loading) on this element, calling `.load()` again would tell the
    // browser to re-fetch it from scratch — this is exactly what shows up
    // in devtools as the same file being requested many times over. Skip it.
    const key = this.sourceKey(source);
    if (key !== null && key === this.loadedSrcKey && this.el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }
    this.loadedSrcKey = key;

    this.releaseObjectUrl();
    this.patch({ playback: 'loading', currentTime: 0, duration: 0, buffered: [] });

    const resolvedSrc = this.resolveSrc(source);
    const capability = canPlayNatively(this.el, source);
    if (capability === '') {
      throw NgxMediaError.noDecoder(typeof source.src === 'string' ? source.src : '[blob]');
    }

    if (source.src instanceof MediaStream) {
      (this.el as any).srcObject = source.src;
    } else {
      this.el.src = resolvedSrc;
    }
    this.el.load();

    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(NgxMediaError.fromMediaElementError(this.el));
      };
      const onAbort = () => {
        cleanup();
        reject(new NgxMediaError('ABORTED', 'Load aborted.'));
      };
      const cleanup = () => {
        this.el.removeEventListener('loadedmetadata', onReady);
        this.el.removeEventListener('error', onError);
        abort?.removeEventListener('abort', onAbort);
      };
      this.el.addEventListener('loadedmetadata', onReady, { once: true });
      this.el.addEventListener('error', onError, { once: true });
      abort?.addEventListener('abort', onAbort, { once: true });
    });
  }

  async play(): Promise<void> {
    this.assertNotDestroyed();
    try {
      await this.el.play();
    } catch (err) {
      // NotAllowedError is the browser's autoplay-policy rejection.
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        this.patch({ playback: 'paused' });
        throw NgxMediaError.autoplayBlocked(err);
      }
      throw err;
    }
  }

  pause(): void {
    if (this.destroyed) return;
    this.el.pause();
  }

  seek(time: number): void {
    this.assertNotDestroyed();
    const clamped = Math.min(Math.max(time, 0), this.el.duration || time);
    this.patch({ playback: 'seeking' });
    this.el.currentTime = clamped;
  }

  setVolume(volume: number): void {
    this.el.volume = Math.min(Math.max(volume, 0), 1);
  }

  setMuted(muted: boolean): void {
    this.el.muted = muted;
  }

  setPlaybackRate(rate: number): void {
    this.el.playbackRate = Math.max(0.0625, rate);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns.length = 0;
    this.releaseObjectUrl();
    this.loadedSrcKey = null;
    this.el.pause();
    this.el.removeAttribute('src');
    (this.el as any).srcObject = null;
    this.el.load();
    this.patch({ playback: 'destroyed' });
  }

  // --- internals -----------------------------------------------------------

  private resolveSrc(source: NgxMediaSource): string {
    if (typeof source.src === 'string') return source.src;
    if (source.src instanceof Blob) {
      this.objectUrl = URL.createObjectURL(source.src);
      return this.objectUrl;
    }
    return '';
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private patch(partial: Partial<NgxMediaState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }

  private bufferedRanges(): NgxTimeRange[] {
    const ranges: NgxTimeRange[] = [];
    const b = this.el.buffered;
    for (let i = 0; i < b.length; i++) {
      ranges.push({ start: b.start(i), end: b.end(i) });
    }
    return ranges;
  }

  private attachListeners(): void {
    this.runOutsideAngular(() => {
      const on = <K extends keyof HTMLMediaElementEventMap>(
        type: K,
        handler: (ev: HTMLMediaElementEventMap[K]) => void,
      ) => {
        this.el.addEventListener(type, handler as EventListener);
        this.cleanupFns.push(() => this.el.removeEventListener(type, handler as EventListener));
      };

      on('loadedmetadata', () => {
        this.patch({
          duration: Number.isFinite(this.el.duration) ? this.el.duration : 0,
          videoWidth: (this.el as HTMLVideoElement).videoWidth || undefined,
          videoHeight: (this.el as HTMLVideoElement).videoHeight || undefined,
          playback: 'ready',
        });
        // Deliberately NOT auto-probing an unknown duration here anymore —
        // see `probeUnseekableDuration()` below for why that cost extra
        // network requests on every single load. `durationchange` (below)
        // still updates the UI the moment the browser figures the real
        // duration out on its own, with zero extra requests.
      });
      on('waiting', () => this.patch({ playback: 'buffering' }));
      on('playing', () => this.patch({ playback: 'playing' }));
      on('pause', () => {
        if (this._state().playback !== 'ended') this.patch({ playback: 'paused' });
      });
      on('ended', () => this.patch({ playback: 'ended' }));
      on('seeked', () =>
        this.patch({
          playback: this.el.paused ? 'paused' : 'playing',
          currentTime: this.el.currentTime,
        }),
      );
      on('timeupdate', () => this.patch({ currentTime: this.el.currentTime }));
      on('durationchange', () => {
        if (Number.isFinite(this.el.duration)) this.patch({ duration: this.el.duration });
      });
      on('progress', () => this.patch({ buffered: this.bufferedRanges() }));
      on('volumechange', () => this.patch({ volume: this.el.volume, muted: this.el.muted }));
      on('ratechange', () => this.patch({ playbackRate: this.el.playbackRate }));
      on('error', () => this.patch({ playback: 'error' }));
    });
  }

  /**
   * Some servers/streams report `duration === Infinity` until more data
   * arrives. This forces the browser to resolve it immediately by seeking
   * near the end and back — which works, but each call costs 1-2 extra
   * HTTP range requests (this is what was showing up in devtools as the
   * same file being fetched several times per load). No longer called
   * automatically; it's opt-in for the rare case where you genuinely need
   * duration *immediately* rather than letting `durationchange` update it
   * naturally as the file streams in during normal playback.
   */
  async probeUnseekableDuration(): Promise<void> {
    if (this.destroyed) return;
    const original = this.el.currentTime;
    try {
      this.el.currentTime = 1e10;
      await new Promise<void>((resolve) => {
        const onChange = () => {
          this.el.removeEventListener('durationchange', onChange);
          resolve();
        };
        this.el.addEventListener('durationchange', onChange, { once: true });
        setTimeout(resolve, 1500); // don't hang forever on streams that never resolve it
      });
    } finally {
      if (!this.destroyed) this.el.currentTime = original;
    }
  }

  private sourceKey(source: NgxMediaSource): string | null {
    // Only string URLs are cheaply comparable; Blob/File/MediaStream are
    // always treated as a fresh load (correct default — re-checking their
    // content for equality isn't worth the cost, and callers that already
    // hold a stable Blob reference rarely call `load()` again for the same one).
    return typeof source.src === 'string' ? source.src : null;
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new NgxMediaError('ABORTED', `${this.id} engine method called after destroy().`);
    }
  }
}

/** True if an `AudioContext`-based duration probe is even worth attempting (SSR/very old browser guard). */
export function canProbeDuration(): boolean {
  return !!getAudioContextCtor();
}
