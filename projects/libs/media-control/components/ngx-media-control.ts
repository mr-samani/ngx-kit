import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatTime } from '../utils/format-time';
import { NgxMediaSource, mediaSourcesEqual, extractMediaFileName } from '../contracts/media-source';
import { NgxMediaFacade } from '../facade/ngx-media-facade';
import { hasFullscreen, hasPictureInPicture, isBrowser } from '../utils/capabilities';

export type NgxMediaType = 'audio' | 'video' | 'both';

@Component({
  standalone: true,
  selector: 'ngx-media-control',
  templateUrl: './ngx-media-control.html',
  styleUrls: ['./ngx-media-control.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxMediaFacade],
})
export class NgxMediaControl {
  // --- configuration ---------------------------------------------------
  /**
   * `'audio'` renders an audio-style control surface (no video frame).
   * `'video'` renders a video frame with fullscreen/PiP controls.
   * `'both'` renders the video frame but degrades gracefully to audio-only
   * controls when the active source has no video track.
   */
  readonly type = input<NgxMediaType>('audio');
  /**
   * Poster precedence: this input, when set, ALWAYS wins over a per-source
   * `poster` (useful for a fixed placeholder while sources vary). Leave it
   * unset to let each `NgxMediaSource.poster` take effect per track, and
   * clearing either one correctly clears the poster actually applied (see
   * the mount effect below) instead of leaving a stale image behind.
   */
  readonly poster = input<string | undefined>(undefined);

  // --- inputs preserved verbatim from NgxAudioControl -------------------
  readonly showList = input<boolean>(true);
  readonly download = input<boolean>(false);
  readonly showFileName = input<boolean>(true);
  readonly showSpeed = input<boolean>(true);
  readonly showVolume = input<boolean>(true);
  readonly linear = input<boolean>(false);
  readonly preload = input<'none' | 'metadata' | 'auto'>('metadata');
  /**
   * IMPORTANT, and different from earlier versions of this component: a
   * native `<audio>`/`<video src>` fetch cannot carry arbitrary request
   * headers — that's a browser platform limitation, not something this
   * library can paper over without fetching the whole file into a `Blob`
   * first (which defeats streaming/range-requests for anything but small
   * clips, and was explicitly the wrong default per the library's
   * performance goals). So `fetchHeaders` is applied as the DEFAULT
   * `requestHeaders` for any resolved source that doesn't specify its own
   * (see `resolvedSources` below) — it takes effect for sources that end
   * up on a decoder/MSE backend (which do fetch through
   * `NGX_MEDIA_REQUEST_HANDLER` and can carry headers), and has no effect
   * on plain natively-playable sources, which never go through a fetch at
   * all. Set headers per-source via `NgxMediaSource.requestHeaders`
   * whenever different tracks need different auth.
   */
  readonly fetchHeaders = input<HeadersInit | undefined>(undefined);
  /** Legacy simple form: bare URLs, one per playlist entry. Prefer `sources` for titles/artwork/per-track headers. */
  readonly fileList = input<string[]>();
  /** Preferred over `fileList`: full `NgxMediaSource` objects. */
  readonly sources = input<NgxMediaSource[]>();

  // --- outputs -----------------------------------------------------------
  readonly trackChange = output<NgxMediaSource>();
  readonly error = output<string>();

  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly facade = inject(NgxMediaFacade);

  protected readonly containerRef = viewChild.required<ElementRef<HTMLElement>>('container');
  protected readonly videoHostRef = viewChild<ElementRef<HTMLElement>>('videoHost');

  protected readonly downloading = signal(false);
  protected readonly togglePlayList = signal(false);
  protected readonly isFullscreen = signal(false);

  /** Local seek preview — see the seek-slider handlers below for why the slider never binds `state().currentTime` directly while the user is dragging it. */
  protected readonly isSeeking = signal(false);
  protected readonly seekPreviewTime = signal(0);

  protected readonly state = this.facade.state;
  protected readonly playlist = this.facade.playlist;
  protected readonly currentIndex = this.facade.currentIndex;
  protected readonly currentSource = this.facade.currentSource;
  protected readonly playerError = this.facade.error;

  protected readonly effectiveKind = computed<'audio' | 'video'>(() =>
    this.type() === 'audio' ? 'audio' : 'video',
  );
  protected readonly displaySeekTime = computed(() =>
    this.isSeeking() ? this.seekPreviewTime() : this.state().currentTime,
  );
  protected readonly currentTimeDisplay = computed(() => formatTime(this.displaySeekTime()));
  protected readonly totalTimeDisplay = computed(() => formatTime(this.state().duration));
  protected readonly speedDisplay = computed(() => `${this.state().playbackRate.toFixed(2)}x`);
  protected readonly fileName = computed(() => {
    const source = this.currentSource();
    return source ? extractMediaFileName(source) : '';
  });
  protected readonly isPlaying = computed(() => this.state().playback === 'playing');
  protected readonly isBuffering = computed(
    () => this.state().playback === 'buffering' || this.state().playback === 'loading',
  );
  protected readonly hasLoadError = computed(() => this.state().playback === 'error');
  protected readonly errorMessage = computed(() => this.playerError()?.message ?? '');
  protected readonly canFullscreen = computed(() => this.effectiveKind() === 'video' && hasFullscreen());
  protected readonly canPip = computed(() => this.effectiveKind() === 'video' && hasPictureInPicture());

  /**
   * Derived from `sources()` OR `fileList()` (whichever the consumer used),
   * memoized by CONTENT rather than reference (`equal: mediaSourcesEqual`).
   * Angular's `input()` signal only compares by reference — a parent that
   * binds an inline literal, e.g. `[sources]="[{...}]"`, or otherwise
   * re-derives an equivalent array on every change-detection pass, produces
   * a *new* array every tick. Without the custom `equal`, the effect below
   * would see "a new value" on every tick and reload media in a loop. A
   * content-equal `computed` keeps returning its previous, `===`-stable
   * value whenever the new content is equivalent, so the effect below
   * simply doesn't re-run.
   */
  protected readonly resolvedSources = computed<NgxMediaSource[]>(
    () => {
      const globalHeaders = this.fetchHeaders();
      const explicit = this.sources();
      if (explicit) {
        return explicit.map((m) => ({
          ...m,
          title: extractMediaFileName(m),
          requestHeaders: m.requestHeaders ?? globalHeaders,
        }));
      }
      const simple = this.fileList() ?? [];
      return simple.map((src) => ({
        src,
        title: extractMediaFileName({ src }),
        requestHeaders: globalHeaders,
      }));
    },
    { equal: mediaSourcesEqual },
  );

  /** Tracks what's actually mounted in `videoHostRef`, so the mount effect only touches the DOM (and re-registers listeners) when the element itself changes, not on every unrelated signal read. */
  private mountedElement: HTMLMediaElement | null = null;
  private dblClickHandler: (() => void) | null = null;
  private downloadResetTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => this.facade.configure(this.effectiveKind()));
    effect(() => this.facade.setPreload(this.preload()));

    // Rebuild the playlist whenever the consumer swaps sources to genuinely
    // different content (see `resolvedSources` above for why this doesn't
    // fire on every change-detection tick).
    effect(() => {
      this.facade.setPlaylist(this.resolvedSources(), 0, true);
    });

    effect(() => {
      const err = this.playerError();
      if (err) this.error.emit(err.message);
    });

    effect(() => {
      const source = this.currentSource();
      if (source) this.trackChange.emit(source);
    });

    if (isBrowser()) {
      const onFsChange = () => this.isFullscreen.set(!!this.doc.fullscreenElement);
      this.doc.addEventListener('fullscreenchange', onFsChange);
      this.destroyRef.onDestroy(() => this.doc.removeEventListener('fullscreenchange', onFsChange));
    }

    // The engine owns/creates its own <audio>/<video> element (so the UI
    // never has to know how playback happens). For video mode we mount that
    // element into the template's host div — but ONLY when the element
    // itself actually changed (a new engine was created). Poster updates,
    // or this effect simply re-running for an unrelated reason, must not
    // re-create the dblclick listener or churn the DOM by detaching and
    // reattaching an element that's already correctly mounted.
    effect(() => {
      const el = this.facade.mediaElement();
      const host = this.videoHostRef()?.nativeElement;
      const isVideo = this.effectiveKind() === 'video';
      const effectivePoster = this.poster() ?? this.currentSource()?.poster;

      if (!host || !isVideo || !el) {
        this.detachMountedElement(host);
        return;
      }

      if (el !== this.mountedElement) {
        this.detachMountedElement(host);
        host.replaceChildren();
        el.classList.add('ngx-media-video-element');
        el.setAttribute('playsinline', '');
        this.dblClickHandler = () => void this.toggleFullscreen();
        el.addEventListener('dblclick', this.dblClickHandler);
        host.appendChild(el);
        this.mountedElement = el;
      }

      // Property update only — never re-creates the listener or touches the DOM tree.
      (el as HTMLVideoElement).poster = effectivePoster ?? '';
    });

    this.destroyRef.onDestroy(() => {
      this.detachMountedElement(null);
      if (this.downloadResetTimeout) clearTimeout(this.downloadResetTimeout);
    });
  }

  private detachMountedElement(host: HTMLElement | null | undefined): void {
    if (this.mountedElement && this.dblClickHandler) {
      this.mountedElement.removeEventListener('dblclick', this.dblClickHandler);
    }
    this.mountedElement = null;
    this.dblClickHandler = null;
    host?.replaceChildren();
  }

  // --- transport controls (same method names as the legacy component) ---

  playPause(): void {
    this.facade.togglePlayPause();
  }

  play(): void {
    void this.facade.play();
  }

  stop(): void {
    this.facade.pause();
  }

  muteUnmute(): void {
    this.facade.setMuted(!this.state().muted);
  }

  /**
   * Seek strategy: dragging the slider only updates a local preview
   * (`seekPreviewTime`) — no `facade.seek()` call, so no HTTP range
   * request or media-pipeline seek happens per pixel of drag. The actual
   * seek fires once, on `change` (`onSeekCommit`), which browsers fire
   * both on pointer-release-after-drag AND after each discrete keyboard
   * adjustment — so keyboard accessibility (arrow keys) still seeks
   * immediately per keypress, it's only continuous dragging that's
   * coalesced into a single request.
   */
  onSeekInput(ev: Event): void {
    const value = +(ev.target as HTMLInputElement).value;
    this.isSeeking.set(true);
    this.seekPreviewTime.set(value);
  }

  onSeekCommit(ev: Event): void {
    const value = +(ev.target as HTMLInputElement).value;
    this.isSeeking.set(false);
    this.facade.seek(value);
  }

  skipTrack(seconds: number): void {
    this.facade.skip(seconds);
  }

  increaseSpeed(): void {
    this.facade.setPlaybackRate(Math.max(0.5, this.state().playbackRate + 0.25));
  }

  decreaseSpeed(): void {
    this.facade.setPlaybackRate(Math.max(0.5, this.state().playbackRate - 0.25));
  }

  changeVolume(ev: Event): void {
    this.facade.setVolume(+(ev.target as HTMLInputElement).value);
  }

  previous(): void {
    void this.facade.previous();
  }

  next(): void {
    void this.facade.next();
  }

  onClickPlayList(index: number): void {
    this.togglePlayList.set(false);
    void this.facade.selectIndex(index);
  }

  togglePlaylistPanel(): void {
    this.togglePlayList.update((v) => !v);
  }

  /** Force-reload the current track from scratch (e.g. a "retry" affordance after an error) rather than relying on selecting the same playlist entry, which deliberately does NOT reload an already-loaded track. */
  retryCurrent(): void {
    void this.facade.reloadCurrent();
  }

  downloadCurrentFile(): void {
    const source = this.currentSource();
    if (!source) return;
    const url = source.downloadUrl ?? (typeof source.src === 'string' ? source.src : undefined);
    if (!url) return;

    if (this.downloadResetTimeout) clearTimeout(this.downloadResetTimeout);
    this.downloading.set(true);
    const a = this.doc.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = source.downloadFileName ?? extractMediaFileName(source);
    this.doc.body.appendChild(a);
    a.click();
    a.remove();
    // The `download` attribute gives no completion signal (and for
    // cross-origin URLs, browsers may ignore it and navigate instead — see
    // README "Security limitations"). This timeout only resets the button's
    // busy state; it is not, and cannot be, a real completion check.
    this.downloadResetTimeout = setTimeout(() => {
      this.downloading.set(false);
      this.downloadResetTimeout = null;
    }, 1000);
  }

  // --- video-only capabilities --------------------------------------------

  async toggleFullscreen(): Promise<void> {
    if (!this.canFullscreen()) return;
    const el = this.containerRef().nativeElement;
    try {
      if (this.doc.fullscreenElement) {
        await this.doc.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen can be denied by the browser (e.g. no user gesture); fail silently, UI state stays accurate via the fullscreenchange listener.
    }
  }

  async togglePictureInPicture(): Promise<void> {
    const el = this.facade.mediaElement() as HTMLVideoElement | null;
    if (!el || !this.canPip()) return;
    try {
      if (this.doc.pictureInPictureElement) {
        await (this.doc as any).exitPictureInPicture();
      } else {
        await el.requestPictureInPicture();
      }
    } catch {
      // Not every video/browser combination supports PiP at call time; ignore.
    }
  }
}
