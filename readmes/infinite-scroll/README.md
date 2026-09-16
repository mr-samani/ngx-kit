# ngx-kit Infinite Scroll

A performance-first infinite-scroll directive for Angular, designed as a small reusable primitive for `ngx-kit`.

It uses the browser's `IntersectionObserver` instead of a continuous `scroll` listener, stays outside Angular's zone until an actual boundary trigger occurs, and supports normal lists, browser-window scrolling, custom roots, reverse chat feeds, and bidirectional feeds.

## Features

- `IntersectionObserver` based; no continuous scroll polling.
- No RxJS dependency in the directive itself.
- Standalone Angular directive with signal-based inputs and outputs.
- Window, host element, external element, or selector-based scroll roots.
- Runtime root/configuration changes.
- `down`, `up`, and `both` directions.
- Prefetch distance in pixels.
- Immediate check for under-filled lists.
- Minimum trigger interval.
- Disabled state that automatically rearms the observer.
- Reverse/prepend support with automatic scroll-position preservation.
- `ResizeObserver` + `MutationObserver` assist slow and dynamic layout changes.
- Explicit `check()` and `completePrepend()` escape hatches.
- SSR-safe: browser-only APIs are guarded.
- `scrollStartReached` and `scrollEndReached` convenience outputs.
- Tiny API surface and zero third-party runtime dependencies.

## Installation

From an existing Angular 22 application:

```bash
npm install @ngx-kit/infinite-scroll
```

Then import the standalone directive where it is needed:

```ts
import { NgxInfiniteScroll } from '@ngx-kit/infinite-scroll';

@Component({
  standalone: true,
  imports: [NgxInfiniteScroll],
  // ...
})
export class MyComponent {}
```

## Basic usage

```html
<div
  class="list"
  infiniteScroll
  [scrollWindow]="false"
  [infiniteScrollDistance]="300"
  [infiniteScrollDisabled]="loading() || endOfList()"
  (scrolled)="loadMore()">
  @for (item of items(); track item.id) {
  <article>{{ item.title }}</article>
  }
</div>
```

The host itself is the scroll container when `scrollWindow` is `false` and no explicit container/root is supplied.

## Window scrolling

Leave `scrollWindow` at its default `true`:

```html
<div
  infiniteScroll
  [infiniteScrollDistance]="600"
  [infiniteScrollDisabled]="loading() || endOfList()"
  (scrolled)="loadMore()">
  ...
</div>
```

The observer root is `null`, so the browser viewport is used.

## External/custom root

Pass an element directly:

```html
<div
  infiniteScroll
  [scrollWindow]="false"
  [infiniteScrollRoot]="listViewport"
  (scrolled)="loadMore()">
  ...
</div>
```

Or use a selector:

```html
<div
  infiniteScroll
  [fromRoot]="true"
  [infiniteScrollContainer]="'.questioner-infinit'"
  [scrollWindow]="false"
  (scrolled)="loadMore()">
  ...
</div>
```

When a selector cannot be resolved, the directive falls back to the host element instead of silently switching to the browser window.

## Reverse / chat feeds

Use `up` and keep scroll anchoring enabled:

```html
<div
  class="chat"
  infiniteScroll
  [scrollWindow]="false"
  [infiniteScrollDirection]="'up'"
  [infiniteScrollDistance]="180"
  [infiniteScrollMaintainScrollPosition]="true"
  [infiniteScrollDisabled]="loadingOlder() || reachedBeginning()"
  (scrolled)="loadOlder()">
  ...
</div>
```

Before emitting the `up` event, the directive snapshots `scrollTop` and `scrollHeight`. When prepended content increases `scrollHeight`, it adds the exact height delta to the previous `scrollTop` so the user's visible messages stay anchored.

For custom rendering pipelines that know exactly when a batch has rendered:

```ts
@ViewChild(NgxInfiniteScroll)
private infiniteScroll?: NgxInfiniteScroll;

loadOlder(): void {
  // fetch + prepend data
  // ...
  this.infiniteScroll?.completePrepend();
}
```

In most Angular templates, automatic observation is enough and `completePrepend()` is not required.

## Bidirectional feeds

```html
<div
  infiniteScroll
  [scrollWindow]="false"
  [infiniteScrollDirection]="'both'"
  [infiniteScrollDistance]="200"
  (scrolled)="loadFromEdge($event)">
  ...
</div>
```

The event tells you which edge triggered the load:

```ts
loadFromEdge(event: NgxInfiniteScrollEvent): void {
  if (event.direction === 'up') {
    // prepend older records
    return;
  }

  // append newer records
}
```

