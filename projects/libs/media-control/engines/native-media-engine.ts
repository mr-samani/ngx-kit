import { signal, Signal } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { initialMediaState, NgxMediaState, NgxTimeRange } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { canPlayNatively, getAudioContextCtor } from '../utils/capabilities';

type NativeLoadState = 'idle' | 'loading' | 'ready';

/**
 * Source identity, not just a URL string: two loads with the same URL but
 * different `requestHeaders` MUST be treated as different sources (the
 * bytes the server returns can differ), while two loads with a fresh but
 * distinct `Blob`/`File`/`MediaStream` are only "the same" if it's the
 * literal same object reference — there's no cheap, safe way to diff their
 * content.
 */
type SourceIdentity =
  { kind: 'url'; key: string } | { kind: 'ref'; ref: Blob | File | MediaStream };

function headersKey(headers?: HeadersInit): string {
  if (!headers) return '';
  const entries: [string, string][] =
    headers instanceof Headers
      ? Array.from(headers.entries())
      : Array.isArray(headers)
        ? (headers as [string, string][])
        : Object.entries(headers as Record<string, string>);
  return entries
    .map(([k, v]) => `${k.toLowerCase()}=${v}`)
    .sort()
    .join('&');
}

function computeIdentity(source: NgxMediaSource): SourceIdentity {
  if (typeof source.src === 'string') {
    return { kind: 'url', key: `${source.src}::${headersKey(source.requestHeaders)}` };
  }
  return { kind: 'ref', ref: source.src };
}

function sameIdentity(a: SourceIdentity | null, b: SourceIdentity | null): boolean {
  if (!a || !b || a.kind !== b.kind) return false;
  return a.kind === 'url'
    ? a.key === (b as { key: string }).key
    : a.ref === (b as { ref: unknown }).ref;
}

function rangesEqual(a: readonly NgxTimeRange[], b: readonly NgxTimeRange[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].start !== b[i].start || a[i].end !== b[i].end) return false;
  }
  return true;
}

