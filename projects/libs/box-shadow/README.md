# ngx-kit/box-shadow

A visual editor for CSS `box-shadow` values. It supports multiple shadows, editing individual shadow properties, duplicating and removing shadows, and Angular Forms integration.

## Install

```bash
npm install ngx-kit
```

## Usage

```ts
import { FormsModule } from '@angular/forms';
import { NgxShadowBox } from 'ngx-kit/box-shadow';

@Component({
  standalone: true,
  imports: [FormsModule, NgxShadowBox],
  template: `
    <ngx-box-shadow [(ngModel)]="shadow" />
    <pre>{{ shadow }}</pre>
  `,
})
export class ExampleComponent {
  shadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
}
```

The component is a `ControlValueAccessor`; it can also be connected to a reactive form control.

## API

### `<ngx-box-shadow>`

| Input | Type | Default | Description |
|---|---|---:|---|
| `maxRange` | `number` | `25` | Maximum range used by the shadow editor controls |

| Output | Type | Description |
|---|---|---|
| `shadowChange` | `string` | Emits the serialized CSS `box-shadow` value |

The form value is a CSS `box-shadow` string. An empty value represents no shadows.

## Types

`BoxShadow` is exported from `ngx-kit/box-shadow` for applications that need to work with the editor's structured shadow representation.

## Notes

The popup editor uses the shared overlay service from `ngx-kit/core`. Importing this secondary entry point is sufficient; you do not need to configure the core package separately.
