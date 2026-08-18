# ngx-kit/dropzone

A standalone Angular dropzone with file validation, previews, recursive folder support, keyboard accessibility, and a production-ready upload pipeline.

The upload layer is intentionally decoupled from the UI. The component only knows about `NgxDropzoneUploadService`, so applications can use the default Angular `HttpClient` implementation or replace it with Axios, `fetch`, tus, S3 multipart, or any custom transport.

## Features

- Drag & drop and file-picker selection
- MIME, wildcard MIME and extension validation
- Maximum file size and maximum file count
- Recursive folder traversal when the browser exposes `webkitGetAsEntry`
- Image previews with `URL.revokeObjectURL` cleanup
- Keyboard accessible dropzone
- Signal-based Angular component with `OnPush`
- Automatic or manual uploads
- Configurable multipart field alias
- Configurable upload URL
- Configurable parallel upload limit
- Per-file upload progress
- Per-file success/error state
- Retry failed uploads
- Cancel an active upload by removing the file
- Optional multipart fields, headers and credentials
- Pluggable upload adapter through an `InjectionToken`

## Basic selection

```html
<ngx-dropzone
  [accept]="'image/*,.pdf'"
  [multiple]="true"
  [maxFileSize]="5 * 1024 * 1024"
  [maxFiles]="10"
  (filesAdded)="onFilesAdded($event)"
  (filesRejected)="onFilesRejected($event)">
  Drop files here or click to browse
</ngx-dropzone>
```

## Automatic upload

When `autoUpload` is enabled, every newly accepted file is queued immediately.

```html
<ngx-dropzone
  [accept]="'image/*,.pdf'"
  [uploadUrl]="'/api/files/upload'"
  [uploadAlias]="'file'"
  [autoUpload]="true"
  [maxParallel]="3">
  Drop files here or click to browse
</ngx-dropzone>
```

For example, the browser sends a multipart request equivalent to:

```text
POST /api/files/upload
Content-Type: multipart/form-data

file=<selected file>
```

`maxParallel="3"` means at most three upload requests are active at the same time. Additional files remain in an internal FIFO queue.

## Manual upload: one "Upload all" button

This is the default manual mode.

```html
<ngx-dropzone
  [uploadUrl]="'/api/files/upload'"
  [uploadAlias]="'files'"
  [autoUpload]="false"
  [uploadMode]="'all'"
  [maxParallel]="4"></ngx-dropzone>
```

The component renders an **Upload all** button. Clicking it queues every pending file. `maxParallel` still controls the number of concurrent requests.

## Manual upload: one button per file

```html
<ngx-dropzone
  [uploadUrl]="'/api/files/upload'"
  [uploadAlias]="'file'"
  [autoUpload]="false"
  [uploadMode]="'single'"
  [maxParallel]="2"></ngx-dropzone>
```

Each pending row gets its own **Upload** button. The user can decide which files enter the upload queue.

## Extra multipart fields

```html
<ngx-dropzone
  [uploadUrl]="'/api/files/upload'"
  [uploadAlias]="'file'"
  [uploadData]="{
    tenantId: 'abc',
    folderId: 123,
    isPublic: false
  }"></ngx-dropzone>
```

Every request contains the selected file plus those multipart fields.

## Headers and credentials

```html
<ngx-dropzone
  [uploadUrl]="'https://api.example.com/files'"
  [uploadHeaders]="{
    'X-Tenant-Id': 'abc',
    'X-Upload-Source': 'ngx-dropzone'
  }"
  [uploadWithCredentials]="true"></ngx-dropzone>
```

Authentication headers that are already added by an Angular `HttpInterceptor` do not need to be supplied here.

## Upload lifecycle

Each file has one of these states:

```text
pending -> uploading -> uploaded
                  \
                   -> error -> retry -> uploading
```

Removing a file while it is uploading unsubscribes from the upload observable. With the default `HttpClient` adapter this cancels the underlying HTTP request.

Every row displays:

- current status
- upload percentage
- progress bar
- upload/retry action when appropriate
- remove action

## Outputs

| Output           | Payload                          | Description                   |
| ---------------- | -------------------------------- | ----------------------------- |
| `filesAdded`     | `File[]`                         | Newly accepted files          |
| `filesRejected`  | `NgxDropzoneRejectedFile[]`      | Files rejected by validation  |
| `filesChange`    | `File[]`                         | Current selected files        |
| `uploadStarted`  | `NgxDropzoneFile`                | A file started uploading      |
| `uploadProgress` | `NgxDropzoneUploadProgressEvent` | Progress update               |
| `uploadSuccess`  | `NgxDropzoneFile`                | Upload completed successfully |
| `uploadError`    | `{ item, error }`                | Upload failed                 |

Example:

```html
<ngx-dropzone
  [uploadUrl]="'/api/files'"
  [autoUpload]="true"
  [maxParallel]="3"
  (uploadProgress)="onUploadProgress($event)"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)"></ngx-dropzone>
```

## Upload contracts

The upload boundary is defined by:

```ts
NgxDropzoneUploadService;
NgxDropzoneUploadRequest;
NgxDropzoneUploadEvent;
```

The service returns an `Observable`. It emits progress events and finally a response event.

This is important: **the component does not depend on `HttpClient`**.

## Default Angular HttpClient adapter

The library ships with `NgxDropzoneHttpUploadService`.

It uses:

- `HttpClient.post`
- `FormData`
- `reportProgress: true`
- `observe: 'events'`

The default adapter is connected through:

```ts
NGX_DROPZONE_UPLOAD_SERVICE;
```

The token has a default factory, so normal applications do not need to configure anything.

Make sure your application provides Angular's HTTP client:

```ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig = {
  providers: [provideHttpClient()],
};
```

## Replacing HttpClient with Axios

You can completely replace the transport without changing the dropzone component.

```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';

import {
  NgxDropzoneUploadEvent,
  NgxDropzoneUploadRequest,
  NgxDropzoneUploadService,
} from 'ngx-kit';

@Injectable()
export class AxiosDropzoneUploadService implements NgxDropzoneUploadService {
  upload<TResponse = unknown>(
    request: NgxDropzoneUploadRequest,
  ): Observable<NgxDropzoneUploadEvent<TResponse>> {
    return new Observable((subscriber) => {
      const controller = new AbortController();

      const form = new FormData();
      form.append(request.alias, request.file, request.file.name);

      for (const [key, value] of Object.entries(request.data ?? {})) {
        form.append(key, value instanceof Blob ? value : String(value));
      }

      axios
        .post<TResponse>(request.url, form, {
          headers: request.headers,
          withCredentials: request.withCredentials,
          signal: controller.signal,
          onUploadProgress: (event) => {
            const total = event.total;
            subscriber.next({
              type: 'progress',
              loaded: event.loaded,
              total,
              percent: total ? Math.min(100, Math.round((event.loaded / total) * 100)) : 0,
            });
          },
        })
        .then((response) => {
          subscriber.next({
            type: 'response',
            response: response.data,
            status: response.status,
          });
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));

      return () => controller.abort();
    });
  }
}
```

Then override the token:

```ts
import { NGX_DROPZONE_UPLOAD_SERVICE } from 'ngx-kit';

export const appConfig = {
  providers: [
    {
      provide: NGX_DROPZONE_UPLOAD_SERVICE,
      useClass: AxiosDropzoneUploadService,
    },
  ],
};
```

This keeps the dropzone UI independent from the HTTP library.

## Custom adapter at component level

You can also replace the adapter for a specific dropzone:

```ts
@Component({
  // ...
  providers: [
    {
      provide: NGX_DROPZONE_UPLOAD_SERVICE,
      useClass: AxiosDropzoneUploadService,
    },
  ],
})
export class MyUploaderComponent {}
```

This is useful when one part of an application uses a different upload backend.

## Configuration API

| Input                   | Type                                 | Default   | Description                        |
| ----------------------- | ------------------------------------ | --------- | ---------------------------------- |
| `accept`                | `string`                             | `''`      | MIME/extension filters             |
| `multiple`              | `boolean`                            | `true`    | Allow multiple files               |
| `maxFileSize`           | `number`                             | unlimited | Maximum size per file in bytes     |
| `maxFiles`              | `number`                             | unlimited | Maximum number of files            |
| `disabled`              | `boolean`                            | `false`   | Disable interaction                |
| `showFileList`          | `boolean`                            | `true`    | Show selected files                |
| `uploadUrl`             | `string`                             | `''`      | Upload endpoint                    |
| `uploadAlias`           | `string`                             | `'file'`  | Multipart file field name          |
| `autoUpload`            | `boolean`                            | `false`   | Automatically queue accepted files |
| `maxParallel`           | `number`                             | `3`       | Maximum simultaneous uploads       |
| `uploadMode`            | `'all' \| 'single'`                  | `'all'`   | Manual upload UI behavior          |
| `uploadData`            | `Record<string, ...>`                | `{}`      | Extra multipart fields             |
| `uploadHeaders`         | `Record<string, string \| string[]>` | `{}`      | Extra request headers              |
| `uploadWithCredentials` | `boolean`                            | `false`   | Send credentials                   |

## Tests

The upload implementation is covered at two levels.

### HTTP adapter tests

`ngx-dropzone-upload.spec.ts` verifies:

- multipart file alias
- extra form data
- POST request
- upload progress calculation
- final response event

### Component upload tests

`dropzone-upload.spec.ts` verifies:

- automatic upload
- `maxParallel` concurrency
- queued uploads starting after a slot is released
- per-file manual upload
- progress propagation
- failed upload state
- retry UI

The existing `file-matching.spec.ts` continues to cover file type/extension matching and byte formatting.

## Design decisions

### Why an `InjectionToken`?

The dropzone should not be coupled to a transport library.

Bad:

```ts
class Dropzone {
  constructor(private http: HttpClient) {}
}
```

Better:

```ts
class Dropzone {
  constructor(
    @Inject(NGX_DROPZONE_UPLOAD_SERVICE)
    private uploader: NgxDropzoneUploadService,
  ) {}
}
```

Now the UI depends on a small capability (`upload`) instead of Angular `HttpClient`.

### Why an Observable?

An upload is a stream of events rather than a single value:

```text
progress -> progress -> progress -> response
```

It also gives custom adapters a clean cancellation mechanism: unsubscribing from the observable cancels the transport.

### Why `maxParallel` is handled by the component

The upload adapter is responsible for **one file**.

The dropzone is responsible for **orchestration**:

```text
Files
  |
  +-- pending queue
  |
  +-- upload #1
  +-- upload #2
  +-- upload #3
  |
  +-- pending queue...
```

This keeps the adapter simple and lets every transport share the same concurrency behavior.

## Existing behavior retained

The upload feature is layered on top of the existing selection implementation. File acceptance, maximum size/count validation, recursive directory traversal, keyboard interaction, previews, and preview URL cleanup remain part of the component.

## Accessibility

The dropzone remains keyboard accessible through Enter/Space. Upload progress uses the ARIA `progressbar` role and exposes the current percentage.

## Dark mode and RTL

The existing CSS uses logical properties and `light-dark()`, so RTL and dark/light themes continue to work automatically.
