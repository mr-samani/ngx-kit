import type { NgxMediaSource } from '../contracts/media-source';

export function mediaSourcesEqual(a: NgxMediaSource[], b: NgxMediaSource[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];

    if (
      x.src !== y.src ||
      x.type !== y.type ||
      x.codecs !== y.codecs ||
      x.title !== y.title ||
      x.artist !== y.artist ||
      x.album !== y.album ||
      x.poster !== y.poster ||
      x.downloadUrl !== y.downloadUrl
    ) {
      return false;
    }
  }

  return true;
}
