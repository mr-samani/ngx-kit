# ngx-kit drag-resize

## Design goals

The package uses Angular 22 signals and Pointer Events. Dragging and resizing remain transform/pointer based, while drop-list sorting uses live DOM geometry.

### Professional drop-list behavior

When a drag starts inside a drop list:

- the real item remains in its original DOM position as a hidden layout anchor;
- exactly one placeholder preserves the item's layout space;
- a fully styled visual clone is moved to `document.body`, so overflow/scroll containers cannot clip the drag;
- the body preview copies computed styles recursively, including CSS custom properties and descendant styles;
- entering, leaving and switching lists always disposes the previous placeholder before creating the next one;
- sorting uses current DOM geometry instead of stale start-of-drag rectangles;
- `previousIndex` is captured from the origin list and `currentIndex` is the final placeholder position;
- dropping outside every connected list cancels the drag instead of accidentally committing it;
- auto-scroll follows the currently hovered drop list.

## Basic drop list

```html
<div NgxDropList (drop)="onDrop($event)">
  @for (item of items; track item.id) {
    <article NgxDraggable [data]="item">
      {{ item.name }}
    </article>
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
