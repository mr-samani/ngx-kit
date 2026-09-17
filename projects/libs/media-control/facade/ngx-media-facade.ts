import { computed, DestroyRef, inject, Injectable, NgZone, signal } from '@angular/core';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';
import { NgxMediaEngine, NgxMediaKind } from '../engines/media-engine.interface';
import { NgxMediaSource, mediaSourcesEqual } from '../contracts/media-source';
import { initialMediaState, NgxMediaState } from '../contracts/media-state';
import { NgxMediaError } from '../contracts/media-error';
import { NgxMediaSessionBridge } from './media-session';
import { NgxWebAudioGraph } from '../audio/web-audio-graph';
import { isBrowser } from '../utils/capabilities';
import { NgxMediaDecoderRegistry } from '../decoders/decoder-registry';

/**
 * Everything the UI component needs, expressed as signals it can bind to
 * directly, plus imperative commands. This is the only class
 * `NgxMediaControl` talks to — it never touches an engine, a decoder, or the
 * DOM media element itself. Swapping native/MSE/WASM playback never touches
 * the component.
 */
@Injectable()
export class NgxMediaFacade {
  private readonly zone = inject(NgZone);
  private readonly engineFactory = inject(NgxMediaEngineFactory);
  private readonly decoderRegistry = inject(NgxMediaDecoderRegistry);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mediaSession = new NgxMediaSessionBridge();

  private webAudio: NgxWebAudioGraph | null = null;
  private loadAbort: AbortController | null = null;
  private kind: NgxMediaKind = 'audio';

  private readonly _playlist = signal<NgxMediaSource[]>([]);
  private readonly _currentIndex = signal(0);
  /** Holds the live engine instance; swapped whenever a new source loads. */
  private readonly _engine = signal<NgxMediaEngine | null>(null);
  private get engine(): NgxMediaEngine | null {
    return this._engine();
  }
  private readonly _error = signal<NgxMediaError | null>(null);

  readonly playlist = this._playlist.asReadonly();
  readonly currentIndex = this._currentIndex.asReadonly();
  /**
   * Reads through to the current engine's own state signal, so every native
   * media event (timeupdate, progress, ...) that the engine writes flows
   * straight through here with no polling, no manual refresh, and no risk of
   * going stale across an engine swap (native -> WASM fallback, etc.).
   */
  readonly state = computed<NgxMediaState>(() => this._engine()?.state() ?? initialMediaState());
  readonly error = this._error.asReadonly();
  readonly currentSource = computed(() => this._playlist()[this._currentIndex()]);
  readonly mediaElement = computed(() => this._engine()?.mediaElement ?? null);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  configure(kind: NgxMediaKind): void {
    this.kind = kind;
  }

  setPlaylist(sources: NgxMediaSource[], startIndex = 0, autoLoad = true): void {
    // اگر محتوای پلی‌لیست واقعاً عوض نشده، کاری نکن — حتی اگر startIndex
    // صفر باشه. قبلاً اینجا currentIndex رو هم چک می‌کردیم که اگه با هم فرق
    // داشتن ریست بشه؛ همون چک باعث می‌شد وقتی effect کامپوننت (که همیشه
    // startIndex=0 صدا می‌زنه) به هر دلیلی دوباره اجرا بشه، مسیرِ ناوبری
    // دستی کاربر (next/previous که فقط _currentIndex رو عوض می‌کنن) دور
    // زده بشه و ایندکس با زور به 0 برگرده — دقیقاً همون رفتار "بعد از next
    // دوباره میره رو آیتم اول". الان: تا وقتی محتوا یکیه، ایندکس دست‌نخورده
    // می‌مونه، فارغ از اینکه startIndex چی خواسته بود.
    if (mediaSourcesEqual(this._playlist(), sources)) {
      return;
    }
    const clampedIndex = Math.min(Math.max(startIndex, 0), Math.max(sources.length - 1, 0));
    this._playlist.set(sources);
    this._currentIndex.set(clampedIndex);
    if (autoLoad && sources.length > 0) {
      void this.loadCurrent();
    }
  }

  async loadCurrent(playAfter = false): Promise<void> {
    const source = this.currentSource();
    if (!source || !isBrowser()) return;

    this.loadAbort?.abort();
    const controller = new AbortController();
    this.loadAbort = controller;
    this._error.set(null);

    try {
      this.engine?.destroy();
      const newEngine = await this.resolveEngine(source, controller.signal);

      // اگه تا این لحظه یه loadCurrent جدیدتر (مثلاً next/previous که کاربر
      // زده) این کنترلر رو abort کرده باشه، این نتیجه دیگه معتبر نیست —
      // نباید جایگزین موتور فعلی (که مال درخواست جدیدتره) بشه.
      if (controller.signal.aborted) {
        newEngine.destroy();
        return;
      }

      this._engine.set(newEngine);
      this.mediaSession.setMetadata(source);
      this.bindMediaSession();
      if (playAfter) await this.play();
    } catch (err) {
      // این تلاش عمداً توسط یه loadCurrent جدیدتر لغو شده (کاربر next/previous
      // زده در حالی که لود قبلی هنوز تموم نشده بود) — این خطا مال یه درخواست
      // منسوخ‌شده‌ست، نباید به‌عنوان خطای واقعی نمایش داده بشه؛ درخواست جدیدتر
      // خودش مسئول ست کردن error/state خودشه.
      if (controller.signal.aborted) return;
      const mediaError =
        err instanceof NgxMediaError
          ? err
          : new NgxMediaError('UNKNOWN', 'Failed to load media.', err);
      this._error.set(mediaError);
    }
  }

