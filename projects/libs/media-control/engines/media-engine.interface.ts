import { Signal } from '@angular/core';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaState } from '../contracts/media-state';

export type NgxMediaKind = 'audio' | 'video';

/**
 * Stable contract the UI/facade programs against. The UI never knows whether
 * playback is happening through a native `<audio>`/`<video>` element, MSE, or
 * a WASM decoder writing into an AudioBuffer — it only sees this interface.
 */
export interface NgxMediaEngine {
  readonly id: string;
  readonly kind: NgxMediaKind;

  /** Reactive, read-only state snapshot. Engines update this via an internal writable signal. */
  readonly state: Signal<NgxMediaState>;

  /**
   * The element the UI should attach to the DOM (for video: for sizing/fullscreen/PiP;
   * for audio: usually detached, kept alive only to drive playback).
   * Null for engines that don't render through a media element (rare; e.g. a pure
   * Web-Audio-buffer engine).
   */
  readonly mediaElement: HTMLMediaElement | null;

  load(source: NgxMediaSource, signal?: AbortSignal): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(time: number): Promise<void> | void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  setPlaybackRate(rate: number): void;
  destroy(): void;
}

/** Given a source, can this engine play it without further help? Cheap, synchronous-preferred check. */
export interface NgxEngineCapability {
  canPlay(source: NgxMediaSource): 'probably' | 'maybe' | '';
}
