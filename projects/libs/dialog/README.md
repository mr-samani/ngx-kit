# `ngx-kit/dialog`

A standalone, signal-based dialog library for Angular, built entirely on top of [`ngx-kit/overlay`](../overlay).

`ngx-kit/dialog` adds a flexible dialog API to the existing overlay infrastructure. It does not rely on the native HTML `<dialog>` element or introduce a separate overlay stack for each dialog. Instead, it reuses `OverlayService` for shared overlay behavior, including backdrop management, positioning, focus trapping, Escape and outside-click handling, scroll locking, and optional top-layer rendering through the Popover API.

The dialog module focuses on dialog-specific functionality: configuration, typed data injection, dialog lifecycle management, and customizable headers, bodies, and footers.

**Key features**

- Built on `ngx-kit/overlay` with no separate overlay infrastructure.
- Standalone components and directives — no `NgModule` required.
- Signal-based architecture with zoneless change detection compatibility.
- Strongly typed dialog references, results, and injected data.
- Configurable dimensions, animations, accessibility attributes, and close behavior.
- Optional automatic headers and footers, or fully custom dialog layouts.
- Optional Popover API integration with automatic fallback when unsupported.
- Dark mode and RTL support.
- Programmatic control through `NgxDialogService` and `NgxDialogRef`.

## Installation

```bash
npm install ngx-kit
```

## Setup

Register the dialog providers in your application configuration:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxDialog } from 'ngx-kit/dialog';

export const appConfig: ApplicationConfig = {
  providers: [provideNgxDialog()],
};
```

## Opening a Dialog

Inject `NgxDialogService` and call `open()` with a standalone component and an optional configuration object.

```ts
import { Component, inject } from '@angular/core';
import { NgxDialogService } from 'ngx-kit/dialog';

@Component({
  standalone: true,
  // ...
})
export class UsersComponent {
  private readonly dialog = inject(NgxDialogService);

  editUser(): void {
    this.dialog
      .open(EditUserComponent, {
        data: { userId: 42 },
        size: 'md',
        header: {
          enable: true,
          title: 'Edit user',
          showCloseButton: true,
        },
      })
      .afterClosed
      .subscribe((result) => {
        console.log('Dialog result:', result);
      });
  }
}
```

No `ViewContainerRef` is required at the call site. The dialog service delegates overlay creation to `ngx-kit/overlay` and manages the dialog's lifecycle.

## Accessing Dialog Data and Results

Use `DIALOG_DATA` to access the data passed to `open()`, and `DIALOG_REF` to control the dialog from within its content component.

```ts
import { Component, inject } from '@angular/core';
import {
  DIALOG_DATA,
  DIALOG_REF,
  NgxDialogRef,
} from 'ngx-kit/dialog';

interface EditUserData {
  userId: number;
}

interface EditUserResult {
  saved: boolean;
}

@Component({
  standalone: true,
  template: `
    <p>Editing user {{ data.userId }}</p>
    <button type="button" (click)="save()">Save</button>
  `,
})
export class EditUserComponent {
  private readonly dialogRef =
    inject<NgxDialogRef<EditUserResult>>(DIALOG_REF);

  readonly data = inject<EditUserData>(DIALOG_DATA);

  save(): void {
    this.dialogRef.close({ saved: true });
  }
}
```

The result is emitted through `afterClosed` when the dialog has finished closing and has been removed from the DOM.

## Dialog Layout

Dialog content can define its own header, body, and footer using the provided structural directives or layout components. Choose one approach for a given section; do not combine a custom section with its corresponding automatic section.

### Structural directives

```html
<div *ngxDialogHeader>
  Edit user
</div>

<div *ngxDialogBody>
  <!-- Main content -->
</div>

<div *ngxDialogFooter align="end">
  <button type="button" (click)="save()">Save</button>
</div>
```

Import the directives into the standalone component that uses them.

### Layout components

Alternatively, use the dedicated layout components:

```html
<ngx-dialog-header>
  Edit user
</ngx-dialog-header>

<ngx-dialog-body>
  <!-- Main content -->
</ngx-dialog-body>

<ngx-dialog-footer align="end">
  <button type="button" (click)="save()">Save</button>
