# ngx-kit/notify

Corner toast notifications, with a static API, automatic queueing (once the visible count exceeds the limit), and the timer pausing on hover.

## Install

```bash
npm install ngx-kit
```

## Setup

```ts
// app.config.ts
import { provideNotify } from 'ngx-kit/notify';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNotify({ timeout: 4000, position: 'top-center', dismissible: true }),
  ],
};
```

## Usage

```ts
import { Notify } from 'ngx-kit/notify';

Notify.success('Saved');
Notify.error('We couldn\'t send your message', 'Try again');
Notify.warning('Weak connection');
Notify.info('A new version is available', undefined, { timeout: 8000 });
```

## API

### `Notify`

| Method | Signature |
| --- | --- |
| `show(type, message, description?, options?)` | `type: 'info' \| 'success' \| 'warning' \| 'error'` |
| `info` / `success` / `warning` / `error` | `(message, description?, options?)` |

### `NgxNotifyOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `timeout` | `number` (ms) | `3000` | How long it's shown before auto-dismissing |
| `position` | `NgxNotifyPositionType` | `'top-center'` | Corner/center to display in |
| `maxVisible` | `number` | `10` | Beyond this count, notifications queue instead of overlapping |
| `allowHtml` | `boolean` | `false` | If `true`, the message is rendered as HTML (not sanitized) |
| `pauseOnHover` | `boolean` | `true` | The timer pauses while the mouse hovers |
| `dismissible` | `boolean` | `true` | Show a close button |
| `closeOnTap` | `boolean` | `true` | Clicking the notification itself closes it |

## Dark mode and RTL

Supported automatically.
