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

/**
 * `navigator.mediaSession` is a single global the whole page shares. With
 * more than one `NgxMediaControl` on a page, whichever bound LAST naturally
 * owns it (a reasonable policy — that matches which one the OS media
 * controls should act on). The bug this fixes: without tracking who the
 * current owner actually is, destroying an OLDER player unconditionally
 * cleared every action handler, silently breaking the media session for
 * whichever player is currently active. `currentOwner` makes `unbind()` a
 * no-op unless the instance calling it is still the one that owns it.
 */
let currentOwner: NgxMediaSessionBridge | null = null;

/** No-ops everywhere the API isn't supported; never throws. */
export class NgxMediaSessionBridge {
  private bound = false;

  bind(actions: MediaSessionActions): void {
    if (!hasMediaSession()) return;
    currentOwner = this;
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

  /** No-ops if a different (typically newer) instance currently owns the session — a stale player must never overwrite the active one's metadata. */
  setMetadata(source: NgxMediaSource): void {
    if (!hasMediaSession() || typeof MediaMetadata === 'undefined' || currentOwner !== this) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: source.title ?? '',
      artist: source.artist ?? '',
      album: source.album ?? '',
      artwork: source.poster ? [{ src: source.poster }] : [],
    });
  }

  setPlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (!hasMediaSession() || currentOwner !== this) return;
    navigator.mediaSession.playbackState = state;
  }

  unbind(): void {
    if (!hasMediaSession() || !this.bound) return;
    this.bound = false;
    if (currentOwner !== this) {
      // A newer instance already took over ownership — clearing handlers
      // now would wipe out THEIR session, not ours. Nothing to do.
      return;
    }
    currentOwner = null;
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
