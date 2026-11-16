# ngx-kit

A collection of standalone Angular UI components, directives, and utilities for common interface patterns. The packages share a small set of internal services for overlays, direction handling, and styling, while each feature is available through its own secondary entry point.

The library is intended for Angular applications that want reusable UI building blocks without adopting a full component framework.

## [Demo and package documentation](https://mr-samani.github.io/ngx-kit/)

## Requirements

- Angular **22 or later**.
- RxJS 7.8 or later.
- A modern browser for features that rely on platform APIs such as `ResizeObserver`, `IntersectionObserver`, Canvas, or media playback. Individual components feature-detect optional browser APIs where supported.

The published package declares Angular and RxJS peer dependencies. Install compatible versions of those packages in your application.

## Install

```bash
npm install ngx-kit
```

There is no all-components root barrel. Import each feature from its secondary entry point, and import only the entry points your application uses. For example:

```ts
import { NgxDatepicker } from 'ngx-kit/date-picker';
import { NgxTooltip } from 'ngx-kit/tooltip';
```

Component and directive imports are standalone unless an entry point explicitly documents an NgModule alternative.

## Packages

| Entry point               | What it provides                                                            |
| ------------------------- | --------------------------------------------------------------------------- |
| `ngx-kit/angle-selector`  | Circular angle picker and input directive                                   |
| `ngx-kit/box-shadow`      | Visual CSS box-shadow editor                                                |
| `ngx-kit/color-picker`    | Color picker and input integration                                          |
| `ngx-kit/core`            | Overlay, direction and browser services; shared utilities and base controls |
| `ngx-kit/data-table`      | Safe type data table, sorting, filtering, pagination and column resizing    |
| `ngx-kit/date-picker`     | Calendar, date picker and date-range picker                                 |
| `ngx-kit/dialog`          | Dialog service, component and content directives                            |
| `ngx-kit/drag-resize`     | Drag, drop-list and resize primitives                                       |
| `ngx-kit/dropzone`        | File drop zone and upload integration                                       |
| `ngx-kit/gradient-picker` | Gradient editor and input directive                                         |
| `ngx-kit/grid-layout`     | Draggable and resizable grid layout                                         |
| `ngx-kit/image-editor`    | Canvas-based crop and image adjustment component                            |
| `ngx-kit/image-viewer`    | Image viewer with zoom, pan and toolbar actions                             |
| `ngx-kit/infinite-scroll` | IntersectionObserver-based infinite-scroll directive                        |
| `ngx-kit/lazy-i18n`       | Signal-based translations with lazy route scopes and key extraction         |
| `ngx-kit/media-control`   | Audio/video player with optional decoder extension points                   |
| `ngx-kit/menu`            | Menus and context menus                                                     |
| `ngx-kit/message`         | Alert and confirmation dialogs                                              |
| `ngx-kit/notify`          | Toast notifications                                                         |
| `ngx-kit/side-nav`        | Responsive side navigation                                                  |
| `ngx-kit/time-picker`     | Inline and input-attached time picker                                       |
| `ngx-kit/tooltip`         | Tooltip directive                                                           |
| `ngx-kit/virtual-scroll`  | Signal-based virtual-scroll viewport                                        |

Each entry point has its own README with setup, examples, and the public API relevant to that feature.

## Styles

Import the shared stylesheet once in the application's global stylesheet:

```scss
@import 'ngx-kit/styles/all.css';
```

The package also ships individual CSS files under `ngx-kit/styles/` for cases where you want to include only selected styles. Check the generated stylesheet names in the installed package before relying on a particular file.

The shared styles establish the base color-scheme behavior and provide styles used by overlays and selected components. Component-specific styles are otherwise bundled with their Angular components.

## Theming, dark mode and RTL

Several components use CSS custom properties and native `light-dark()` colors. Set an appropriate `color-scheme` on the application root and use `dir="rtl"` on the document root for right-to-left layouts. Where a component exposes custom properties or configuration, its own README documents them.

Do not assume every component has identical theming options; consult the feature-specific documentation.

## Forms

Components that implement `ControlValueAccessor` can be used with Angular Forms. Import `FormsModule` or `ReactiveFormsModule` in the consuming component as appropriate. Check each feature's API for its value type and validation behavior.

## Browser support and SSR

The library uses browser capabilities such as DOM measurement, pointer events, observers, Canvas, and media elements. Some features are guarded for server rendering, while others only become meaningful after a component is rendered in a browser. Review the relevant package README when using SSR or hydration, and test the exact component in your rendering setup.

## Accessibility

Interactive components should be used with meaningful labels, keyboard access, and appropriate focus management in the surrounding application. A tooltip is not a substitute for an accessible name, and visual state alone should not be the only way to communicate validation or status.

## Lazy i18n key extractor

The `ngx-kit/lazy-i18n` entry point includes the `ngx-lazy-i18n-extract` command. See its README for configuration and usage. The command scans application source files and updates translation JSON files; review the generated changes before committing them.

## Versioning

Use a version of `ngx-kit` compatible with your Angular major version. Angular peer dependencies are declared in the package metadata; npm will report incompatible dependency trees during installation.

## License

MIT. See the package's `LICENSE` file in the published distribution.