/**
 * Default fast-path engine: plays through a real `<audio>`/`<video>` element.
 * Zero WASM, zero MediaSource — the browser's own decode pipeline does the work.
 *
 * Load semantics (the part that matters most for network behavior):
 *  - `load()` is a real 3-state machine (idle/loading/ready) keyed on
 *    {@link SourceIdentity}, not just a `readyState` snapshot:
 *      same source + currently loading  -> returns the SAME in-flight promise
 *      same source + already loaded     -> resolves immediately, no `el.load()` call
 *      different source                 -> proceeds; the browser's own load
 *                                           algorithm aborts whatever the
 *                                           element was doing before
 *  - Setting `el.src` already queues the browser's media load algorithm;
 *    the immediate `el.load()` call right after does not cause a second
 *    network request — its purpose is to make the abort-then-restart
 *    synchronous (needed for older WebKit), not to "load twice". The state
 *    machine above is what actually prevents redundant fetches across
 *    repeated `load()` calls for the same source.
 *
 * Performance notes:
 *  - `timeupdate`/`progress`/etc. fire far more often than the UI needs to
 *    re-render; listeners run via `runOutsideAngular`, and `patch()` skips
 *    the signal write entirely when nothing actually changed (including a
 *    content-equal `buffered` array, which would otherwise allocate and
 *    write on every `progress` tick even when the ranges didn't move).
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

  private loadState: NativeLoadState = 'idle';
  private loadedIdentity: SourceIdentity | null = null;
  private pendingLoad: Promise<void> | null = null;

  constructor(
    kind: NgxMediaKind,
    /** Provided by the facade so listener callbacks never re-enter Angular's zone. */
    private readonly runOutsideAngular: <T>(fn: () => T) => T = (fn) => fn(),
    existingElement?: HTMLMediaElement,
    preload: 'none' | 'metadata' | 'auto' = 'metadata',
  ) {
    this.kind = kind;
    this.el = existingElement ?? (document.createElement(kind) as HTMLMediaElement);
    this.el.preload = preload;
    this.el.setAttribute('playsinline', 'true');
    this.attachListeners();
  }

  get mediaElement(): HTMLMediaElement {
    return this.el;
  }

  load(source: NgxMediaSource, abort?: AbortSignal): Promise<void> {
    this.assertNotDestroyed();
    const identity = computeIdentity(source);

    if (sameIdentity(identity, this.loadedIdentity)) {
      if (this.loadState === 'loading' && this.pendingLoad) {
        // Same source, still in flight — hand back the SAME promise instead
        // of starting a second (redundant) load for something already underway.
        return this.pendingLoad;
      }
      if (this.loadState === 'ready') {
        // Same source, already fully loaded — nothing to do, no `el.load()` call.
        return Promise.resolve();
      }
    }

    const promise: Promise<void> = this.performLoad(source, identity, abort).finally(() => {
      if (this.pendingLoad === promise) this.pendingLoad = null;
    });
    this.pendingLoad = promise;
    return promise;
  }

  private async performLoad(
    source: NgxMediaSource,
    identity: SourceIdentity,
    abort?: AbortSignal,
  ): Promise<void> {
    this.loadedIdentity = identity;
    this.loadState = 'loading';
    this.releaseObjectUrl();
    this.patch({ playback: 'loading', currentTime: 0, duration: 0, buffered: [] });

    try {
      const capability = canPlayNatively(this.el, source);
      if (capability === '') {
        throw NgxMediaError.noDecoder(typeof source.src === 'string' ? source.src : '[blob]');
      }

      const resolvedSrc = this.resolveSrc(source);
      if (source.src instanceof MediaStream) {
        (this.el as any).srcObject = source.src;
      } else {
        this.el.src = resolvedSrc;
      }
      // See class doc: this does not cause a second network request for a
      // genuinely new source — it makes the load-algorithm restart
      // synchronous rather than triggering a second one.
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

      this.loadState = 'ready';
    } catch (err) {
      this.loadState = 'idle';
      this.loadedIdentity = null;
      throw err;
    }
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
    this.loadState = 'idle';
    this.loadedIdentity = null;
    this.pendingLoad = null;
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

  /** Skips the signal write entirely when every field in `partial` is already equal to current state. */
  private patch(partial: Partial<NgxMediaState>): void {
    this._state.update((s) => {
      let changed = false;
      for (const k in partial) {
        if ((partial as Record<string, unknown>)[k] !== (s as any)[k]) {
          changed = true;
          break;
        }
      }
      return changed ? { ...s, ...partial } : s;
    });
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
        // Deliberately NOT auto-probing an unknown duration here — see
        // `probeUnseekableDuration()` below for why that cost extra network
        // requests on every load. `durationchange` still updates the UI the
        // moment the browser resolves it on its own, at zero extra cost.
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
      on('progress', () => {
        const ranges = this.bufferedRanges();
        // `bufferedRanges()` always allocates a new array; only write the
        // signal (and thus schedule a render) if the ranges actually moved.
        if (!rangesEqual(ranges, this._state().buffered)) {
          this.patch({ buffered: ranges });
        }
      });
      on('volumechange', () => this.patch({ volume: this.el.volume, muted: this.el.muted }));
      on('ratechange', () => this.patch({ playbackRate: this.el.playbackRate }));
      on('error', () => this.patch({ playback: 'error' }));
    });
  }

  /**
   * Some servers/streams report `duration === Infinity` until more data
   * arrives. This forces the browser to resolve it immediately by seeking
   * near the end and back — which works, but each call costs 1-2 extra
   * HTTP range requests. No longer called automatically; opt-in for the
   * rare case where you genuinely need duration *immediately* rather than
   * letting `durationchange` update it naturally during normal playback.
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
