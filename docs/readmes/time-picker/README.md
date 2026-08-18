# ngx-kit/time-picker

An analog clock time picker (MUI-style), usable either inline or as a popup attached to a text input, with 12h/24h format support and a configurable minute step.

## Install

```bash
npm install ngx-kit
```

## Setup (optional)

```ts
// app.config.ts
import { provideTimePicker } from 'ngx-kit/time-picker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTimePicker({
      format: '24',
      minuteStep: 5,
      confirmButtonText: 'Done',
    }),
  ],
};
```

`provideTimePicker` only needs the fields you want to override — everything else falls back to the defaults (`confirmButtonText: 'Ok'`, `cancelButtonText: 'Cancel'`, `amText: 'AM'`, `pmText: 'PM'`, `format: '12'`, `minuteStep: 1`, `autoSwitchToMinute: true`).

## Usage — popup attached to an input

```html
<input
  type="text"
  formControlName="time"
  ngxInputTimePicker
  #dp="ngxInputTimePicker"
/>
<button (click)="dp.toggle()">Open</button>
```

`[ngxInputTimePicker]` is a full `ControlValueAccessor` + `Validator`, so it works with `ngModel`/`formControl`/`formControlName`. The value is always a string in `HH:MM` (24h) form, e.g. `'14:35'`.

If the typed text isn't a valid time, the control gets a `{ invalid: true }` error (in addition to whatever built-in validators like `Validators.required` you add yourself):

```html
@if (form.get('time')?.hasError('invalid')) {
  <div class="text-danger">Invalid time</div>
}
@if (form.get('time')?.hasError('required')) {
  <div class="text-danger">Time is required</div>
}
```

## Usage — inline (always visible)

```html
<ngx-time-picker format="24" [(value)]="time" (change)="onTimeChange($event)"></ngx-time-picker>
```

## API

### `[ngxInputTimePicker]`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `openOnCLick` | `boolean` | `true` | Open the popup when the input itself is clicked |
| `format` | `'12' \| '24'` | from config | |

| Output | Type | Description |
| --- | --- | --- |
| `change` | `EventEmitter<string \| null>` | Emitted when the user confirms a time |

| Member | Description |
| --- | --- |
| `toggle()` | Opens the popup if closed, closes it if open |

### `<ngx-time-picker>`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (model, two-way) | `string` | `'12:00'` | Bind with `[(value)]` |
| `format` | `'12' \| '24'` | from config | |
| `minuteStep` | `number` | from config | |
| `disabled` | `boolean` | `false` | |
| `autoSwitchToMinute` | `boolean` | from config | Switch to minute-selection mode right after picking the hour |

| Output | Type | Description |
| --- | --- | --- |
| `change` | `EventEmitter<string \| null>` | Emitted when "OK" is pressed |
| `cancel` | `EventEmitter<void>` | Emitted when "Cancel" is pressed |

## Dark mode and RTL

Supported automatically.
