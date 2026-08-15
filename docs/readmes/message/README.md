# ngx-kit/message

Alert/confirm dialogs (SweetAlert-style), with a static API callable from anywhere in the app.

## Install

```bash
npm install ngx-kit
```

## Setup

```ts
// app.config.ts
import { provideMessage } from 'ngx-kit/message';

export const appConfig: ApplicationConfig = {
  providers: [provideMessage({ confirmButtonText: 'OK' /* global defaults */ })],
};
```

## Usage

```ts
import { MSG } from 'ngx-kit/message';

MSG.success('Saved!', 'Your changes were saved successfully.');
MSG.error('Error', 'Something went wrong.');
MSG.warning('Warning', 'Are you sure?');
MSG.info('Heads up', 'This is an informational message.');
MSG.question('Question', 'Continue?');
MSG.loading('Processing…');

// full control over options:
const result = MSG.show({
  title: 'Delete this?',
  text: 'This action cannot be undone.',
  showCancelButton: true,
  showDenyButton: true,
  confirmButtonText: 'Yes, delete it',
});
result.afterClose.subscribe((r) => console.log(r));
```

## API

### `MSG` (and its alias `Modal`)

| Method | Signature | Description |
| --- | --- | --- |
| `show(options?)` | `IMessageOptions` | Full control |
| `info` / `success` / `warning` / `error` / `question` / `loading` | `(title, text?, options?)` | Common shortcuts |

### `IMessageOptions` (key fields)

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `title` / `text` / `html` | `string` | | Content (`html` is not sanitized — escaping is your responsibility) |
| `icon` | `MessageIcon` | | Icon shown |
| `showConfirmButton` / `showDenyButton` / `showCancelButton` | `boolean` | `true` / `false` / `false` | |
| `confirmButtonText` / `denyButtonText` / `cancelButtonText` | `string` | `'OK'` / `'No'` / `'Cancel'` | |
| `allowOutsideClick` / `allowEscapeKey` / `allowEnterKey` | `boolean` | `true` | How the message can be dismissed |
| `showCloseButton` | `boolean` | `false` | The ✕ button |
| `useOverlay` | `boolean` | | For when it's used inside another dialog (e.g. Angular Material), raises the display layer to the top |

If several messages are open at once, Escape/Enter only affect the **last (topmost) message**, not all of them.

## Dark mode and RTL

Supported automatically.
