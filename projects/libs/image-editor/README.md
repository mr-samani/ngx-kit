# ngx-kit/image-editor

An image editor built on raw Canvas: crop with draggable corner handles, rotation (quick 90° and free), brightness/contrast/saturation, built-in filters (grayscale, sepia, invert), a **real cartoon filter** (posterize + Sobel edge detection, hand-implemented since there's no native equivalent), and output compression with adjustable quality.

## Install

```bash
npm install ngx-kit
```

## Usage

```html
<ngx-image-editor [source]="selectedFile" (saved)="onSaved($event)" (cancelled)="onCancelled()" />
```

```ts
onSaved(result: NgxImageEditorResult) {
  // result.blob (for uploading), result.dataUrl (for an instant preview), result.width/height
}
```

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `File \| Blob \| string \| null` **(required)** | | The source file/blob/data URL |
| `aspectRatio` | `number` | free | Lock the crop's aspect ratio (e.g. `1` for a square avatar) |
| `outputMaxWidth` / `outputMaxHeight` | `number` | unlimited | Resize the final output's dimensions |
| `outputType` | `'image/jpeg' \| 'image/png' \| 'image/webp'` | `'image/jpeg'` | |
| `displayMaxWidth` | `number` | `420` | Max display width for the crop area on screen |

| Output | Type | Description |
| --- | --- | --- |
| `saved` | `NgxImageEditorResult` (`{ blob, dataUrl, width, height }`) | |
| `cancelled` | `void` | |

## Internal architecture (why it's fast)

All live interaction (rotating, moving/resizing the crop box, previewing filters including cartoon) happens on a downscaled copy of the image (max 1200px) — only when you call `save()` is the final render done from the full-resolution original. `brightness`/`contrast`/`saturate`/`grayscale`/`sepia`/`invert` are all implemented with Canvas 2D's native `ctx.filter` (browser-accelerated); only the cartoon filter (which has no native equivalent) is done with separate pixel processing.

## Dark mode and RTL

Supported automatically.
