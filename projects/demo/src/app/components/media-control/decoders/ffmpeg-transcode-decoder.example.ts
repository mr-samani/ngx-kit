/**
 * NOT part of the `ngx-kit/media-control` package build — copy this file
 * into YOUR application (e.g. `src/app/decoders/`) after installing:
 *
 *   npm install @ffmpeg/ffmpeg @ffmpeg/util @ffmpeg/core
 *
 * It's kept out of the library's own source tree deliberately, so the
 * library keeps compiling/tree-shaking correctly for every consumer who
 * hasn't installed (and doesn't want) `@ffmpeg/*` — see README §11.
 */
import {
  NgxWasmDecoderBase,
  NgxMediaSource,
  NgxMediaEngine,
  NgxMediaKind,
  NativeMediaEngine,
  NgxMediaError,
} from 'ngx-kit/media-control';

/**
 * Real, working example decoder built on `@ffmpeg/ffmpeg` — the general-
 * purpose answer to "is there an npm package I can install for a WASM
 * decoder?". Install it into your app (not into this library — see §11 of
 * the README for why WASM never ships in the default bundle):
 *
 *   npm install @ffmpeg/ffmpeg @ffmpeg/util @ffmpeg/core
 *
 * Strategy: rather than decoding into a raw `AudioBuffer` (fine for short
 * clips, awkward for video), this transcodes the unsupported source into a
 * format the browser *can* play natively (audio -> `audio/wav`, video ->
 * `video/mp4`) entirely in-memory, then hands the result back as a real
 * `NativeMediaEngine` fed a `Blob`. That reuses all the native engine's
 * event wiring, buffering, seeking, etc. instead of reimplementing
 * playback — the same pattern you'd use for 3GP, WMA, or anything else
 * FFmpeg can read but the browser can't.
 *
 * Register it exactly like any other decoder:
 *
 *   bootstrapApplication(AppComponent, {
 *     providers: [provideNgxMediaDecoder(FfmpegTranscodeDecoder)],
 *   });
 *
 * Notes:
 *  - `@ffmpeg/core` (single-threaded) is used deliberately so this works
 *    without Cross-Origin-Embedder-Policy/Cross-Origin-Opener-Policy
 *    headers. `@ffmpeg/core-mt` is faster but requires serving your app
 *    cross-origin-isolated — swap `loadModule()` to point at it if your
 *    server sends those headers.
 *  - The ~25MB core is only fetched the first time this decoder actually
 *    handles a source (lazy `loadModule()`), never on app boot.
 */
export class FfmpegTranscodeDecoder extends NgxWasmDecoderBase {
  readonly id = 'ffmpeg-transcode';
  readonly formats = ['3gp', '3g2', 'wma', 'amr', 'flv', 'ogg', 'mp3','mp4'] as const as string[];
  override priority = 0;

  private readonly handledExtensions = new Set(this.formats);

  canDecode(source: NgxMediaSource): boolean {
    const ext = extensionOf(source);
    return ext ? this.handledExtensions.has(ext) : false;
  }

  protected async loadModule(): Promise<{ ffmpeg: any }> {
    // Both dynamic imports: neither @ffmpeg/ffmpeg nor @ffmpeg/util enter
    // the bundle unless a source actually needs this decoder.
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util'),
    ]);
    const ffmpeg = new FFmpeg();
 
    await ffmpeg.load({
      coreURL: await toBlobURL(`ffmpeg/core/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`ffmpeg/core/ffmpeg-core.wasm`, 'application/wasm'),
      classWorkerURL: await toBlobURL('ffmpeg/worker.js', 'text/javascript'),
    });
    return { ffmpeg };
  }

  protected async buildEngine(
    source: NgxMediaSource,
    module: unknown,
    _worker: Worker | null,
    signal?: AbortSignal,
  ): Promise<NgxMediaEngine> {
    const { ffmpeg } = module as { ffmpeg: any };
    const { fetchFile } = await import('@ffmpeg/util');

    const inputBlob = await this.readSourceBlob(source, signal);
    const kind: NgxMediaKind =
      this.formats.includes('wma') && looksLikeAudioOnly(source) ? 'audio' : 'video';
    const inputName = `input.${extensionOf(source) ?? 'bin'}`;
    const outputName = kind === 'audio' ? 'output.wav' : 'output.mp4';

    await ffmpeg.writeFile(inputName, await fetchFile(inputBlob));
    if (signal?.aborted) throw new NgxMediaError('ABORTED', 'Transcode cancelled.');

    await ffmpeg.exec(['-i', inputName, outputName]);
    const data: Uint8Array = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer as ArrayBuffer], {
      type: kind === 'audio' ? 'audio/wav' : 'video/mp4',
    });

    // Free the virtual FS entries; the WASM instance itself is reused across loads.
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    const engine = new NativeMediaEngine(kind);
    await engine.load({ src: blob, type: blob.type, title: source.title });
    return engine;
  }

  private async readSourceBytes(source: NgxMediaSource, signal?: AbortSignal): Promise<Uint8Array> {
    if (source.src instanceof Blob) {
      return new Uint8Array(await source.src.arrayBuffer());
    }
    if (typeof source.src === 'string') {
      const res = await fetch(source.src, { signal, headers: source.requestHeaders });
      if (!res.ok)
        throw new NgxMediaError(
          'NETWORK',
          `Failed to fetch source for transcoding (${res.status}).`,
        );
      return new Uint8Array(await res.arrayBuffer());
    }
    throw NgxMediaError.unsupported('FfmpegTranscodeDecoder cannot read a MediaStream source.');
  }

  private async readSourceBlob(source: NgxMediaSource, signal?: AbortSignal): Promise<Blob> {
    if (source.src instanceof Blob) {
      return source.src;
    }
    if (typeof source.src === 'string') {
      const res = await fetch(source.src, { signal, headers: source.requestHeaders });
      if (!res.ok)
        throw new NgxMediaError(
          'NETWORK',
          `Failed to fetch source for transcoding (${res.status}).`,
        );
      return res.blob();
    }
    throw NgxMediaError.unsupported('FfmpegTranscodeDecoder cannot read a MediaStream source.');
  }
}

function extensionOf(source: NgxMediaSource): string | undefined {
  if (typeof source.src !== 'string') return undefined;
  const clean = source.src.split(/[?#]/)[0];
  return clean.split('.').pop()?.toLowerCase();
}

function looksLikeAudioOnly(source: NgxMediaSource): boolean {
  return extensionOf(source) === 'wma' || (source.type?.startsWith('audio/') ?? false);
}
