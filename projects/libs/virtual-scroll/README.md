# @ngx-kit/virtual-scroll

A zoneless, signal-based virtual scroll viewport for Angular. No `@angular/material`
or `@angular/cdk` dependency, no `NgZone`, no `ngOnChanges`, no `@Input() itemSize`,
no `@Input() orientation` — everything that can be derived from the real DOM is
derived from the real DOM.

## Why this rewrite

| Old design | This design |
| --- | --- |
| `NgZone` injected, `zone.run` everywhere | No `NgZone` at all — works natively under `provideZonelessChangeDetection()` |
| `ngOnChanges` + `SimpleChanges` | `input()` signals + `computed()` / `effect()` |
| `@Input() itemSize` (broke as soon as your item had margin/border/box-shadow) | Real item size is **measured** from `getBoundingClientRect()` deltas between actually rendered siblings, so margins/borders/shadows are always accounted for |
| `@Input() orientation` | Axis is **auto-detected** from the real layout of your own item markup |
| Custom `*ngxVirtualFor` structural directive | Plain native `@for` over a `visibleItems()` signal — you keep full control of `track`, `@empty`, etc. |

## Install & import

```ts
import { NgxVirtualScrollViewport } from '@ngx-kit/virtual-scroll';

@Component({
  standalone: true,
  imports: [NgxVirtualScrollViewport],
  ...
})
```

## Basic usage — vertical list (auto-detected)

```html
<ngx-virtual-scroll-viewport #vs="ngxVirtualScrollViewport" [items]="items" style="height: 400px">
  @for (item of vs.visibleItems(); track $index; let i = $index) {
    <div class="row">{{ vs.baseIndex() + i | number }} - {{ item.name }}</div>
  }
</ngx-virtual-scroll-viewport>
```

This is exactly the case that used to break: `.row` can have `margin`, `border`,
`box-shadow`, `padding` — anything. The viewport measures the real distance between
two consecutively rendered rows and uses that, not a number you have to keep in sync
with your CSS.

```css
.row {
  height: 48px;
  border: 1px rgb(166 166 166 / 51%) solid;
  box-shadow: 0px 0px 20px rgb(122 122 122 / 20%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin: 10px;
  padding: 15px;
}
```

## Horizontal lists & wrapping grids (auto-detected)

The axis is inferred purely from how your own items lay out:

- Items stack top-to-bottom (default block flow) → **vertical** list.
- Items lay out left-to-right in a single line (e.g. `display: inline-flex` on the
  item, or a `flex-wrap: nowrap` row) → **horizontal** list.
- Items lay out left-to-right and *wrap* to a new line (e.g. cards with
  `display: flex; flex-wrap: wrap`) → treated as a **vertical** list of "lines",
  where each line holds N items. This is how mixed horizontal + vertical layouts
  (a card grid that scrolls vertically) are supported without a separate 2D data
  model — the cross axis (row width) lays out and scrolls natively, only the line
  axis is virtualized.

You don't configure any of this — you only make sure your `.item` CSS actually lays
out the way you want, and the viewport detects it.

## Mixed content (e.g. wide, virtualized table)

Both axes of the scroll container are always natively scrollable
(`overflow: auto` on both). Only the detected axis is virtualized; the cross axis
(for example, a table wider than its container) scrolls with the browser's native
scrollbar, so wide tables with virtualized rows work out of the box:

```html
<div class="table-shell">
  <table><thead>...</thead></table> <!-- kept outside, sticky/fixed header -->

  <ngx-virtual-scroll-viewport #vs="ngxVirtualScrollViewport" [items]="rows" style="height: 480px">
    <table>
      <tbody>
        @for (row of vs.visibleItems(); track row.id; let i = $index) {
          <tr>
            <td>{{ vs.baseIndex() + i }}</td>
            ...
          </tr>
        }
      </tbody>
    </table>
  </ngx-virtual-scroll-viewport>
</div>
```

## API

### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `readonly T[]` | `[]` | Full data set |
| `minBufferPx` | `number` | `150` | Buffer left before recomputing the range |
| `maxBufferPx` | `number` | `300` | Extra px rendered outside the viewport |
| `measureFn` | `NgxVirtualScrollMeasureFn` | `undefined` | Advanced override for the built-in layout probe |

### Outputs

| Output | Type |
| --- | --- |
| `scrolledIndexChange` | `OutputEmitterRef<number>` |
| `rangeChange` | `OutputEmitterRef<NgxVirtualScrollRange>` |

### Public signals (via `#vs="ngxVirtualScrollViewport"`)

| Signal | Type | Meaning |
| --- | --- | --- |
| `visibleItems()` | `readonly T[]` | Slice of `items()` to render right now |
| `range()` | `{ start, end }` | Currently rendered line range |
| `baseIndex()` | `number` | Absolute index of `visibleItems()[0]` |
| `axis()` | `'vertical' \| 'horizontal'` | Auto-detected scroll axis |
| `crossCount()` | `number` | Items per line (1 for a plain list) |
| `lineSize()` | `number` | Measured px size of one line |
| `isMeasured()` | `boolean` | Whether the initial layout probe has completed |
| `isScrolling()` | `boolean` | True while an active scroll gesture is in progress |

### Methods

| Method | Description |
| --- | --- |
| `scrollToIndex(index, behavior?)` | Scroll to a given item index |
| `scrollToOffset(offsetPx, behavior?)` | Scroll to a given pixel offset |
| `checkViewportSize()` | Force a re-measure (rarely needed — a `ResizeObserver` already handles container resizes) |

## Performance notes

- Fully `ChangeDetectionStrategy.OnPush` and zoneless-compatible — no `NgZone`
  import anywhere; signal writes are what schedule change detection.
- Scroll handling is `requestAnimationFrame`-throttled and the listener is
  registered with `{ passive: true }`.
- The range is only recomputed once the scroll offset gets within
  `minBufferPx` of the current range's edge — not on every scroll event.
- Layout is only ever **read** (`getBoundingClientRect`) inside an
  `afterRenderEffect({ read: ... })` block, so DOM measurement never
  interleaves with — and never forces — a layout/style write.
- `will-change: transform` is only applied to the content wrapper while
  `isScrolling()` is true, and removed ~150ms after the last scroll event, to
  avoid holding a compositor layer alive for the component's entire lifetime.
- `contain: strict` / `contain: layout style` isolate the viewport's layout
  and paint from the rest of the page.

## How auto-measurement works

On first render, up to 24 items are rendered "in the open" (un-transformed) purely
to be measured — see `measure-layout.ts`. Their real `getBoundingClientRect()`
deltas are used to infer axis, items-per-line, and line size in one pass, all pure
functions with no Angular dependency (so they are trivially unit-testable). Once
measured, the real virtualized range replaces the probe range and rendering
proceeds normally. If your rows can change size at runtime (e.g. responsive
breakpoints), a `ResizeObserver` on the scroll container triggers `checkViewportSize()`
automatically to re-fit the viewport dimension; if the *line size itself* changes at
runtime you can force a full re-measure by re-creating the component (e.g. keyed with
`@if`/`*ngIf` + a changing key), which is the same limitation `cdk-virtual-scroll-viewport`
has with its own `FixedSizeVirtualScrollStrategy`.
