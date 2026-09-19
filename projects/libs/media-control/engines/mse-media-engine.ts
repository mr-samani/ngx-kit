import { signal, Signal } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { hasMediaSource } from '../utils/capabilities';
import { NgxMediaRequestHandler } from '../decoders/decoder.tokens';
import { bindMediaElementEvents } from './media-element-events';

/**
 * Advanced backend for progressive/segmented delivery via MediaSource
 * Extensions. This module is only ever reached through a dynamic `import()`
 * so ordinary file playback never pulls it into the initial bundle.
 *
 * Scope note (unchanged, worth restating): this is a real, working
 * single-SourceBuffer progressive-fetch engine — it is NOT a full
 * adaptive-bitrate/DASH-HLS manifest player, and it does not demux/transmux
 * arbitrary bytes into valid media segments. It assumes the response body
 * is already a sequence of valid segments for the given mime/codecs (e.g. a
 * server that already serves fragmented MP4/WebM appropriate for MSE).
 * Feeding it arbitrary non-segmented bytes will fail at `appendBuffer()`,
 * which surfaces as a `DECODER`-category `NgxMediaError`, not silently.
 *
 * `load()` resolves as soon as the element has enough data to start
 * playback (`loadedmetadata`) rather than waiting for the entire response
 * to be read — the background pump keeps appending segments after `load()`
 * has already resolved, which is the point of "progressive" in the name.
 */
export class MseMediaEngine implements NgxMediaEngine {
  readonly id = 'mse';
  readonly kind: NgxMediaKind;

  private readonly _state = signal<NgxMediaState>(initialMediaState());
  readonly state: Signal<NgxMediaState> = this._state.asReadonly();

  private readonly el: HTMLMediaElement;
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private destroyed = false;
  private readonly cleanupFns: Array<() => void> = [];

  constructor(
    kind: NgxMediaKind,
    private readonly requestHandler: NgxMediaRequestHandler,
    existingElement?: HTMLMediaElement,
  ) {
    if (!hasMediaSource()) {
      throw NgxMediaError.unsupported('MediaSource Extensions are not supported in this browser.');
    }
    this.kind = kind;
    this.el = existingElement ?? (document.createElement(kind) as HTMLMediaElement);
    this.el.setAttribute('playsinline', 'true');
    this.cleanupFns.push(bindMediaElementEvents(this.el, (p) => this.patch(p), () => this._state(), (fn) => fn()));
  }

  get mediaElement(): HTMLMediaElement {
    return this.el;
  }

  async load(source: NgxMediaSource, signal?: AbortSignal): Promise<void> {
    this.patch({ playback: 'loading' });
    this.mediaSource = new MediaSource();
    this.el.src = URL.createObjectURL(this.mediaSource);

    const opened = new Promise<void>((resolve, reject) => {
      this.mediaSource!.addEventListener(
        'sourceopen',
        async () => {
          try {
            if (this.destroyed) return;
            const mime = source.type
              ? source.codecs
                ? `${source.type}; codecs="${source.codecs}"`
                : source.type
              : 'video/mp4';
            if (!MediaSource.isTypeSupported(mime)) {
              throw NgxMediaError.unsupported(`MSE: unsupported mime/codec combination "${mime}".`);
            }
            this.sourceBuffer = this.mediaSource!.addSourceBuffer(mime);
            // Start streaming in the background; resolve `load()` as soon
            // as the element reports it has enough data, not when the
            // whole response has been read (see class doc).
            const streamPromise = this.streamInto(this.sourceBuffer, source, signal);
            streamPromise.catch((err) => {
              if (!this.destroyed) this.patch({ playback: 'error' });
              // Surfaced to whoever's still awaiting `load()` if metadata
              // never arrives; otherwise this is a background failure the
              // caller finds out about via `state().playback === 'error'`.
              metadataOrError.rejectIfPending(err);
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        { once: true },
      );
    });

    const metadataOrError = deferred<void>();
    const onMetadata = () => metadataOrError.resolveIfPending();
    this.el.addEventListener('loadedmetadata', onMetadata, { once: true });

    try {
      await opened;
      await metadataOrError.promise;
      this.patch({ playback: 'ready' });
    } finally {
      this.el.removeEventListener('loadedmetadata', onMetadata);
    }
  }

  private async streamInto(buffer: SourceBuffer, source: NgxMediaSource, signal?: AbortSignal): Promise<void> {
    const response = await this.requestHandler.request(source, signal);
    if (!response.ok) {
      throw new NgxMediaError('NETWORK', `MSE: server responded ${response.status} for the media source.`);
    }
    if (!response.body) {
      throw new NgxMediaError('NETWORK', 'Response has no readable body for MSE streaming.');
    }

    this.reader = response.body.getReader();
    const pump = async (): Promise<void> => {
      if (this.destroyed) return;
      const { done, value } = await this.reader!.read();
      if (this.destroyed) return;
      if (done) {
        if (this.mediaSource?.readyState === 'open') this.mediaSource.endOfStream();
        return;
      }
      await this.appendWhenReady(buffer, value);
      return pump();
    };
    await pump();
  }

  private appendWhenReady(buffer: SourceBuffer, chunk: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.destroyed) {
        resolve();
        return;
      }
      const append = () => {
        if (this.destroyed) {
          resolve();
          return;
        }
        try {
          buffer.appendBuffer(chunk as BufferSource);
        } catch (err) {
          reject(new NgxMediaError('DECODER', 'MSE: appendBuffer() rejected a chunk — the response body is not a sequence of valid media segments for this mime/codecs.', err));
          return;
        }
        const onDone = () => {
          buffer.removeEventListener('updateend', onDone);
          resolve();
        };
        buffer.addEventListener('updateend', onDone, { once: true });
      };
      if (buffer.updating) {
        buffer.addEventListener('updateend', append, { once: true });
      } else {
        append();
      }
    });
  }

  async play(): Promise<void> {
    await this.el.play();
  }
  pause(): void {
    this.el.pause();
  }
  seek(time: number): void {
    this.el.currentTime = time;
  }
  setVolume(volume: number): void {
    this.el.volume = volume;
  }
  setMuted(muted: boolean): void {
    this.el.muted = muted;
  }
  setPlaybackRate(rate: number): void {
    this.el.playbackRate = rate;
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.reader?.cancel().catch(() => {});
    this.reader = null;
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns.length = 0;
    this.el.pause();
    if (this.el.src) URL.revokeObjectURL(this.el.src);
    this.el.removeAttribute('src');
    this.mediaSource = null;
    this.sourceBuffer = null;
    this.patch({ playback: 'destroyed' });
  }

  private patch(partial: Partial<NgxMediaState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}

function deferred<T>(): { promise: Promise<T>; resolveIfPending: (v: T) => void; rejectIfPending: (e: unknown) => void } {
  let settled = false;
  let resolveFn!: (v: T) => void;
  let rejectFn!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolveFn = res;
    rejectFn = rej;
  });
  return {
    promise,
    resolveIfPending: (v) => {
      if (!settled) {
        settled = true;
        resolveFn(v);
      }
    },
    rejectIfPending: (e) => {
      if (!settled) {
        settled = true;
        rejectFn(e);
      }
    },
  };
}
