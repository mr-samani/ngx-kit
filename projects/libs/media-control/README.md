# ngx-kit/media-control

An Angular-native Audio/Video player: native `<audio>`/`<video>` fast path,
optional MSE and WASM decoder backends, DI-based decoder plugins, signals
throughout, SSR- and zoneless-safe.

> Migrating from `ngx-audio-control`? Nothing breaks — see
> [Migrating from `NgxAudioControl`](#migrating-from-ngxaudiocontrol).

## 1. Installation

```
npm install ngx-kit --save
```

## 2. Basic audio usage

```ts
import { NgxMediaControl } from 'ngx-kit/media-control';

@Component({
  imports: [NgxMediaControl],
  template: `<ngx-media-control type="audio" [fileList]="files" [download]="true" />`,
})
export class PlayerComponent {
  files = ['assets/a.mp3', 'assets/b.mp3'];
}
```

## 3. Basic video usage

```html
<ngx-media-control type="video" [sources]="[{ src: 'assets/clip.mp4', poster: 'assets/poster.jpg' }]" />
```

## 4. Audio + video configuration

`type` is `'audio' | 'video' | 'both'`:

- `'audio'` — no video frame is rendered even if a source has a video track.
- `'video'` — video frame, fullscreen/PiP controls (when the browser supports them).
- `'both'` — video frame is rendered; degrades to audio-style controls when the active source has no video track.

## 5. Playlist

Use `sources` (typed, supports metadata) instead of the legacy `fileList` (plain string URLs) when you need titles/artist/poster/codecs/download URLs:

```ts
sources: NgxMediaSource[] = [
  { src: 'a.mp3', title: 'Track A', artist: 'Someone' },
  { src: 'b.mp3', title: 'Track B' },
];
```

## 6. Controls (inputs)

| Input | Type | Default | Notes |
|---|---|---|---|
| `type` | `'audio' \| 'video' \| 'both'` | `'audio'` | new |
| `poster` | `string` | — | new, video only |
| `showList` | `boolean` | `true` | unchanged |
| `download` | `boolean` | `false` | unchanged |
| `showFileName` | `boolean` | `true` | unchanged |
| `showSpeed` | `boolean` | `true` | unchanged |
| `showVolume` | `boolean` | `true` | unchanged |
| `linear` | `boolean` | `false` | unchanged |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | unchanged |
| `fetchHeaders` | `HeadersInit` | — | unchanged |
| `fileList` | `string[]` | — | unchanged, still works |
| `sources` | `NgxMediaSource[]` | — | new, preferred |

Outputs: `trackChange` (fires with the active `NgxMediaSource`), `error` (fires with a human-readable message; inspect `NgxMediaError.category` if you're subscribing programmatically via the facade in your own wrapper).

## 7. Media sources

```ts
export interface NgxMediaSource {
  src: string | Blob | File | MediaStream;
  type?: string;
  codecs?: string;
  title?: string;
  artist?: string;
  album?: string;
  poster?: string;
  downloadUrl?: string;
  downloadFileName?: string;
  requestHeaders?: HeadersInit;
}
```

Playback source and download source are independent (`downloadUrl`) — the
playback URL is not assumed to be publicly downloadable or vice versa.

## 8. Browser support

Chrome, Edge, Firefox, Safari (desktop + iOS), Android WebView. Every
optional API (`MediaSource`, `AudioContext`, `mediaSession`,
`requestPictureInPicture`, `requestFullscreen`) is feature-detected at the
call site (`utils/capabilities.ts`) before use; the UI hides the
corresponding control when unsupported instead of showing a broken button.

## 9. Native playback

The default `MediaEngineFactory` always tries a native `<audio>`/`<video>`
element first via `HTMLMediaElement.canPlayType()` combined with an explicit
`type`/`codecs` you supply (never trusting the file extension alone — see
`utils/capabilities.ts`). This is the fast path for MP3/AAC/WAV/OGG/Opus/WebM/MP4/etc.
whenever the browser can decode them itself.

## 10. Decoder architecture

```
Source
  │
  ▼
Capability detection (canPlayType + type/codecs)
  │
  ├─ native? ───────────► NativeMediaEngine (<audio>/<video>)
  │
  └─ not native ─► NgxMediaDecoderRegistry.findDecoder()
                      │
                      ├─ found ─► decoder.createEngine() → WASM / MSE / custom engine
                      └─ none  ─► NgxMediaError('UNSUPPORTED_FORMAT')
```

The UI (`NgxMediaControl`) never touches an engine directly — it only calls
`NgxMediaFacade`, which asks `NgxMediaEngineFactory` for an `NgxMediaEngine`.
Swapping the engine implementation never touches the component.

## 11. WASM decoders

`NgxWasmDecoderBase` (in `decoders/wasm-decoder.base.ts`) is the harness: it
lazily `import()`s your codec module (and optionally runs it in a `Worker`)
on first real use, so nothing WASM-related ever enters the default bundle.
**No real codec ships with this library** — bundling e.g. FFmpeg/WASM into
the core would defeat the "lightweight native fast path" requirement for
every consumer, including those who never need it. You extend the base class
with your own `loadModule()`/`buildEngine()`; `DecodedBufferEngine` is
provided as a ready-made `NgxMediaEngine` for decoders that decode a full
clip into an `AudioBuffer` and play it via Web Audio.

## 12. Custom decoder development

```ts
import { NgxMediaDecoder, NgxMediaSource, provideNgxMediaDecoder } from 'ngx-kit/media-control';

@Injectable()
export class My3gpDecoder implements NgxMediaDecoder {
  readonly id = '3gp';
  readonly formats = ['3gp'];
  readonly priority = 0;

  canDecode(source: NgxMediaSource) {
    return source.type === 'video/3gpp';
  }

  async createEngine(source: NgxMediaSource) {
    // return any NgxMediaEngine — e.g. extend NgxWasmDecoderBase, or build
    // one by hand around MSE/Web Audio.
  }

  destroy() {}
}
```

## 13. Angular DI registration

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideNgxMedia(), // optional global config
    provideNgxMediaDecoder(My3gpDecoder),
    // provideNgxMediaRequestHandler({ request: (source, signal) => myFetch(source, signal) }),
  ],
});
```

`provideNgxMediaDecoder` registers into the `NGX_MEDIA_DECODER` multi
token; register as many as you like, `priority` (higher first) breaks ties
when more than one decoder claims the same source.

## 14. Performance

- No polling: every state field is driven by a real media event (`timeupdate`, `progress`, `durationchange`, ...).
- All native listeners are attached inside `NgZone.runOutsideAngular` via the facade; the only thing that can trigger a render is a signal write, which OnPush + signals coalesce naturally — high-frequency events don't cause excess change detection.
- `AudioContext`/Web Audio graph is created lazily, only if a consumer calls into it.
- WASM/MSE code paths are behind dynamic `import()`.

## 15. SSR

Every browser API access is guarded by `isBrowser()`
(`utils/capabilities.ts`). `NgxMediaEngineFactory.create()` throws a typed
`NgxMediaError('BROWSER_UNSUPPORTED', ...)` rather than crashing if somehow
invoked outside a browser context.

## 16. Zoneless Angular

The facade and engines are 100% signal-driven; nothing relies on Zone.js
patches. `NgZone.runOutsideAngular` is used defensively for zone-based apps
but is a no-op wrapper under zoneless change detection.

## 17. Web Audio

Opt-in only, via `facade.getWebAudioGraph()` inside your own extension —
gain/analyser nodes are created lazily on first access. Never bypasses
autoplay policy; `resumeOnUserGesture()` must be called from a real user
gesture handler.

## 18. MSE

`engines/mse-media-engine.ts` is a real, working single-`SourceBuffer`
progressive-fetch engine, reached only via explicit opt-in
(`NgxMediaEngineFactory.createMse()`, typically from inside a decoder). It is
not an ABR/manifest (DASH/HLS) player — that's a decoder plugin's job, built
on top of this engine.

## 19. Media Session

Wired automatically (`facade/media-session.ts`) whenever `navigator.mediaSession`
exists: play/pause/prev/next/seek actions and `title`/`artist`/`album`/`poster`
metadata. No-ops everywhere the API is absent.

## 20. Fullscreen

Shown automatically for `type="video"`/`"both"` when `document.fullscreenEnabled`
is true. Double-clicking the video also toggles fullscreen.

## 21. Picture-in-Picture

Shown automatically when `document.pictureInPictureEnabled` /
`HTMLVideoElement.prototype.requestPictureInPicture` exist.

## 22. Error handling

```ts
export type NgxMediaErrorCategory =
  | 'NETWORK' | 'UNSUPPORTED_FORMAT' | 'DECODER' | 'ABORTED'
  | 'AUTOPLAY_BLOCKED' | 'MEDIA' | 'PERMISSION' | 'BROWSER_UNSUPPORTED' | 'UNKNOWN';
