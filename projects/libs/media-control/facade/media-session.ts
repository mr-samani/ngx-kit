import { hasMediaSession } from '../utils/capabilities';
import { NgxMediaSource } from '../contracts/media-source';

export interface MediaSessionActions {
  play(): void;
  pause(): void;
  previous(): void;
  next(): void;
  seekBackward(seconds: number): void;
  seekForward(seconds: number): void;
}

/** No-ops everywhere the API isn't supported; never throws. */
export class NgxMediaSessionBridge {
  private bound = false;

  bind(actions: MediaSessionActions): void {
    if (!hasMediaSession() || this.bound) return;
    this.bound = true;
    const ms = navigator.mediaSession;
    const safe = (fn: () => void) => () => {
      try {
        fn();
      } catch {
        /* a handler throwing must never break media session integration */
      }
    };
    ms.setActionHandler('play', safe(actions.play));
    ms.setActionHandler('pause', safe(actions.pause));
    ms.setActionHandler('previoustrack', safe(actions.previous));
    ms.setActionHandler('nexttrack', safe(actions.next));
    ms.setActionHandler('seekbackward', (details) => actions.seekBackward(details.seekOffset ?? 10));
    ms.setActionHandler('seekforward', (details) => actions.seekForward(details.seekOffset ?? 10));
  }

  setMetadata(source: NgxMediaSource): void {
    if (!hasMediaSession() || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: source.title ?? '',
      artist: source.artist ?? '',
      album: source.album ?? '',
      artwork: source.poster ? [{ src: source.poster }] : [],
    });
  }

  setPlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (!hasMediaSession()) return;
    navigator.mediaSession.playbackState = state;
  }

  unbind(): void {
    if (!hasMediaSession() || !this.bound) return;
    this.bound = false;
    const ms = navigator.mediaSession;
    (['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward'] as const).forEach(
      (action) => {
        try {
          ms.setActionHandler(action, null);
        } catch {
          /* older browsers may not support every action name */
        }
      },
    );
  }
}
