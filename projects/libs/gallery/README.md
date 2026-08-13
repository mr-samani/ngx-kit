# ngx-kit/gallery

A professional image viewer: takes a list of images, navigates them with ‹ › buttons (like a carousel), has a fully configurable toolbar (zoom, rotate, download, print, fullscreen), zoom via mouse scroll or two-finger pinch, and panning via drag once zoomed in.

## Install

```bash
npm install ngx-kit
```

## Usage — directly in the page

```html
<ngx-image-viewer [images]="images" [toolbar]="{ print: false }" />
```

```ts
images: NgxImageViewerItem[] = [
  { src: '/img/1.jpg', alt: 'Image 1', caption: 'Alborz mountains' },
  { src: '/img/2.jpg', alt: 'Image 2' },
];
```

## Usage — inside a fullscreen dialog

```ts
import { NgxImageViewerService } from 'ngx-kit/gallery';

constructor(private viewer: NgxImageViewerService) {}

openGallery() {
  this.viewer.open(this.images, { startIndex: 0 });
}
```

`NgxImageViewerComponent` doesn't depend on any dialog (it only has a `closed` output) — if you want to put it inside your own dialog (e.g. `ngx-kit/dialog`), use the component directly; the service is just a convenience shortcut.

## API

### `<ngx-image-viewer>`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `NgxImageViewerItem[]` **(required)** | | `{ src, alt?, caption?, downloadFileName? }` |
| `startIndex` | `number` | `0` | |
| `toolbar` | `NgxImageViewerToolbarConfig` | all `true` | Each button can be toggled individually (see below) |
| `minZoom` / `maxZoom` / `zoomStep` | `number` | `1` / `6` / `0.4` | |

| Output | Type | Description |
| --- | --- | --- |
| `indexChange` | `number` | The active image changed |
| `closed` | `void` | The user clicked the close button or pressed Esc (the component itself doesn't close anything; that's left to the consumer) |

### `NgxImageViewerToolbarConfig`

`prevNext`, `counter`, `zoomIn`, `zoomOut`, `resetZoom`, `rotateLeft`, `rotateRight`, `download`, `print`, `fullscreen`, `close` — all `boolean`, all default to `true` except `close` (`false`).

## Interactions

| Gesture | Result |
| --- | --- |
| Mouse scroll | Zoom, relative to the point under the cursor (not the image center) |
| Two-finger pinch (touch) | Zoom |
| Drag with mouse or one finger (when zoomed) | Pan |
| ← / → | Previous/next image |
| + / - | Zoom in/out |
| Esc | Emits `closed` |

## Dark mode and RTL

Supported automatically.
