# ngx-kit/notify

نوتیفیکیشن/toast گوشه‌ی صفحه، با API استاتیک، صف‌بندیِ خودکار (وقتی تعداد از حد مجاز بیشتر بشه)، و مکث‌کردنِ تایمر روی هاور.

## نصب

```bash
npm install ngx-kit
```

## راه‌اندازی

```ts
// app.config.ts
import { provideNotify } from 'ngx-kit/notify';

export const appConfig: ApplicationConfig = {
  providers: [provideNotify({ timeout: 4000, position: 'top-center', dismissible: true })],
};
```

## استفاده

```ts
import { Notify } from 'ngx-kit/notify';

Notify.success('ذخیره شد');
Notify.error('پیام رو نتونستیم ارسال کنیم', 'دوباره تلاش کنید');
Notify.warning('اتصال ضعیف است');
Notify.info('نسخه‌ی جدید موجوده', undefined, { timeout: 8000 });
```

## API

### `Notify`

| متد                                           | امضا                                                |
| --------------------------------------------- | --------------------------------------------------- |
| `show(type, message, description?, options?)` | `type: 'info' \| 'success' \| 'warning' \| 'error'` |
| `info` / `success` / `warning` / `error`      | `(message, description?, options?)`                 |

### `NgxNotifyOptions`

| فیلد           | نوع                     | پیش‌فرض        | توضیح                                                      |
| -------------- | ----------------------- | -------------- | ---------------------------------------------------------- |
| `timeout`      | `number` (ms)           | `3000`         | مدتِ نمایش قبل از بسته‌شدنِ خودکار                         |
| `position`     | `NgxNotifyPositionType` | `'top-center'` | گوشه/مرکزِ نمایش                                           |
| `maxVisible`   | `number`                | `10`           | بیشتر از این تعداد صف می‌شن، نه هم‌پوشانی                  |
| `allowHtml`    | `boolean`               | `false`        | اگه `true`، پیام به‌عنوان HTML رندر می‌شه (سنیتایز نمی‌شه) |
| `pauseOnHover` | `boolean`               | `true`         | تایمر با هاور موس متوقف می‌شه                              |
| `dismissible`  | `boolean`               | `true`         | نمایشِ دکمه‌ی بستن                                         |
| `closeOnTap`   | `boolean`               | `true`         | با کلیک روی خودِ نوتیفیکیشن بسته بشه                       |

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
