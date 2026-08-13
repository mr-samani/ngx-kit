# ngx-kit/angle-selector

An angle picker (0 to 360 degrees) with a draggable circular handle — for setting a gradient's direction, a shadow's rotation, or any other angular value.

## Install

```bash
npm install ngx-kit
```

## Usage

```html
<ngx-input-angle [(ngModel)]="angle"></ngx-input-angle>
```

Or on a plain input:

```html
<input type="number" [ngxInputAngle]="angle" (change)="angle = $event" />
```

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Component theme |
| `change` *(directive)* | `EventEmitter<number>` | | The new angle (in degrees) |

The value is always a number between `0` and `360`.

## Dark mode and RTL

Supported automatically. The handle is implemented with RxJS (`switchMap` + `takeUntil` + `takeUntilDestroyed`), so drag listeners are only ever active during an actual drag.
