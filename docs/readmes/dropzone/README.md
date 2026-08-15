# ngx-kit/dropzone

A file drag-and-drop area: type/size/count validation, image previews, recursive folder traversal (when a user drags a folder), and full keyboard accessibility.

## Install

```bash
npm install ngx-kit
```

## Usage

```html
<ngx-dropzone
  [accept]="'image/*,.pdf'"
  [multiple]="true"
  [maxFileSize]="5 * 1024 * 1024"
  [maxFiles]="10"
  (filesAdded)="onFilesAdded($event)"
  (filesRejected)="onFilesRejected($event)"
>
  Drop files here or click to browse
</ngx-dropzone>
```

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string` | `''` | Like `input[type=file]`: `"image/*"`, `".pdf,.docx"`, or a comma-separated combination |
| `multiple` | `boolean` | `true` | Allow selecting multiple files |
| `maxFileSize` | `number` (bytes) | unlimited | Max size per file |
| `maxFiles` | `number` | unlimited | Max number of allowed files |
| `disabled` | `boolean` | `false` | |
| `showFileList` | `boolean` | `true` | Show the list/preview of selected files inside the component itself |

| Output | Type | Description |
| --- | --- | --- |
| `filesAdded` | `File[]` | Newly accepted files |
| `filesRejected` | `{ file: File; reason: 'type' \| 'size' \| 'count' }[]` | Rejected files and why |
| `filesChange` | `File[]` | The full current list, after every change (add or remove) |

### Custom icon

```html
<ngx-dropzone>
  <svg dropzone-icon>...</svg>
  Your own text
</ngx-dropzone>
```

## Technical notes

- An enter/leave counter prevents the "dragging" state from flickering as the pointer passes over children inside the drop area.
- Dropping a **folder** is also supported (`webkitGetAsEntry` + recursive traversal) — browsers without support fall back to grabbing files directly.
- Preview object URLs are automatically `revokeObjectURL`'d when a file is removed or the component is destroyed (no memory leak).

## Dark mode and RTL

Supported automatically.
