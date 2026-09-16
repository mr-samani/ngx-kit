export type NgxMediaErrorCategory =
  | 'NETWORK'
  | 'UNSUPPORTED_FORMAT'
  | 'DECODER'
  | 'ABORTED'
  | 'AUTOPLAY_BLOCKED'
  | 'MEDIA'
  | 'PERMISSION'
  | 'BROWSER_UNSUPPORTED'
  | 'UNKNOWN';

export class NgxMediaError extends Error {
  constructor(
    readonly category: NgxMediaErrorCategory,
    message: string,
    /** Original DOM/browser error, if any — kept for `console.error`/telemetry, not surfaced to templates by default. */
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'NgxMediaError';
  }

  static fromMediaElementError(el: HTMLMediaElement): NgxMediaError {
    const err = el.error;
    const noSource = el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
    if (noSource) {
      return new NgxMediaError('NETWORK', 'Could not load media source.', err);
    }
    switch (err?.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        return new NgxMediaError('ABORTED', 'Media playback was aborted.', err);
      case MediaError.MEDIA_ERR_NETWORK:
        return new NgxMediaError('NETWORK', 'A network error interrupted media loading.', err);
      case MediaError.MEDIA_ERR_DECODE:
        return new NgxMediaError('DECODER', 'The media could not be decoded.', err);
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return new NgxMediaError('UNSUPPORTED_FORMAT', 'This media format/source is not supported.', err);
      default:
        return new NgxMediaError('UNKNOWN', 'An unknown media error occurred.', err);
    }
  }

  static autoplayBlocked(cause?: unknown): NgxMediaError {
    return new NgxMediaError(
      'AUTOPLAY_BLOCKED',
      'Playback was blocked by the browser autoplay policy; a user gesture is required.',
      cause,
    );
  }

  static unsupported(message: string): NgxMediaError {
    return new NgxMediaError('BROWSER_UNSUPPORTED', message);
  }

  static noDecoder(source: string): NgxMediaError {
    return new NgxMediaError(
      'UNSUPPORTED_FORMAT',
      `No native support and no registered NGX_MEDIA_DECODER can handle "${source}".`,
    );
  }
}
