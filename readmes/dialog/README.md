# ngx-kit/dialog

مودال/دیالوگ که کاملاً روی `ngx-kit/overlay` سوار شده - نه `<dialog>` بومی (پشتیبانی مرورگرها)، نه یک استک DOM جدا برای هر دیالوگ. تمام رفتار مشترک (بک‌دراپ، وسط‌چین کردن، فوکوس‌تِرپ، بستن با Escape/کلیک بیرون، قفل اسکرول صفحه، رندر در top layer با Popover API) از `OverlayService` می‌آید؛ این ماژول فقط لایه‌ی «دیالوگ» رو روش اضافه می‌کنه: کانفیگ، تزریق داده، هدر/بادی/فوتر، و یک دیالوگ تایید/اعلان آماده.

هر بیلدینگ‌بلاک (پنل، دایرکتیوهای هدر/فوتر/بادی، دیالوگ تایید) کاملاً **standalone** و **signal-based** است - بدون NgModule، بدون `ChangeDetectorRef.detectChanges()` دستی، سازگار با zoneless.

## نصب و راه‌اندازی

```bash
npm install ngx-kit
```

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxDialog } from 'ngx-kit/dialog';

export const appConfig: ApplicationConfig = {
  providers: [provideNgxDialog()],
};
```

## باز کردن یک دیالوگ

با API استاتیک (بدون نیاز به inject دستی):

```ts
import { Dialog } from 'ngx-kit/dialog';

const ref = Dialog.open<{ saved: boolean }>(EditUserComponent, {
  data: { userId: 42 },
  size: 'md',
  header: { enable: true, title: 'ویرایش کاربر' },
});

ref.afterClosed.subscribe((result) => console.log('نتیجه:', result));
```

یا با تزریق مستقیم سرویس (توصیه‌شده برای SSR - پایین‌تر ببینید):

```ts
private dialog = inject(NgxDialogService);
this.dialog.open(EditUserComponent, { data: { userId: 42 } });
```

داخل کامپوننت محتوای دیالوگ:

```ts
@Component({ standalone: true, ... })
export class EditUserComponent {
  private ref = inject<NgxDialogRef<{ saved: boolean }>>(DIALOG_REF);
  data = inject<{ userId: number }>(DIALOG_DATA);

  save() {
    this.ref.close({ saved: true });
  }
}
```

### دایرکتیوهای layout داخل کامپوننت محتوا

```html
<div *ngxDialogHeader>عنوان سفارشی</div>
<div *ngxDialogBody>محتوای اصلی، اسکرول‌پذیر</div>
<div *ngxDialogFooter align="end">
  <button (click)="save()">ذخیره</button>
