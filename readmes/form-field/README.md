# ngx-kit/form-field

A lightweight form-field wrapper for Angular applications. It provides a label, projected input content, hint and error slots, and explicit state inputs for forms that manage validation themselves.

## Install

```bash
npm install ngx-kit
```

## Usage

```ts
import { NgxFormField, NgxInput, NgxHint, NgxError } from 'ngx-kit/form-field';

@Component({
  standalone: true,
  imports: [NgxFormField, NgxInput, NgxHint, NgxError],
  template: `
    <ngx-form-field label="Email" [invalid]="emailInvalid" [required]="true">
      <input ngxInput type="email" />
      <span ngxHint>Use your work email address.</span>
      <span ngxError>Enter a valid email address.</span>
    </ngx-form-field>
  `,
})
export class ExampleComponent {
  emailInvalid = false;
}
```

The wrapper does not create or own an Angular form control. Bind the input to `ngModel` or a reactive form as you normally would, and pass the relevant state to the field.

## API

### `<ngx-form-field>`

| Input | Type | Default | Description |
|---|---|---:|---|
| `label` | `string` | required | Field label |
| `float` | `boolean` | `false` | Keep the label floated |
| `invalid` | `boolean` | `false` | Show the invalid state and error content |
| `required` | `boolean` | `false` | Mark the field as required |
| `disabled` | `boolean` | `false` | Apply the disabled state |
| `readonly` | `boolean` | `false` | Apply the read-only state |
| `value` | model | — | Optional value model exposed by the wrapper |
| `errorMessages` | `string[]` | — | Error messages supplied by the application |
| `rows` | `number` | — | Row count for supported multiline content |

### Projected directives

| Directive | Selector | Purpose |
|---|---|---|
| `NgxInput` | `ngxInput` or `ngx-input` | Marks the form control |
| `NgxHint` | `ngxHint` or `ngx-hint` | Hint content |
| `NgxError` | `ngxError` or `ngx-error` | Error content |
| `NgxPrefix` | `ngxPrefix` or `ngx-prefix` | Prefix content |
| `NgxSuffix` | `ngxSuffix` or `ngx-suffix` | Suffix content |

Import the standalone components/directives you use into the consuming component.
