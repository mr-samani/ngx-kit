# ngx-kit/color-picker

A complete color picker: a visual picker (saturation/hue), RGB/HSL/CMYK/HEX inputs, an alpha channel, and support for the browser's EyeDropper API to pick a color from anywhere on the screen.

## Install

```bash
npm install ngx-kit
```

## Usage as a component

```html
<ngx-input-color [(ngModel)]="color" [outputType]="'HEX'" [defaultInspector]="ColorInspector.Picker"></ngx-input-color>
```

`NgxInputColorComponent` is a full `ControlValueAccessor`, so it works with `ngModel`, `formControl`, and `formControlName`.

## Usage as a directive (on a plain input)

```html
<input type="text" [ngxInputColor]="color" (change)="color = $event" [outputType]="'RGB'" />
```

## API

### `<ngx-input-color>` / `[ngxInputColor]`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | `'auto'` follows the browser's `prefers-color-scheme` |
| `simpleMode` | `boolean` | `false` | A more compact UI |
| `outputType` | `'HEX' \| 'RGB' \| 'HSL' \| 'HSV' \| 'CMYK'` | `'HEX'` | Output string format |
| `defaultInspector` | `ColorInspector` (`Picker \| RGB \| HSL \| CMYK`) | `Picker` | Which tab is open by default |
| `useAlphaChannel` | `boolean` | `true` | Show/hide the alpha (transparency) channel |
| `setInputBackgroundColor` *(directive only)* | `boolean` | `true` | Sets the input's own background to the selected color |
| `change` *(output, directive only)* | `EventEmitter<string>` | | The new value whenever the color changes |

### Input/output formats

The value can be any of: `#rrggbb`, `#rrggbbaa` (including 3- and 4-character shorthand with alpha), `rgb()`/`rgba()`, `hsl()`/`hsla()`.

## EyeDropper

If the user's browser supports the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper) (recent Chrome/Edge), the eyedropper button is enabled automatically and the user can pick a color from anywhere on the page (even outside the browser). On browsers without support, the button stays hidden.

## Dark mode and RTL

Supported automatically.