</div>
```

یا به‌جای نوشتن این‌ها دستی، از هدر/فوتر خودکار استفاده کنید (بخش API رو ببینید) - اما هر دو رو با هم استفاده نکنید.

## API

### `NgxDialogService.open<R, DataType>(component, config?)` / `Dialog.open(...)`

| فیلد `config`                                      | نوع                                        | پیش‌فرض                               | توضیح                                                                             |
| -------------------------------------------------- | ------------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------- |
| `data`                                             | `DataType`                                 | `{}`                                  | از طریق `DIALOG_DATA` به کامپوننت محتوا می‌رسه                                    |
| `size`                                             | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`   | -                                     | یک پریست عرض/ماکس-عرض                                                             |
| `width` / `minWidth` / `maxWidth`                  | `string`                                   | -                                     | اندازه‌ی دستی (روی پریست `size` اولویت داره)                                      |
| `height` / `minHeight` / `maxHeight`               | `string`                                   | -                                     |                                                                                   |
| `panelClass` / `backdropClass`                     | `string \| string[]`                       | `'ngx-kit'` / `'ngx-dialog-backdrop'` | کلاس اضافه روی پنل/بک‌دراپ                                                        |
| `header.enable` / `.title` / `.showCloseButton`    | -                                          | `false`                               | هدر خودکار (اگه خودتون `*ngxDialogHeader` بذارید، این رو فعال نکنید)              |
| `footer.enable` / `.closeText` / `.align`          | -                                          | `false`                               | فوتر خودکار با یک دکمه‌ی بستن                                                     |
| `closeOnOutsideClick`                              | `boolean`                                  | `false`                               | کلیک بیرون از پنل ببندتش                                                          |
| `closeOnEscape`                                    | `boolean`                                  | `true`                                | Escape ببندتش                                                                     |
| `disableClose`                                     | `boolean`                                  | `false`                               | معادل ست کردن هر دوی بالا روی `false` - فقط با کد قابل بسته‌شدنه                  |
| `beforeClose`                                      | `() => boolean`                            | -                                     | گارد سینک قبل از بسته‌شدن با Escape/کلیک بیرون (نه برای `dialogRef.close()` دستی) |
| `lockBodyScroll`                                   | `boolean`                                  | `true`                                | جلوگیری از اسکرول صفحه‌ی پشت دیالوگ                                               |
| `autoFocus` / `restoreFocus`                       | `boolean`                                  | `true`                                |                                                                                   |
| `usePopover`                                       | `boolean`                                  | `true`                                | رندر با Popover API (fallback خودکار در مرورگرهای قدیمی)                          |
| `role`                                             | `'dialog' \| 'alertdialog'`                | `'dialog'`                            |                                                                                   |
| `ariaLabel` / `ariaLabelledby` / `ariaDescribedby` | `string`                                   | -                                     |                                                                                   |
| `animation`                                        | `'zoom' \| 'fade' \| 'slide-up' \| 'none'` | `'zoom'`                              |                                                                                   |
| `injector`                                         | `Injector`                                 | -                                     | Injector والد برای کامپوننت محتوا                                                 |

### `NgxDialogRef<R>`

| عضو                  | توضیح                                                                |
| -------------------- | -------------------------------------------------------------------- |
| `close(result?)`     | دیالوگ رو می‌بنده؛ ایمن در برابر فراخوانی تکراری                     |
| `afterClosed`        | `Observable<R \| undefined>` - دقیقاً یک‌بار، بعد از حذف کامل از DOM |
| `closing` / `closed` | سیگنال‌های `boolean` برای وضعیت لحظه‌ای                              |
| `beforeClose`        | همون گارد بالا؛ می‌تونید بعد از باز شدن هم عوضش کنید                 |

### `NgxDialogService`

| عضو                         | توضیح                                            |
| --------------------------- | ------------------------------------------------ |
| `open(component, config?)`  | دیالوگ رو باز می‌کنه، `NgxDialogRef` برمی‌گردونه |
| `confirm(options)`          | `Observable<boolean>`                            |
| `alert(options)`            | `Observable<void>`                               |
| `closeAll()`                | همه‌ی دیالوگ‌های باز رو می‌بنده                  |
| `openDialogs` / `openCount` | سیگنال‌های ریدانلی برای دیالوگ‌های باز فعلی      |

## نکته‌ی SSR

`Dialog.open(...)` یک نمونه‌ی استاتیک/global نگه می‌داره که برای یک اپ مرورکری معمولی کاملاً امنه. اگه از Angular SSR استفاده می‌کنید، این نمونه‌ی استاتیک بین درخواست‌های هم‌زمان سرور مشترکه - به‌جای API استاتیک، مستقیماً `NgxDialogService` رو inject کنید (که per-injector/per-request امنه). `provideNgxDialog()` عمداً روی سرور این نمونه‌ی استاتیک رو ست نمی‌کنه تا این باگ به‌جای رخ‌دادن خاموش، فوراً با خطای «service not initialized» مشخص بشه.

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه (`light-dark()` + جهت از طریق `DirectionService` که `ngx-kit/overlay` براش استفاده می‌کنه).
