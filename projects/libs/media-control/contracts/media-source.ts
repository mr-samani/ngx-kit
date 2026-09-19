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
 * Every field that can change *downstream behavior* is compared —
 * `artist`/`album`/`poster` feed Media Session metadata, `downloadUrl`/
 * `downloadFileName` change what the download button actually does, and
 * `requestHeaders` changes what bytes a server returns for the same URL.
 * Fields that are purely cosmetic and never drive a decision (there
 * currently are none — if you add one, document why it's excluded here).
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
    a.src === b.src && // strings compare by value; Blob/File/MediaStream by identity — both correct via `===`
    a.type === b.type &&
    a.codecs === b.codecs &&
    a.title === b.title &&
    a.artist === b.artist &&
    a.album === b.album &&
    a.poster === b.poster &&
    a.downloadUrl === b.downloadUrl &&
    a.downloadFileName === b.downloadFileName &&
    headersEqual(a.requestHeaders, b.requestHeaders)
  );
}

function headersEqual(a?: HeadersInit, b?: HeadersInit): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const na = normalizeHeaders(a);
  const nb = normalizeHeaders(b);
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) {
    if (na[i][0] !== nb[i][0] || na[i][1] !== nb[i][1]) return false;
  }
  return true;
}

function normalizeHeaders(h: HeadersInit): [string, string][] {
  const entries: [string, string][] =
    h instanceof Headers ? Array.from(h.entries()) : Array.isArray(h) ? (h as [string, string][]) : Object.entries(h as Record<string, string>);
  return entries.map(([k, v]) => [k.toLowerCase(), v] as [string, string]).sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0));
}

/**
 * Derives a display file name from a source, tolerating everything a real
 * URL can throw at `decodeURIComponent` (malformed `%` sequences, stray
 * `#`/`?`) instead of letting the player crash just because it tried to
 * make a pretty label. Never throws.
 */
export function extractMediaFileName(source: Pick<NgxMediaSource, 'src' | 'title'>): string {
  if (source.title) return source.title;
  if (typeof source.src !== 'string') {
    if (source.src instanceof File && source.src.name) return source.src.name;
    return 'no name';
  }
  try {
    const withoutHash = source.src.split('#')[0];
    const withoutQuery = withoutHash.split('?')[0];
    const lastSegment = withoutQuery.replace(/\\/g, '/').split('/').filter(Boolean).pop();
    if (!lastSegment) return 'no name';
    try {
      return decodeURIComponent(lastSegment);
    } catch {
      // Malformed percent-encoding (e.g. a lone "%" or "%zz") — fall back to
      // the raw, un-decoded segment rather than throwing.
      return lastSegment;
    }
  } catch {
    return 'no name';
  }
}
