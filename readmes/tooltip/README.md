# ngx-kit/tooltip

A standalone tooltip directive with configurable trigger behavior, placement, delay, viewport shifting, and optional HTML content.

## Install

```bash
npm install ngx-kit
```

## Basic usage

```ts
import { NgxTooltip } from 'ngx-kit/tooltip';

@Component({
  standalone: true,
  imports: [NgxTooltip],
  template: `
    <button [ngxTooltip]="'Save your changes'">Save</button>
    <button [ngxTooltip]="'More details'"
            ngxTooltipPlacement="right"
            ngxTooltipTrigger="hover-focus">
      Details
    </button>
  `,
})
export class ExampleComponent {}
```

## Global defaults

Use `provideTooltip` in application providers to change defaults:

```ts
import { provideTooltip } from 'ngx-kit/tooltip';

export const appConfig: ApplicationConfig = {
  providers: [provideTooltip({ placement: 'top', delay: 150, offset: 10 })],
};
```

## API

### `NgxTooltip` (`[ngxTooltip]`)

| Input | Type | Default | Description |
|---|---|---:|---|
| `ngxTooltip` | `string` | required | Tooltip text |
| `ngxTooltipUseOverlay` | `boolean` | `true` | Use the browser popover behavior when available |
| `ngxTooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Preferred placement |
| `ngxTooltipOffset` | `number` | `8` | Distance from the host element in pixels |
| `ngxTooltipDelay` | `number` | `80` | Delay before showing, in milliseconds |
| `ngxTooltipHideDelay` | `number` | `40` | Delay before hiding, in milliseconds |
| `ngxTooltipAllowHtml` | `boolean` | `false` | Interpret the tooltip content as HTML; content is sanitized before insertion |
| `ngxTooltipTrigger` | `'hover' \| 'focus' \| 'hover-focus'` | `'hover'` | Events that show the tooltip |
| `ngxTooltipFlip` | `boolean` | `true` | Flip when the preferred side has insufficient room |
| `ngxTooltipShift` | `boolean` | `true` | Keep the tooltip within the viewport |

`provideTooltip` accepts `NgxTooltipConfig`, whose defaults are `placement: 'bottom'`, `offset: 8`, `delay: 80`, `hideDelay: 40`, `useHtml: false`, and `usePopOver: true`.

## Accessibility

Use the directive on an element that can receive focus when the tooltip contains information users need. The directive supports focus-triggered display; it does not replace an accessible label for an interactive control.
