import { NgxMediaState, NgxTimeRange } from '../contracts/media-state';

function rangesEqual(a: readonly NgxTimeRange[], b: readonly NgxTimeRange[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].start !== b[i].start || a[i].end !== b[i].end) return false;
  }
  return true;
}

function bufferedRanges(el: HTMLMediaElement): NgxTimeRange[] {
  const ranges: NgxTimeRange[] = [];
  const b = el.buffered;
  for (let i = 0; i < b.length; i++) {
    ranges.push({ start: b.start(i), end: b.end(i) });
  }
  return ranges;
}

/**
 * Wires the standard set of `HTMLMediaElement` events into `patch()` the
 * same way for every engine that ultimately plays through a real media
 * element (native, MSE, ...) — extracted so the MSE engine doesn't drift
 * from the native engine's state-reporting behavior (buffering, seeking,
 * volumechange, ratechange, etc. all need to reach the UI the same way
 * regardless of which engine is currently active). Returns a cleanup
 * function that removes every listener it added.
 */
export function bindMediaElementEvents(
  el: HTMLMediaElement,
  patch: (partial: Partial<NgxMediaState>) => void,
  getState: () => NgxMediaState,
  runOutsideAngular: <T>(fn: () => T) => T = (fn) => fn(),
): () => void {
  const cleanupFns: Array<() => void> = [];
  runOutsideAngular(() => {
    const on = <K extends keyof HTMLMediaElementEventMap>(
      type: K,
      handler: (ev: HTMLMediaElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, handler as EventListener);
      cleanupFns.push(() => el.removeEventListener(type, handler as EventListener));
    };

    on('waiting', () => patch({ playback: 'buffering' }));
    on('playing', () => patch({ playback: 'playing' }));
    on('pause', () => {
      if (getState().playback !== 'ended') patch({ playback: 'paused' });
    });
    on('ended', () => patch({ playback: 'ended' }));
    on('seeked', () => patch({ playback: el.paused ? 'paused' : 'playing', currentTime: el.currentTime }));
    on('timeupdate', () => patch({ currentTime: el.currentTime }));
    on('durationchange', () => {
      if (Number.isFinite(el.duration)) patch({ duration: el.duration });
    });
    on('progress', () => {
      const ranges = bufferedRanges(el);
      if (!rangesEqual(ranges, getState().buffered)) patch({ buffered: ranges });
    });
    on('volumechange', () => patch({ volume: el.volume, muted: el.muted }));
    on('ratechange', () => patch({ playbackRate: el.playbackRate }));
  });

  return () => cleanupFns.forEach((fn) => fn());
}