  /**
   * مسیر native رو اول امتحان می‌کنه (fast path معمول). اگه واقعاً در حین
   * load() شکست بخوره — نه فقط چون canPlayType/پسوند اولش گفته بود «نه»،
   * بلکه چون واقعاً رد شده — می‌ره سراغ decoder registry. این لازمه چون
   * پسوند/mime فقط یه حدسه و می‌تونه اشتباه/جعلی باشه؛ تنها سیگنال قابل
   * اعتماد، شکست واقعیِ خود load() هست.
   */
  private async resolveEngine(
    source: NgxMediaSource,
    signal: AbortSignal,
  ): Promise<NgxMediaEngine> {
    const native = await this.engineFactory.create(this.kind, source, (fn) =>
      this.zone.runOutsideAngular(fn),
    );
    try {
      await native.load(source, signal);
      return native;
    } catch (nativeErr) {
      native.destroy();
      if (signal.aborted) throw nativeErr; // لغو عمدی بود، نه شکست واقعی فرمت — دنبال دیکودر نگرد

      const decoder = await this.decoderRegistry.findDecoder(source);
      if (!decoder) throw nativeErr;

      // دیکودر یه موتور آماده و از قبل load-شده برمی‌گردونه (مثلاً روی یه
      // blob ترنسکد شده، نه سورس اصلی) — دیگه نباید .load(source) دوباره
      // روش صدا زده بشه.
      return decoder.createEngine(source, signal);
    }
  }

  async play(): Promise<void> {
    try {
      await this.engine?.play();
      this.mediaSession.setPlaybackState('playing');
    } catch (err) {
      this._error.set(
        err instanceof NgxMediaError ? err : new NgxMediaError('UNKNOWN', 'Play failed.', err),
      );
    }
  }

  pause(): void {
    this.engine?.pause();
    this.mediaSession.setPlaybackState('paused');
  }

  togglePlayPause(): void {
    if (this.state().playback === 'playing') this.pause();
    else void this.play();
  }

  seek(time: number): void {
    this.engine?.seek(time);
  }

  skip(deltaSeconds: number): void {
    const t = this.state().currentTime + deltaSeconds;
    this.seek(Math.min(Math.max(t, 0), this.state().duration || t));
  }

  setVolume(volume: number): void {
    this.engine?.setVolume(volume);
  }

  setMuted(muted: boolean): void {
    this.engine?.setMuted(muted);
  }

  setPlaybackRate(rate: number): void {
    this.engine?.setPlaybackRate(rate);
  }

  async previous(): Promise<void> {
    const list = this._playlist();
    if (list.length === 0) return;
    const next = (this._currentIndex() - 1 + list.length) % list.length;
    this._currentIndex.set(next);
    await this.loadCurrent(true);
  }

  async next(): Promise<void> {
    const list = this._playlist();
    if (list.length === 0) return;
    const next = (this._currentIndex() + 1) % list.length;
    this._currentIndex.set(next);
    await this.loadCurrent(true);
  }

  async selectIndex(index: number): Promise<void> {
    if (index < 0 || index >= this._playlist().length) return;
    this._currentIndex.set(index);
    await this.loadCurrent(true);
  }

  /** Lazily creates the Web Audio graph — never touched unless a consumer asks for it. */
  getWebAudioGraph(): NgxWebAudioGraph {
    const el = this.mediaElement();
    if (!el)
      throw new NgxMediaError('MEDIA', 'No active media element to attach a Web Audio graph to.');
    if (!this.webAudio) this.webAudio = new NgxWebAudioGraph(el);
    return this.webAudio;
  }

  private bindMediaSession(): void {
    this.mediaSession.bind({
      play: () => void this.play(),
      pause: () => this.pause(),
      previous: () => void this.previous(),
      next: () => void this.next(),
      seekBackward: (s) => this.skip(-s),
      seekForward: (s) => this.skip(s),
    });
  }

  destroy(): void {
    this.loadAbort?.abort();
    this.mediaSession.unbind();
    this.webAudio?.destroy();
    this.engine?.destroy();
    this._engine.set(null);
  }
}
