# ngx-kit/data-table

جدول داده‌ی سیگنال‌محور با تایپ‌سیفتیِ کامل: تعریف ستون‌ها و رندررهای سفارشی طوری تایپ شدن که TypeScript خودش جلوی ستون‌های نامعتبر یا `rendererInputs` غلط رو می‌گیره. سورت (تک/چندستونه)، صفحه‌بندی، حالت lazy (سمت سرور)، و ریسایز ستون با Pointer Capture.

## نصب

```bash
npm install ngx-kit
```

## راه‌اندازی رندررها (اختیاری، ولی توصیه‌شده)

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

## تعریفِ type-safe ستون‌ها

```ts
interface Tenant {
  avatarUrl: string;
  name: string;
  isActive: boolean;
}

const renderers = defineRenderers({ avatar: AvatarCellRenderer, boolean: BooleanCellRenderer });

const fields = defineFields<Tenant, typeof renderers>(renderers, [
  { column: 'avatarUrl', title: 'کاربر', renderer: 'avatar', rendererInputs: { showName: true } }, // ✅ تایپ‌چک می‌شه
  { column: 'name', title: 'نام', sortable: true },
  { column: 'isActive', title: 'فعال', renderer: 'boolean', align: 'center' },
]);
```

اگه `column` یه فیلدِ واقعیِ `Tenant` نباشه، یا `renderer` یه کلیدِ واقعیِ رجیستری نباشه، یا `rendererInputs` با ورودی‌های واقعیِ اون رندرر هم‌خونی نداشته باشه — کامپایل خطا می‌ده، نه فقط runtime.

## استفاده در تمپلیت

```html
<ngx-table
  [fields]="fields"
  [data]="tenants"
  [totalRecords]="tenants.length"
  [pageSize]="20"
  (sortChange)="onSortChange($event)"></ngx-table>
```

### حالت lazy (صفحه‌بندی/سورت سمت سرور)

```html
<ngx-table
  [fields]="fields"
  [data]="page"
  [totalRecords]="total"
  [lazy]="true"
  (lazyLoad)="fetchPage($event)"></ngx-table>
```

```ts
fetchPage(ev: LazyLoadEvent<Tenant>) {
  // ev.pageIndex, ev.pageSize, ev.first, ev.sorts
  this.api.getTenants(ev).subscribe((res) => { this.page = res.data; this.total = res.total; });
}
```

## API

### ورودی‌های `<ngx-table>`

| ورودی              | نوع                               | توضیح                                                         |
| ------------------ | --------------------------------- | ------------------------------------------------------------- |
| `fields`           | `TableField<T, R>[]` **(اجباری)** | تعریفِ ستون‌ها (از `defineFields`)                            |
| `data`             | `readonly T[]` **(اجباری)**       | دیتای صفحه‌ی جاری                                             |
| `totalRecords`     | `number` **(اجباری)**             | تعداد کل ردیف‌ها (برای صفحه‌بندی)                             |
| `pageSize`         | `number`                          | پیش‌فرض از `provideTable`                                     |
| `lazy`             | `boolean`                         | اگه `true`، سورت/صفحه‌بندی رو خودِ اپ مدیریت می‌کنه (نه جدول) |
| `loading`          | `boolean`                         | نمایش وضعیتِ بارگذاری                                         |
| `showRecordNumber` | `boolean`                         | نمایش ستونِ شماره‌ی ردیف                                      |

### خروجی‌ها

| خروجی          | نوع                                | توضیح                                                                         |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `sortChange`   | `SortMeta<T>[]`                    | تغییرِ سورت (حالت غیر-lazy)                                                   |
| `lazyLoad`     | `LazyLoadEvent<T>`                 | صفحه/سورتِ جدید (حالت lazy) — شاملِ `pageIndex`, `pageSize`, `first`, `sorts` |
| `columnResize` | `{ field: string; width: number }` | تغییرِ عرضِ ستون                                                              |

### تعریفِ یه رندررِ سفارشی

```ts
@Component({
  standalone: true,
  selector: 'app-avatar-cell',
  template: `
    <img [src]="value()" />
    <span *ngIf="showName()">{{ row().name }}</span>
  `,
})
export class AvatarCellRenderer implements CellRendererComponent<string, Tenant> {
  value = input.required<string>();
  row = input.required<Tenant>();
  field = input.required<TableFieldBase<Tenant>>();
  showName = input(false); // این خودکار به rendererInputs اضافه می‌شه
}
```

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
