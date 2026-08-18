# ngx-kit/dialog

Modal/dialog built on the browser's native `<dialog>` — no manual overlay, no third-party library.

## Install

```bash
npm install ngx-kit
```

## Setup

```ts
// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxDialogModule } from 'ngx-kit/dialog';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(NgxDialogModule)],
};
```

## Opening a dialog

With the static API (no manual service injection needed):

```ts
import { Dialog } from 'ngx-kit/dialog';

const ref = Dialog.open(MyDialogComponent, {
  data: { userId: 42 },
  width: '480px',
  allowCloseOnOutsideClick: true,
  header: { enable: true, title: 'Edit user', showCloseButton: true },
});

ref.afterClosed.subscribe((result) => console.log('Result:', result));
```

Inside the dialog's component:

```ts
@Component({ ... })
export class MyDialogComponent {
  private ref = inject(NgxDialogRef);
  data = inject(NGX_DIALOG_DATA); // the data passed via config.data

  save() {
    this.ref.close({ saved: true });
  }
}
```

### Layout directives inside a dialog

```html
<div *ngxDialogHeader>Custom title</div>
<div *ngxDialogBody>Main content</div>
<div *ngxDialogFooter>
  <button (click)="save()">Save</button>
</div>
```

## API

### `Dialog.open<T>(component, config?)`

| `config` field | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T` | `{}` | Data passed to the component inside the dialog |
| `allowCloseOnOutsideClick` | `boolean` | `false` | Close when clicking the backdrop |
| `containerClass` | `string` | `'ngx-kit'` | Extra class on the container |
| `header.enable` / `header.title` / `header.showCloseButton` | | | Default header settings |
| `footer.enable` | `boolean` | | Show the default footer |
| `width` / `minWidth` / `maxWidth` | `string` | | Horizontal sizing |
| `height` / `minHeight` / `maxHeight` | `string` | | Vertical sizing |
| `injector` | `Injector` | | Custom injector for the inner component |

### `NgxDialogRef`

| Member | Description |
| --- | --- |
| `close(result?)` | Closes the dialog, optionally passing back a result |
| `afterClosed: Observable<any>` | Emits `result` after the dialog closes |

## SSR note

`Dialog.open(...)` is a static/global API that's perfectly safe for a typical browser app. If you're using Angular SSR, this static instance is shared across concurrent server requests — instead of the static API, inject `NgxOverlayService` directly (which is per-injector/per-request safe).

## Dark mode and RTL

Supported automatically (`light-dark()` + CSS logical properties).
