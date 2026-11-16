# ngx-kit/angle-selector

A circular angle picker for values from 0° to 360°. Use it directly in a form or attach it to an existing input as a popup.

## Install

```bash
npm install ngx-kit
```

## Standalone component

```ts
import { FormsModule } from '@angular/forms';
import { NgxAngleSelectorComponent } from 'ngx-kit/angle-selector';

@Component({
  standalone: true,
  imports: [FormsModule, NgxAngleSelectorComponent],
  template: `<ngx-input-angle [(ngModel)]="angle" (change)="onAngleChange($event)" />`,
})
export class ExampleComponent {
  angle = 45;

  onAngleChange(value: number) {
    console.log(value);
  }
}
```

`NgxAngleSelectorComponent` is a `ControlValueAccessor`, so it also works with reactive forms.

## Attach the picker to an input

```ts
import { FormsModule } from '@angular/forms';
import { NgxInputAngle } from 'ngx-kit/angle-selector';

@Component({
  standalone: true,
  imports: [FormsModule, NgxInputAngle],
  template: `
    <input type="number" ngxInputAngle [(ngModel)]="angle"
           (change)="onAngleChange($event)" />
  `,
})
export class ExampleComponent {
  angle = 45;
}
```

The directive opens the picker when the input is clicked. It also implements `ControlValueAccessor` and `Validator`, and can be used with `formControl` or `formControlName`.

## API

### `NgxAngleSelectorComponent` (`<ngx-input-angle>`)

| Input | Type | Default | Description |
|---|---|---:|---|
| `size` | `number` | `90` | Picker size in pixels |

| Output | Type | Description |
|---|---|---|
| `change` | `number` | Emits the selected angle in degrees |

### `NgxInputAngle` (`ngxInputAngle`)

| Input | Type | Default | Description |
|---|---|---:|---|
| `size` | `number` | `90` | Size of the popup picker |
| `openOnCLick` | `boolean` | `true` | Open the picker when the input is clicked |

| Output | Type | Description |
|---|---|---|
| `change` | `number` | Emits the selected angle |

The directive validates values outside the 0–360 range. The input's value is managed by Angular Forms; `ngxInputAngle` is an attribute directive, not a value input.

## Notes

The component and directive use `ngx-kit/core` for popup positioning. No separate core setup is required.
