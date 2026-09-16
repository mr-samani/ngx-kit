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
        if (!Number.isFinite(this.el.duration)) {
          void this.probeUnseekableDuration();
        }
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
   * arrives. Rather than eagerly fetching + fully decoding the file through
   * `AudioContext.decodeAudioData` (expensive, one-shot AudioContext per
   * call — what the previous implementation did), we seek to a huge time
   * once; browsers that don't know the real duration yet will clamp and fire
   * another `durationchange` with the correct value. This costs a single
   * seek, no network re-fetch, no extra AudioContext.
   */
  private async probeUnseekableDuration(): Promise<void> {
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

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new NgxMediaError('DESTROYED', 'Media engine has already been destroyed.');
    }
  }
}

/** True if an `AudioContext`-based duration probe is even worth attempting (SSR/very old browser guard). */
export function canProbeDuration(): boolean {
  return !!getAudioContextCtor();
}
