/**
 * Exhaustive playback state machine. Only one state is active at a time;
 * transient conditions (buffering while playing, seeking while paused) are
 * modeled as their own states rather than boolean flags layered on top of
 * `playing`/`paused`, so `playing + destroyed` etc. cannot occur.
 */
export type NgxMediaPlaybackState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'seeking'
  | 'ended'
  | 'error'
  | 'destroyed';

export interface NgxTimeRange {
  start: number;
  end: number;
}

/** Read-only snapshot of engine state, exposed to the UI as a signal. */
export interface NgxMediaState {
  playback: NgxMediaPlaybackState;
  currentTime: number;
  duration: number;
  buffered: readonly NgxTimeRange[];
  volume: number;
  muted: boolean;
  playbackRate: number;
  /** Only meaningful for video engines; undefined for audio-only. */
  videoWidth?: number;
  videoHeight?: number;
}

export function initialMediaState(): NgxMediaState {
  return {
    playback: 'idle',
    currentTime: 0,
    duration: 0,
    buffered: [],
    volume: 1,
    muted: false,
    playbackRate: 1,
  };
}

const VALID_TRANSITIONS: Record<NgxMediaPlaybackState, ReadonlySet<NgxMediaPlaybackState>> = {
  idle: new Set(['loading', 'destroyed']),
  loading: new Set(['ready', 'buffering', 'error', 'destroyed']),
  ready: new Set(['playing', 'seeking', 'loading', 'error', 'destroyed']),
  playing: new Set(['paused', 'buffering', 'seeking', 'ended', 'error', 'destroyed']),
  paused: new Set(['playing', 'seeking', 'loading', 'error', 'destroyed']),
  buffering: new Set(['playing', 'paused', 'error', 'destroyed']),
  seeking: new Set(['playing', 'paused', 'error', 'destroyed']),
  ended: new Set(['loading', 'playing', 'destroyed']),
  error: new Set(['loading', 'idle', 'destroyed']),
  destroyed: new Set([]),
};

/** Guards against illegal transitions (e.g. anything -> playing after destroyed). */
export function canTransition(from: NgxMediaPlaybackState, to: NgxMediaPlaybackState): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from].has(to);
}
