import { signal, Signal } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaEngine, NgxMediaKind } from './media-engine.interface';
import { hasMediaSource } from '../utils/capabilities';
import { NgxMediaRequestHandler } from '../decoders/decoder.tokens';

/**
 * Advanced backend for progressive/segmented delivery via MediaSource
 * Extensions. This module is only ever reached through a dynamic `import()`
 * (see `provideNgxMedia`/`MediaEngineFactory`) so ordinary file playback
 * never pulls it into the initial bundle.
 *
 * Scope note: this is a real, working single-SourceBuffer progressive-fetch
 * engine (fetch the whole resource as a stream, append chunks as they
 * arrive) — it is not a full adaptive-bitrate/DASH-HLS manifest player.
 * Wiring an ABR manifest format is a decoder plugin's job, built on top of
 * this engine the same way a WASM decoder builds on the decoder contract.
 */
export class MseMediaEngine implements NgxMediaEngine {
  readonly id = 'mse';
  readonly kind: NgxMediaKind;

  private readonly _state = signal<NgxMediaState>(initialMediaState());
  readonly state: Signal<NgxMediaState> = this._state.asReadonly();

  private readonly el: HTMLMediaElement;
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private destroyed = false;
  private abortController: AbortController | null = null;
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
  }

  get mediaElement(): HTMLMediaElement {
    return this.el;
  }

  async load(source: NgxMediaSource, signal?: AbortSignal): Promise<void> {
    this.patch({ playback: 'loading' });
    this.mediaSource = new MediaSource();
    this.el.src = URL.createObjectURL(this.mediaSource);

    await new Promise<void>((resolve, reject) => {
      this.mediaSource!.addEventListener(
        'sourceopen',
        async () => {
          try {
            const mime = source.type
              ? source.codecs
                ? `${source.type}; codecs="${source.codecs}"`
                : source.type
              : 'video/mp4';
            if (!MediaSource.isTypeSupported(mime)) {
              throw NgxMediaError.unsupported(`MSE: unsupported mime/codec combination "${mime}".`);
            }
            this.sourceBuffer = this.mediaSource!.addSourceBuffer(mime);
            await this.streamInto(this.sourceBuffer, source, signal);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        { once: true },
      );
    });

    this.patch({ playback: 'ready' });
  }

  private async streamInto(
    buffer: SourceBuffer,
    source: NgxMediaSource,
    signal?: AbortSignal,
  ): Promise<void> {
    this.abortController = new AbortController();
    const combined = anySignal([signal, this.abortController.signal]);
    const response = await this.requestHandler.request(source, combined);
    if (!response.body)
      throw new NgxMediaError('NETWORK', 'Response has no readable body for MSE streaming.');

    const reader = response.body.getReader();
    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
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
      const append = () => {
        try {
          buffer.appendBuffer(chunk as BufferSource);
        } catch (err) {
          reject(err);
          return;
        }
        const onDone = () => {
          buffer.removeEventListener('updateend', onDone);
          this.patch({ buffered: this.bufferedRanges(buffer) });
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

  private bufferedRanges(buffer: SourceBuffer) {
    const ranges: { start: number; end: number }[] = [];
    for (let i = 0; i < buffer.buffered.length; i++) {
      ranges.push({ start: buffer.buffered.start(i), end: buffer.buffered.end(i) });
    }
    return ranges;
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
    this.abortController?.abort();
    this.cleanupFns.forEach((fn) => fn());
    this.el.pause();
    if (this.el.src) URL.revokeObjectURL(this.el.src);
    this.el.removeAttribute('src');
    this.patch({ playback: 'destroyed' });
  }

  private patch(partial: Partial<NgxMediaState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}

function anySignal(signals: Array<AbortSignal | undefined>): AbortSignal {
  const controller = new AbortController();
  for (const s of signals) {
    if (!s) continue;
    if (s.aborted) controller.abort();
    s.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return controller.signal;
}