</ngx-dialog-footer>
```

These layout options let you customize the dialog structure while keeping the overlay behavior managed by `ngx-kit/overlay`.

## Automatic Header and Footer

For common dialog layouts, enable the built-in header and footer through the dialog configuration. This avoids manually defining those sections.

```ts
this.dialog.open(EditUserComponent, {
  header: {
    enable: true,
    title: 'Edit user',
    showCloseButton: true,
  },
  footer: {
    enable: true,
    closeText: 'Close',
    align: 'end',
  },
});
```

Do not enable an automatic section if the content component already provides that section using a custom directive or layout component.

## API Reference

### `NgxDialogService.open<R, DataType>(component, config?)`

Opens a dialog and returns an `NgxDialogRef<R>`.

| Option | Type | Default | Description |
|---|---|---|---|
| `data` | `DataType` | `{}` | Data injected into the content component through `DIALOG_DATA`. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | — | Preset dialog size. |
| `width` | `string` | — | Explicit width; takes precedence over the preset size. |
| `minWidth` | `string` | — | Minimum dialog width. |
| `maxWidth` | `string` | — | Maximum dialog width. |
| `height` | `string` | — | Explicit dialog height. |
| `minHeight` | `string` | — | Minimum dialog height. |
| `maxHeight` | `string` | — | Maximum dialog height. |
| `panelClass` | `string \| string[]` | `'ngx-kit'` | Additional CSS class or classes for the dialog panel. |
| `backdropClass` | `string \| string[]` | `'ngx-dialog-backdrop'` | Additional CSS class or classes for the backdrop. |
| `header.enable` | `boolean` | `false` | Enables the automatic header. |
| `header.title` | `string` | — | Title displayed in the automatic header. |
| `header.showCloseButton` | `boolean` | — | Shows a close button in the automatic header. |
| `footer.enable` | `boolean` | `false` | Enables the automatic footer. |
| `footer.closeText` | `string` | — | Text for the automatic footer's close button. |
| `footer.align` | — | — | Alignment of the automatic footer content. |
| `closeOnOutsideClick` | `boolean` | `false` | Closes the dialog when the backdrop is clicked. |
| `closeOnEscape` | `boolean` | `true` | Closes the dialog when Escape is pressed. |
| `disableClose` | `boolean` | `false` | Disables automatic closing through Escape and outside clicks. |
| `beforeClose` | `() => boolean` | — | Synchronous guard for Escape and outside-click closing. Return `false` to prevent closing. |
| `autoFocus` | `boolean` | `true` | Enables automatic focus when the dialog opens. |
| `restoreFocus` | `boolean` | `true` | Restores focus to the previously focused element when the dialog closes. |
| `usePopover` | `boolean` | `true` | Enables Popover API integration when supported. |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | Accessibility role for the dialog. |
| `ariaLabel` | `string` | — | Accessible label for the dialog. |
| `ariaLabelledby` | `string` | — | ID of the element that labels the dialog. |
| `ariaDescribedby` | `string` | — | ID of the element that describes the dialog. |
| `animation` | `'zoom' \| 'fade' \| 'slide-up' \| 'none'` | `'zoom'` | Dialog opening and closing animation. |
| `injector` | `Injector` | — | Optional parent injector for the dialog content component. |

**Closing behavior:** `disableClose: true` disables both Escape and outside-click closing. `beforeClose` applies to those automatic close triggers, not to explicit calls to `dialogRef.close()`.

### `NgxDialogRef<R>`

The reference returned by `open()` provides programmatic control over the dialog.

| Member | Description |
|---|---|
| `close(result?)` | Closes the dialog and optionally supplies a result. Repeated calls are safely ignored. |
| `afterClosed` | An `Observable<R \| undefined>` that emits once after the dialog has been removed from the DOM. |
| `closing` | Read-only signal indicating whether the dialog is closing. |
| `closed` | Read-only signal indicating whether the dialog has closed. |
| `beforeClose` | The close guard, which can also be updated after the dialog opens. |

### Additional service methods

| Member | Description |
|---|---|
| `open(component, config?)` | Opens a component inside a dialog. |
| `confirm(options)` | Opens a confirmation dialog and returns an `Observable<boolean>`. |
| `alert(options)` | Opens an alert dialog and returns an `Observable<void>`. |
| `closeAll()` | Closes all currently open dialogs. |
| `openDialogs` | Read-only signal containing the currently open dialogs. |
| `openCount` | Read-only signal containing the number of currently open dialogs. |

## Theming, Dark Mode, and RTL

`ngx-kit/dialog` integrates with the theming and directionality behavior provided by `ngx-kit/overlay`.

- **Dark mode:** Uses the `light-dark()` CSS function where applicable.
- **RTL and LTR:** Respects the direction provided by the overlay's `DirectionService`.
- **Overlay behavior:** Backdrop handling, positioning, focus management, scroll locking, and optional Popover API integration remain the responsibility of `OverlayService`.

## Architecture

`ngx-kit/dialog` is a dialog-specific layer built on the shared overlay infrastructure.

- **`NgxDialogService`** — creates and manages dialogs, configuration, and injected data.
- **`NgxDialogRef`** — exposes the dialog lifecycle, close operation, and result stream.
- **`DIALOG_DATA` and `DIALOG_REF`** — provide access to dialog data and controls from the content component.
- **Dialog layout components and directives** — define the header, body, and footer.
- **`ngx-kit/overlay`** — owns shared overlay behavior and rendering.

This separation keeps dialog-specific functionality independent from the underlying positioning and overlay lifecycle implementation, while allowing both packages to evolve consistently.
