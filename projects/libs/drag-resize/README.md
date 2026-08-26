# ngx-kit drag-resize

## Design goals

The package uses Angular 22 signals and Pointer Events. Sorting is geometry-driven: the list detects whether it is CSS Grid, flex row, flex column, or an unstructured container and chooses the appropriate insertion algorithm. RTL is determined from the actual computed `direction` instead of from an input flag.

## Basic drop list

```html
<div NgxDropList (drop)="onDrop($event)">
  @for (item of items; track item.id) {
  <article NgxDraggable [data]="item">{{ item.name }}</article>
  }
</div>
```

## Resize

```html
<article
  NgxResizable
  [minWidth]="120"
  [minHeight]="80"
  [directions]="['n','e','s','w','ne','se','sw','nw']"></article>
```

Resize is pointer based, supports all eight directions, minimum/maximum constraints and optional pixel snapping.
