/**
 * A single playable media item.
 *
 * `src` intentionally accepts the shapes a consumer already has lying around:
 * a remote/relative URL string, a `Blob`/`File` (turned into an object URL
 * internally and revoked on teardown), or a live `MediaStream`.
 */
export interface NgxMediaSource {
  /** Playback source. */
  src: string | Blob | File | MediaStream;
  /** MIME type, e.g. `audio/mpeg`, `video/mp4`. Helps capability detection avoid guessing from the extension. */
  type?: string;
  /** Optional codec string per RFC 6381, e.g. `avc1.42E01E,mp4a.40.2`. */
  codecs?: string;
  /** Display metadata, also used for Media Session integration. */
  title?: string;
  artist?: string;
  album?: string;
  /** Poster image for video. */
  poster?: string;
  /**
   * Separate download target. If omitted, falls back to `src` (only when
   * `src` is a string — Blob/File/MediaStream have no meaningful download URL
   * unless one is provided here).
   */
  downloadUrl?: string;
  /** Suggested file name for the download action. */
  downloadFileName?: string;
  /** Headers to send when the engine has to fetch this source itself (e.g. duration probing, WASM decoding). */
  requestHeaders?: HeadersInit;
}

/** A queue of sources plus the active index. Replaces the old bare `PlayList[]`. */
export interface NgxMediaPlaylist {
  items: NgxMediaSource[];
  currentIndex: number;
}

/**
 * @deprecated Use {@link NgxMediaSource} instead. Kept so existing `PlayList[]`
 * consumers keep compiling; `fileAddress`/`title` map 1:1 onto `src`/`title`.
 */
export class PlayList {
  title!: string;
  fileAddress!: string;
}

export function playListToMediaSource(item: PlayList): NgxMediaSource {
  return { src: item.fileAddress, title: item.title };
}

/**
 * Content equality for `NgxMediaSource`/playlist arrays, not reference
 * equality. `src` strings compare by value; `Blob`/`File`/`MediaStream`
 * compare by identity (they can't be compared by content cheaply/safely).
 *
 * This exists specifically so a consumer that re-creates an equivalent
 * array/object literal on every change-detection cycle (`[sources]="[{...}]"`,
 * or a `.map()` derived from an otherwise-stable list) doesn't cause the
 * player to treat it as "a new playlist" and reload media on every tick —
 * see `computed(..., { equal: mediaSourcesEqual })` in `NgxMediaControl` and
 * the same guard in `NgxMediaFacade.setPlaylist`.
 */
export function mediaSourcesEqual(
  a: readonly NgxMediaSource[],
  b: readonly NgxMediaSource[],
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!mediaSourceEqual(a[i], b[i])) return false;
  }
  return true;
}

function mediaSourceEqual(a: NgxMediaSource, b: NgxMediaSource): boolean {
  if (a === b) return true;
  return (
    srcKey(a.src) === srcKey(b.src) &&
    a.type === b.type &&
    a.codecs === b.codecs &&
    a.title === b.title &&
    a.poster === b.poster
  );
}

function srcKey(src: NgxMediaSource['src']): unknown {
  // Strings compare by value; everything else (Blob/File/MediaStream) only
  // by identity, since there's no cheap/safe way to diff their content.
  return src;
}
