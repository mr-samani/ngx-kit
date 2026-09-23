# ngx-kit drag-resize

## Design goals

The package uses Angular 22 signals and Pointer Events. Dragging and resizing remain transform/pointer based. Drop-list sorting is snapshot-based and driven by `translate3d`, like Angular CDK Drag & Drop.

### Professional drop-list behavior

When a drag starts inside a drop list:

- the real item remains in its original DOM position as a hidden layout anchor;
- exactly one placeholder preserves the item's layout space;
- a fully styled visual clone is moved to `document.body`, so overflow/scroll containers cannot clip the drag;
- the body preview copies computed styles recursively, including CSS custom properties and descendant styles;
- entering, leaving and switching lists always disposes the previous placeholder before creating the next one;
- sorting is a pure function of the pointer and a geometry snapshot taken when the drag enters a list, so it is fully reversible (see below);
- `previousIndex` is captured from the origin list and `currentIndex` is the final placeholder position;
- dropping outside every connected list cancels the drag instead of accidentally committing it;
- auto-scroll follows the currently hovered drop list (or the page when outside every list);
- the item is never clamped to its list; only an explicit `boundary` input restricts the preview;
- free drag (items that are not direct children of a drop list) never uses the body clone and is never captured by a list.

### How sorting works

Per pointer position the engine answers *"if I release here, where is the item inserted?"*:

1. **Snapshot.** When a drag enters a list, the rectangles of its items (with the dragged item's placeholder in its slot) are measured once. They are kept valid across page/parent/nested scrolling by shifting the pointer by the scroll delta, so pointer moves perform no layout reads.
2. **Resolve.** `resolveInsertionIndex(pointer, snapshot)` counts how many siblings precede the pointer. Orientation is derived from the rectangles (row clustering and the order DOM siblings actually land on screen), so column, row, `flex` (incl. `wrap`, `*-reverse`), `grid`, inline/inline-block, floats, RTL and LTR all use one algorithm; `flex-direction`/`direction` are only a fallback for lists of fewer than two items. A small proportional hysteresis (10 % of the sibling's size, max 6 px) prevents flicker on a mid-line.
3. **Show.** Single-row/column lists never touch the DOM while sorting: siblings and the placeholder are displaced with `translate3d` computed from measured sizes and gaps. Multi-row layouts (grid, wrapping) cannot be described by a translate without re-implementing the browser's layout, so the single placeholder node is moved and siblings are animated with FLIP `translate3d`. Decisions always use the immutable snapshot, so reflow never feeds back into them.
4. **Commit or roll back.** Nothing is committed during the drag. On release over a connected list one `drop` is emitted (after all temporary DOM/styles were removed); anywhere else, on Escape, `pointercancel` or when the draggable is destroyed the drag is rolled back and nothing is emitted.

The list the drag started in keeps its original slot (a hole) while the pointer is outside every list; other lists get a placeholder only while hovered. `DropListRef.sortAnimationDuration` (default 200 ms, `0` disables) controls the slide animation.

### Notes and limits

- Draggables must be direct children of their drop list (as before); others behave as free drag.
- Nested draggables: the innermost enabled draggable claims a `pointerdown`. Use `dragHandle`s if an outer item should be draggable from its own area.
- Nested lists: the innermost connected list under the pointer wins; lists inside the dragged element are never targets.
- Hit testing only counts the visible (clip-aware) part of a list.
- Custom placeholder templates (`NgxPlaceholder`) are not rendered by the engine (pre-existing).
- Scaled (`transform: scale`) ancestors are not compensated.

## Basic drop list

```html
<div NgxDropList (drop)="onDrop($event)">
  @for (item of items; track item.id) {
  <article NgxDraggable [data]="item">{{ item.name }}</article>
  }
</div>
```

For most UIs, wrap related lists in `NgxDropListGroup` so they are connected automatically:

```html
<div NgxDropListGroup>
  <div NgxDropList>...</div>
  <div NgxDropList>...</div>
  <div NgxDropList>...</div>
</div>
```

The emitted event follows the familiar `previousIndex/currentIndex` model, making it suitable for `moveItemInArray` / `transferArrayItem` style data updates.

## Resize

```html
<article
  NgxResizable
  [minWidth]="120"
  [minHeight]="80"
  [directions]="['n','e','s','w','ne','se','sw','nw']"></article>
```

Resize is pointer based, supports all eight directions, minimum/maximum constraints and optional pixel snapping.
