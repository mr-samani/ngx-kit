# ngx-kit/box-shadow

A visual `box-shadow` builder: drag the shadow's offset on a 2D pad with mouse/touch, plus controls for blur, spread, and color.

## Install

```bash
npm install ngx-kit
```

## Usage

```html
<ngx-box-shadow [(ngModel)]="shadowCss"></ngx-box-shadow>
```

Or on a plain input:

```html
<input type="text" [ngxInputBoxShadow]="shadowCss" (change)="shadowCss = $event" />
```

The output is a valid CSS string like `0px 4px 12px 0px rgba(0,0,0,0.25)`.

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `setInputBackground` *(directive)* | `boolean` | `true` | Shows the shadow color as the input's background |

## Dark mode and RTL

Supported automatically. The shadow-offset pad is implemented with Pointer Capture (no global `document` listener needed), so it works smoothly on mobile too.
