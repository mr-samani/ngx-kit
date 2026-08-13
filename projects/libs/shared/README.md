# ngx-kit/shared

Shared utilities and services that the rest of the `ngx-kit` packages are built on: overlay/dialog management, page-direction (RTL/LTR) detection, browser-preference detection, and a few reusable base components (slider, range slider, color-saturation panel).

You usually won't need this package directly — the other packages depend on it automatically. But if you're building a custom component that should stay consistent with the rest of the library (dark mode, RTL, drag performance), use these same utilities.

## Install

```bash
npm install ngx-kit
```

Import the base styles (which enable dark mode via `color-scheme`) once, app-wide:

```scss
// styles.scss
@import 'ngx-kit/styles/all.css';
```

## Services

### `OverlayService`

The engine behind everything floating in the library (menus, dialogs, the color/gradient/angle picker popups). Renders an Angular component inside a native `<dialog>` (`showModal()`) and positions it relative to an anchor.

```ts
import { OverlayService } from 'ngx-kit/shared';

const overlay = inject(OverlayService);
const viewContainerRef = inject(ViewContainerRef);

const ref = overlay.open({
  component: MyComponent,
  viewContainerRef,
  anchor: buttonElementRef.nativeElement,
  placement: 'bottom', // 'top' | 'bottom' | 'auto'
  alignment: 'start', // 'start' | 'center' | 'end'
  margin: 8,
});

ref.close(); // OverlayRef.close() takes no argument and has no afterClosed; for that (return value, afterClosed) use ngx-kit/dialog, which is built on top of this service
```

What's handled for you automatically:

- **Smart positioning**: if there isn't enough room below the anchor, it flips above (`placement: 'auto'`).
- **Click-outside dismissal**: detected via the backdrop click, not a global `document` listener.
- **Correct stacking**: multiple simultaneous overlays (e.g. a menu with a submenu) work correctly; Escape only closes the last (topmost) overlay.
- **Focus restoration**: after closing, focus returns to whatever had focus before the overlay opened (accessibility).
- **Automatic RTL**: alignment and placement are computed against the page's actual direction (not a fixed assumption).

### `DirectionService`

A signal (`isRtl(): boolean`) that watches the `<html>` element's `dir` attribute with a `MutationObserver` and updates reactively the moment it changes — so if your app switches languages at runtime, everything stays in sync automatically.

```ts
const direction = inject(DirectionService);
direction.isRtl(); // signal<boolean>
```

### `BrowserService`

```ts
const browser = inject(BrowserService);
browser.prefersDarkMode; // boolean — read once at service construction time
```

## Utilities

### `startDragSession(callbacks)`

Replaces the problematic `@HostListener('document:mousemove', ...)` pattern, which keeps a listener attached to `document` for the entire lifetime of the component — even when nothing is being dragged (a real performance issue on pages with many simultaneous instances). This function only adds a listener for the duration of an actual drag and removes it itself; `touchmove` is handled with `{passive: false}`, so dragging on mobile doesn't also scroll the page.

```ts
import { startDragSession } from 'ngx-kit/shared';

let stop: (() => void) | undefined;

function onPointerDown(ev: MouseEvent | TouchEvent) {
  stop?.();
  stop = startDragSession({
    onMove: (ev) => {
      /* update position */
    },
    onEnd: () => {
      stop = undefined;
    },
  });
}
```

> If your component is `OnPush` and uses `startDragSession` (instead of `@HostListener`), make sure to call `ChangeDetectorRef.markForCheck()` inside `onMove`/`onEnd` yourself — unlike `@HostListener`, which automatically marks the view dirty, a manual `addEventListener` does not.

### `getOffsetPosition(event, element)`

Returns the pointer/touch position relative to an element's top-left corner; used to implement drag-based components (sliders, color pickers, etc.).

### `mergeConfig(base, override)`

Deep-merges two config objects (for the `provideXxx({...})` pattern used throughout the library).

## Base components

These can be used directly, but they're mostly designed as building blocks for other components (like `color-picker`, `box-shadow`):

| Component | Selector | Description |
| --- | --- | --- |
| `SliderComponent` | `slider` | Single-value slider, `ControlValueAccessor`, `[min]`/`[max]`/`[step]` |
| `RangeSliderComponent` | `range-slider` | Range slider (two thumbs) |
| `SaturationComponent` | internal (color-picker) | 2D saturation/lightness picker panel |

## Dark mode and RTL

Both rely directly on `ngx-kit/shared`:

- **Dark mode**: uses the native CSS `light-dark()` function. For it to work, `color-scheme: light dark` (or `only light`/`only dark` to force it manually) must be set on `:root` — this happens automatically when you import `ngx-kit/styles/all.css`. To force a theme manually (independent of the OS's `prefers-color-scheme`), set `data-ngx-theme="dark"` or `"light"` on `<html>`/`<body>`.
- **RTL**: enabled via `dir="rtl"` on `<html>`; the whole library uses CSS logical properties (`inset-inline-start`, etc.), so no separate styling is needed.
