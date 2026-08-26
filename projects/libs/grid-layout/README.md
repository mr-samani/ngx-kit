# ngx-kit grid-layout

## Angular 22 API

The rewrite is intentionally signal-first. Inputs use Angular signal inputs, outputs use `output()`, and the grid engine exposes `signal()`/`computed()` state. There is no RxJS-driven layout loop.

### Layout modes

- `flow: 'free'` — the user can place items anywhere in the grid.
- `flow: 'horizontal'` — horizontal-first placement.
- `flow: 'vertical'` — vertical-first placement.
- `compact: 'none'` — preserve empty cells.
- `compact: 'vertical'` — pack upward.
- `compact: 'horizontal'` — pack toward the start edge.
- `compact: 'both'` — perform both passes.

### RTL

Use `[dir]="'rtl'"` or `options.rtl = 'auto'`. Logical `x=0` is always the start-most column. The rendering layer maps that logical coordinate to the physical left/right edge. This keeps persisted layouts direction-independent.

### Collision behavior

`allowOverlap` disables collision resolution. `pushItems` controls whether a dragged/resized item pushes colliding siblings during interaction. The final layout is normalized again when the pointer is released.

### Example

```html
<ngx-grid-layout
  [dir]="direction()"
  [options]="{ cols: 12, rowHeight: 48, gap: 8, compact: 'vertical', pushItems: true }"
  (layoutChange)="saveLayout($event)">
  @for (item of layout(); track item.id) {
  <ngx-grid-item [itemId]="item.id!" [config]="item">
    <div class="widget">{{ item.id }}</div>
  </ngx-grid-item>
  }
</ngx-grid-layout>
```

`ngx-grid-item` installs drag and resize behavior on its host. Resize recognizes all eight edges/corners and uses grid snapping supplied by the grid engine.

# Grid layout API reference

| Option         | Meaning                                           |
| -------------- | ------------------------------------------------- |
| `cols`         | Number of logical columns.                        |
| `rowHeight`    | Pixel row height or `fit`.                        |
| `gap`          | Gap between cells in pixels.                      |
| `flow`         | Free, horizontal-first, or vertical-first intent. |
| `compact`      | Compaction direction.                             |
| `allowOverlap` | Allow items to occupy the same cells.             |
| `pushItems`    | Push siblings away during interaction.            |
| `rtl`          | `true`, `false`, or `auto`.                       |
| `animate`      | Reserved for the visual animation layer.          |
