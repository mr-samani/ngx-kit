# ngx-kit/dialog

مودال/دیالوگ روی پایه‌ی `<dialog>` بومیِ مرورگر — بدون overlay دستی، بدون کتابخونه‌ی جانبی.

> ⚠️ اگه نسخه‌ی قبلیِ این README رو دیدید که از `DIALOG_REF` یا `ngx-dialog-header` یا پکیج جدای `ngx-dialog` حرف می‌زد — اون مال یه نسخه‌ی خیلی قدیمی‌تر بوده و با API فعلی هم‌خونی نداره. این نسخه به‌روزه.

## نصب

```bash
npm install ngx-kit
```

## راه‌اندازی

```ts
// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxDialogModule } from 'ngx-kit/dialog';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(NgxDialogModule)],
};
```

## باز کردن یه دیالوگ

با API استاتیک (بدون تزریق دستیِ سرویس):

```ts
import { Dialog } from 'ngx-kit/dialog';

const ref = Dialog.open(MyDialogComponent, {
  data: { userId: 42 },
  width: '480px',
  allowCloseOnOutsideClick: true,
  header: { enable: true, title: 'ویرایش کاربر', showCloseButton: true },
});

ref.afterClosed.subscribe((result) => console.log('نتیجه:', result));
```

داخل کامپوننتِ دیالوگ:

```ts
@Component({ ... })
export class MyDialogComponent {
  private ref = inject(NgxDialogRef);
  data = inject(NGX_DIALOG_DATA); // دیتایی که با config.data پاس داده شده

  save() {
    this.ref.close({ saved: true });
  }
}
```

### دایرکتیوهای layout داخل دیالوگ

```html
<div *ngxDialogHeader>عنوانِ سفارشی</div>
<div *ngxDialogBody>محتوای اصلی</div>
<div *ngxDialogFooter>
  <button (click)="save()">ذخیره</button>
</div>
```

## API

### `Dialog.open<T>(component, config?)`

| فیلدِ `config`                                              | نوع        | پیش‌فرض     | توضیح                                              |
| ----------------------------------------------------------- | ---------- | ----------- | -------------------------------------------------- |
| `data`                                                      | `T`        | `{}`        | دیتایی که به کامپوننتِ داخلِ دیالوگ پاس داده می‌شه |
| `allowCloseOnOutsideClick`                                  | `boolean`  | `false`     | بستن با کلیک روی backdrop                          |
| `containerClass`                                            | `string`   | `'ngx-kit'` | کلاسِ اضافی روی container                          |
| `header.enable` / `header.title` / `header.showCloseButton` |            |             | تنظیمات هدرِ پیش‌فرض                               |
| `footer.enable`                                             | `boolean`  |             | نمایش فوتر پیش‌فرض                                 |
| `width` / `minWidth` / `maxWidth`                           | `string`   |             | ابعاد افقی                                         |
| `height` / `minHeight` / `maxHeight`                        | `string`   |             | ابعاد عمودی                                        |
| `injector`                                                  | `Injector` |             | تزریق‌کننده‌ی سفارشی برای کامپوننتِ داخلی          |

### `NgxDialogRef`

| عضو                            | توضیح                                     |
| ------------------------------ | ----------------------------------------- |
| `close(result?)`               | بستن دیالوگ، با ارسال یه نتیجه‌ی اختیاری  |
| `afterClosed: Observable<any>` | با `result` صدا زده می‌شه بعد از بسته‌شدن |

## نکته‌ی SSR

`Dialog.open(...)` یه API استاتیک/سراسریه که برای اپ‌های معمولیِ مرورگری کاملاً امنه. اگه از Angular SSR استفاده می‌کنید، این static instance بینِ درخواست‌های هم‌زمانِ سرور مشترکه — به‌جای API استاتیک، مستقیماً `NgxOverlayService` رو تزریق و ازش استفاده کنید (که per-injector/per-request امنه).

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه (`light-dark()` + CSS logical properties).
