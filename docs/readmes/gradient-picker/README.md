# ngx-kit/gradient-picker

A linear/radial gradient picker with multiple draggable color stops, outputting a ready-to-use CSS string.

## Install

```bash
npm install ngx-kit
```

## Usage

```html
<ngx-input-gradient [(ngModel)]="gradientCss"></ngx-input-gradient>
```

Or as a directive on a plain input:

```html
<input type="text" [ngxInputGradient]="gradientCss" (change)="gradientCss = $event" />
```

The output is a valid CSS string like `linear-gradient(90deg, #ff0000 0%, #0000ff 100%)`, ready to use directly in `background`/`background-image`.

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Panel theme |
| `setInputBackground` *(directive)* | `boolean` | `true` | Sets the input's background to the selected gradient |
| `change` *(directive)* | `EventEmitter<string>` | | The new gradient string |

## UI notes

- Add a color stop by clicking on the gradient bar; drag to move it.
- Double-click a stop to remove it (or use the delete button if shown).
- Each stop's color is edited with the same `ngx-kit/color-picker` panel (this package depends on it).

## Dark mode and RTL

Supported automatically.