## Public API

| Input                                  | Type                            |  Default | Purpose                                                                |
| -------------------------------------- | ------------------------------- | -------: | ---------------------------------------------------------------------- |
| `infiniteScrollDistance`               | `number`                        |    `200` | Prefetch threshold in pixels.                                          |
| `infiniteScrollDisabled`               | `boolean`                       |  `false` | Stops triggers while true.                                             |
| `infiniteScrollImmediateCheck`         | `boolean`                       |   `true` | Performs a direct visibility check after setup/re-enable.              |
| `infiniteScrollMinInterval`            | `number`                        |    `100` | Minimum time between trigger emissions.                                |
| `infiniteScrollUpDistance`             | `number \| null`                |   `null` | Optional top-edge override; falls back to `infiniteScrollDistance`.    |
| `infiniteScrollDownDistance`           | `number \| null`                |   `null` | Optional bottom-edge override; falls back to `infiniteScrollDistance`. |
| `infiniteScrollDirection`              | `'up' \| 'down' \| 'both'`      | `'down'` | Active edge(s).                                                        |
| `infiniteScrollContainer`              | `string \| HTMLElement \| null` |   `null` | Selector or element root.                                              |
| `infiniteScrollRoot`                   | `HTMLElement \| null`           |   `null` | Explicit observer root; highest precedence.                            |
| `scrollWindow`                         | `boolean`                       |   `true` | Use browser viewport as root.                                          |
| `fromRoot`                             | `boolean`                       |  `false` | Resolve a selector from `document` instead of the host.                |
| `infiniteScrollMaintainScrollPosition` | `boolean`                       |   `true` | Preserve viewport on `up` triggers.                                    |
| `infiniteScrollPreserveScrollBehavior` | `ScrollBehavior`                | `'auto'` | Behavior used for scroll compensation.                                 |

### Outputs

| Output               | Payload                  | Purpose                                              |
| -------------------- | ------------------------ | ---------------------------------------------------- |
| `scrolled`           | `NgxInfiniteScrollEvent` | Main load trigger.                                   |
| `scrolledUp`         | `NgxInfiniteScrollEvent` | Compatibility/convenience output for an up trigger.  |
| `scrolledDown`       | `NgxInfiniteScrollEvent` | Compatibility/convenience output for a down trigger. |
| `scrollStartReached` | `NgxInfiniteScrollEvent` | Convenience output for the top edge.                 |
| `scrollEndReached`   | `NgxInfiniteScrollEvent` | Convenience output for the bottom edge.              |

### `NgxInfiniteScrollEvent`

```ts
export interface NgxInfiniteScrollEvent {
  direction: 'up' | 'down';
  distance: number;
  target: HTMLElement;
  root: HTMLElement | null;
}
```

## Performance model

The directive does **not** install a continuous `scroll` handler. Instead, it creates two tiny sentinels:

```text
┌──────────────────────────────┐
│ top sentinel                 │ ← up
│                              │
│ application items            │
│ application items            │
│ application items            │
│                              │
│ bottom sentinel              │ ← down
└──────────────────────────────┘
             ↑
     IntersectionObserver
```

The observer is created outside Angular's zone. Angular is re-entered only for an actual `scrolled`/edge output. This keeps scrolling/layout work in the browser platform rather than turning every scroll movement into Angular work.

The directive also stays passive about data ownership: application state owns the items, loading state, pagination, retry logic, and end-of-list state. The directive only reports that an edge is close.

## Why not a scroll listener?

A classic implementation continuously evaluates:

```ts
scrollTop + clientHeight >= scrollHeight - threshold;
```

That can work, but it means the application needs to receive and process a high-frequency browser event. IntersectionObserver lets the browser manage the geometry observation and calls the application when the sentinel actually crosses the configured boundary.

## SSR

The package does not touch browser-only APIs until the directive is running in a browser. `IntersectionObserver`, `ResizeObserver`, `MutationObserver`, `window`, and `document` are all guarded by the browser platform check or accessed after view initialization.

This makes it safe to include in an Angular application that uses SSR.

## Package design notes

This primitive intentionally does not provide pagination state, API calls, retry policy, loaders, virtual scrolling, or item caching. Those concerns belong to the application/data layer.

For very large datasets, combine this directive with ngx-kit virtual scrolling rather than rendering tens of thousands of nodes into the DOM. Infinite scroll decides **when to fetch**; virtual scrolling decides **how much DOM to keep**.