```

`NgxMediaError` carries a `category` and human-readable `message`; the
component's `error` output emits the message, and `NgxMediaError.cause`
keeps the original DOM/browser error for logging without leaking it into the
template.

## 23. Security limitations

Client-side code cannot prevent someone from downloading a file the browser
can already fetch and play. This library does not implement URL obfuscation
and call it security. For genuine protection, use short-lived signed URLs
and/or authenticated requests — `NGX_MEDIA_REQUEST_HANDLER` lets you plug in
your own authenticated fetcher without coupling the core to `HttpClient`.

## 24. Examples

See `demo/media-control/` for a working audio + video showcase, including
the exact custom-decoder registration snippet from §12.

---

## Seeking support on your server


### IIS `web.config`
```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="Accept-Ranges" value="bytes" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

### Apache `.htaccess`
```
<IfModule mod_headers.c>
    Header set Accept-Ranges bytes
</IfModule>
```

### Nginx `nginx.conf`
```
http {
  server {
    location / {
      add_header Accept-Ranges bytes;
    }
  }
}
```

---

## Migrating from `NgxAudioControl`

Nothing is required. `<ngx-audio-control [fileList]="...">` keeps working —
it's now a thin wrapper around `<ngx-media-control type="audio">` with the
exact same inputs/defaults. When you're ready, switch the selector to
`ngx-media-control` and add `type="audio"` to opt into the richer `sources`
input, `trackChange`/`error` outputs, and future decoder support.

