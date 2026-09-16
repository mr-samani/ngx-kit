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
import { NgxMediaSource, mediaSourcesEqual } from '../contracts/media-source';
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
  readonly poster = input<string | undefined>(undefined);

  // --- inputs preserved verbatim from NgxAudioControl -------------------
  readonly showList = input<boolean>(true);
  readonly download = input<boolean>(false);
  readonly showFileName = input<boolean>(true);
  readonly showSpeed = input<boolean>(true);
  readonly showVolume = input<boolean>(true);
  readonly linear = input<boolean>(false);
  readonly preload = input<'none' | 'metadata' | 'auto'>('metadata');
  readonly fetchHeaders = input<HeadersInit | undefined>(undefined);

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

  protected readonly state = this.facade.state;
  protected readonly playlist = this.facade.playlist;
  protected readonly currentIndex = this.facade.currentIndex;
  protected readonly currentSource = this.facade.currentSource;
  protected readonly playerError = this.facade.error;

  protected readonly effectiveKind = computed<'audio' | 'video'>(() =>
    this.type() === 'audio' ? 'audio' : 'video',
  );
  protected readonly currentTimeDisplay = computed(() => formatTime(this.state().currentTime));
  protected readonly totalTimeDisplay = computed(() => formatTime(this.state().duration));
  protected readonly speedDisplay = computed(() => `${this.state().playbackRate.toFixed(2)}x`);
  protected readonly fileName = computed(() => this.currentSource()?.title ?? '');
  protected readonly isPlaying = computed(() => this.state().playback === 'playing');
  protected readonly isBuffering = computed(
    () => this.state().playback === 'buffering' || this.state().playback === 'loading',
  );
  protected readonly hasLoadError = computed(() => this.state().playback === 'error');
  protected readonly errorMessage = computed(() => this.playerError()?.message ?? '');
  protected readonly canFullscreen = computed(
    () => this.effectiveKind() === 'video' && hasFullscreen(),
  );
  protected readonly canPip = computed(
    () => this.effectiveKind() === 'video' && hasPictureInPicture(),
  );

  /**
   * Derived from `sources()`, but memoized by CONTENT rather than reference
   * (`equal: mediaSourcesEqual`). Angular's `input()` signal only compares
   * by reference — a parent that binds an inline literal, e.g.
   *
   */
  protected readonly resolvedSources = computed<NgxMediaSource[]>(
    () => {
      const explicit = this.sources() ?? [];
      return explicit.map((m) => ({
        ...m,
        title:
          m.title ??
          (typeof m.src == 'string'
            ? decodeURIComponent(m.src).replace(/\\/g, '/').split(/\//g).pop()
            : null) ??
          'no name',
      }));
    },
    { equal: mediaSourcesEqual },
  );

  constructor() {
    effect(() => this.facade.configure(this.effectiveKind()));

    // Rebuild the playlist whenever the consumer swaps `sources` to genuinely
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
    // element into the template's host div whenever the engine is (re)created.
    effect(() => {
      const el = this.facade.mediaElement();
      const host = this.videoHostRef()?.nativeElement;
      if (!host) return;
      host.replaceChildren();
      if (el && this.effectiveKind() === 'video') {
        el.classList.add('ngx-media-video-element');
        el.setAttribute('playsinline', '');
        if (this.poster()) (el as HTMLVideoElement).poster = this.poster()!;
        el.addEventListener('dblclick', () => void this.toggleFullscreen());
        host.appendChild(el);
      }
    });
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

  seekAudio(ev: Event): void {
    const range = ev.target as HTMLInputElement;
    this.facade.seek(+range.value);
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

  downloadCurrentFile(): void {
    const source = this.currentSource();
    if (!source) return;
    const url = source.downloadUrl ?? (typeof source.src === 'string' ? source.src : undefined);
    if (!url) return;
    this.downloading.set(true);
    const a = this.doc.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = source.downloadFileName ?? source.title ?? '';
    this.doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => this.downloading.set(false), 1000);
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
