import { NgxMediaSource } from '../contracts/media-source';

/** True only in a real browser context — guards every browser API access for SSR. */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function hasMediaSource(): boolean {
  return isBrowser() && 'MediaSource' in window;
}

export function hasAudioContext(): boolean {
  return isBrowser() && ('AudioContext' in window || 'webkitAudioContext' in (window as any));
}

export function getAudioContextCtor(): typeof AudioContext | undefined {
  if (!hasAudioContext()) return undefined;
  return (window as any).AudioContext ?? (window as any).webkitAudioContext;
}

export function hasMediaSession(): boolean {
  return isBrowser() && 'mediaSession' in navigator;
}

export function hasPictureInPicture(): boolean {
  return (
    isBrowser() &&
    typeof HTMLVideoElement !== 'undefined' &&
    'requestPictureInPicture' in HTMLVideoElement.prototype &&
    // Safari exposes a document-level flag too; either is sufficient.
    (document as any).pictureInPictureEnabled !== false
  );
}

export function hasFullscreen(): boolean {
  return isBrowser() && (document.fullscreenEnabled || (document as any).webkitFullscreenEnabled);
}

/**
 * Best-effort container/codec detection using `canPlayType`. Never trusts the
 * file extension alone: extension is only a last-resort hint when neither
 * `type` nor `codecs` was supplied.
 */
export function canPlayNatively(
  el: HTMLMediaElement,
  source: NgxMediaSource,
): 'probably' | 'maybe' | '' {
  const mime = resolveMimeType(source);
  if (!mime) return 'maybe'; // unknown — let the native element try; it will fail fast via the `error` event if wrong.
  return el?.canPlayType(mime) as 'probably' | 'maybe' | '';
}

function resolveMimeType(source: NgxMediaSource): string | undefined {
  if (source.type) {
    return source.codecs ? `${source.type}; codecs="${source.codecs}"` : source.type;
  }
  if (typeof source.src === 'string') {
    return extensionToMime(source.src);
  }
  if (source.src instanceof File && source.src.type) {
    return source.src.type;
  }
  if (source.src instanceof Blob && source.src.type) {
    return source.src.type;
  }
  return undefined;
}

const EXT_MIME_MAP: Record<string, string> = {
  mp3: 'audio/mpeg',
  aac: 'audio/aac',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg; codecs=opus',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  weba: 'audio/webm',
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogv: 'video/ogg',
};

/** Extension is only ever a weak fallback hint, never treated as ground truth. */
function extensionToMime(src: string): string | undefined {
  const clean = src.split(/[?#]/)[0];
  const ext = clean.split('.').pop()?.toLowerCase();
  return ext ? EXT_MIME_MAP[ext] : undefined;
}
