# ngx-kit/data-table

A signal-based data table with full type-safety: column and custom renderer definitions are typed so TypeScript itself catches invalid columns or a wrong `rendererInputs`. Single/multi-column sorting, pagination, lazy (server-side) mode, and column resizing via Pointer Capture.

## Install

```bash
npm install ngx-kit
```

## Registering renderers (optional, but recommended)

```ts
// app.config.ts
import { provideTable, defineRenderers } from 'ngx-kit/data-table';
import { AvatarCellRenderer, BooleanCellRenderer } from './cell-renderers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTable({
      renderers: defineRenderers({ avatar: AvatarCellRenderer, boolean: BooleanCellRenderer }),
      column: { minWidth: 80, maxWidth: 480, defaultWidth: 160 },
    }),
  ],
};
```

## Type-safe column definitions

```ts
interface Tenant {
  avatarUrl: string;
  name: string;
  isActive: boolean;
}

const renderers = defineRenderers({ avatar: AvatarCellRenderer, boolean: BooleanCellRenderer });

const fields = defineFields<Tenant, typeof renderers>(renderers, [
  { column: 'avatarUrl', title: 'User', renderer: 'avatar', rendererInputs: { showName: true } }, // ✅ type-checked
  { column: 'name', title: 'Name', sortable: true },
  { column: 'isActive', title: 'Active', renderer: 'boolean', align: 'center' },
]);
```

If `column` isn't a real field of `Tenant`, or `renderer` isn't a real key of the registry, or `rendererInputs` doesn't match that renderer's actual inputs — it's a compile error, not a runtime one.

## Usage in a template

```html
<ngx-table
  [fields]="fields"
  [data]="tenants"
  [totalRecords]="tenants.length"
  [pageSize]="20"
  (sortChange)="onSortChange($event)"
></ngx-table>
```

### Lazy mode (server-side pagination/sorting)

```html
<ngx-table [fields]="fields" [data]="page" [totalRecords]="total" [lazy]="true" (lazyLoad)="fetchPage($event)"></ngx-table>
```

```ts
fetchPage(ev: LazyLoadEvent<Tenant>) {
  // ev.pageIndex, ev.pageSize, ev.first, ev.sorts
  this.api.getTenants(ev).subscribe((res) => { this.page = res.data; this.total = res.total; });
}
```

## API

### `<ngx-table>` inputs

| Input | Type | Description |
| --- | --- | --- |
| `fields` | `TableField<T, R>[]` **(required)** | Column definitions (from `defineFields`) |
| `data` | `readonly T[]` **(required)** | Current page's data |
| `totalRecords` | `number` **(required)** | Total row count (for pagination) |
| `pageSize` | `number` | Defaults from `provideTable` |
| `lazy` | `boolean` | If `true`, your app manages sorting/pagination (not the table) |
| `loading` | `boolean` | Shows a loading state |
| `showRecordNumber` | `boolean` | Shows a row-number column |

### Outputs

| Output | Type | Description |
| --- | --- | --- |
| `sortChange` | `SortMeta<T>[]` | Sort change (non-lazy mode) |
| `lazyLoad` | `LazyLoadEvent<T>` | New page/sort (lazy mode) — includes `pageIndex`, `pageSize`, `first`, `sorts` |
| `columnResize` | `{ field: string; width: number }` | A column's width changed |

### Defining a custom renderer

```ts
@Component({
  standalone: true,
  selector: 'app-avatar-cell',
  template: `<img [src]="value()" /><span *ngIf="showName()">{{ row().name }}</span>`,
})
export class AvatarCellRenderer implements CellRendererComponent<string, Tenant> {
  value = input.required<string>();
  row = input.required<Tenant>();
  field = input.required<TableFieldBase<Tenant>>();
  showName = input(false); // automatically usable in rendererInputs for this column
}
```

## Dark mode and RTL

Supported automatically.
