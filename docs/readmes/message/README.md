# ngx-kit/message

دیالوگ‌های alert/confirm (شبیه SweetAlert)، با API استاتیک قابل‌فراخوانی از هرجای اپ.

## نصب

```bash
npm install ngx-kit
```

## راه‌اندازی

``` typescript
// app.config.ts
import { provideMessage } from 'ngx-kit/message';

export const appConfig: ApplicationConfig = {
  providers: [provideMessage({ confirmButtonText: 'باشه' /* پیش‌فرض‌های سراسری */ })],
};
```

## استفاده

```ts
import { MSG } from 'ngx-kit/message';

MSG.success('ذخیره شد!', 'تغییرات با موفقیت ثبت شدن.');
MSG.error('خطا', 'مشکلی پیش اومد.');
MSG.warning('هشدار', 'مطمئنید؟');
MSG.info('اطلاع', 'این یه پیامِ اطلاعاتیه.');
MSG.question('سؤال', 'ادامه بدیم؟');
MSG.loading('در حال پردازش…');

// کنترلِ کامل روی گزینه‌ها:
const result = MSG.show({
  title: 'حذف شود؟',
  text: 'این عمل قابل بازگشت نیست.',
  showCancelButton: true,
  showDenyButton: true,
  confirmButtonText: 'بله، حذف کن',
});
result.afterClose.subscribe((r) => console.log(r));
```

## API

### `MSG` (و alias آن `Modal`)

| متد                                                               | امضا                       | توضیح           |
| ----------------------------------------------------------------- | -------------------------- | --------------- |
| `show(options?)`                                                  | `IMessageOptions`          | کنترلِ کامل     |
| `info` / `success` / `warning` / `error` / `question` / `loading` | `(title, text?, options?)` | میان‌برهای رایج |

### `IMessageOptions` (مهم‌ترین فیلدها)

| فیلد                                                        | نوع           | پیش‌فرض                      | توضیح                                                                                                             |
| ----------------------------------------------------------- | ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `title` / `text` / `html`                                   | `string`      |                              | محتوا (`html` سنیتایز نمی‌شه — مسئولیتِ escape با خودتونه)                                                        |
| `icon`                                                      | `MessageIcon` |                              | آیکونِ نمایشی                                                                                                     |
| `showConfirmButton` / `showDenyButton` / `showCancelButton` | `boolean`     | `true` / `false` / `false`   |                                                                                                                   |
| `confirmButtonText` / `denyButtonText` / `cancelButtonText` | `string`      | `'OK'` / `'No'` / `'Cancel'` |                                                                                                                   |
| `allowOutsideClick` / `allowEscapeKey` / `allowEnterKey`    | `boolean`     | `true`                       | نحوه‌ی بستنِ پیام                                                                                                 |
| `showCloseButton`                                           | `boolean`     | `false`                      | دکمه‌ی ✕                                                                                                          |
| `useOverlay`                                                | `boolean`     |                              | برای وقتی که داخل یه دیالوگِ دیگه (مثلاً Angular Material) استفاده می‌شه، لایه‌ی نمایشی رو به بالاترین سطح می‌بره |

اگه چند پیام هم‌زمان باز باشن، Escape/Enter فقط روی **آخرین (بالاترین) پیام** اثر می‌کنه، نه همه‌شون.

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
