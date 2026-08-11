# ngx-kit/gradient-picker

انتخاب‌گر گرادیانِ خطی/شعاعی با چند color-stop قابل‌درگ، خروجیِ رشته‌ی CSS آماده‌ی استفاده.

## نصب

```bash
npm install ngx-kit
```

## استفاده

```html
<ngx-input-gradient [(ngModel)]="gradientCss"></ngx-input-gradient>
```

یا به‌عنوان دایرکتیو روی یه input معمولی:

```html
<input type="text" [ngxInputGradient]="gradientCss" (change)="gradientCss = $event" />
```

مقدار خروجی یه رشته‌ی معتبرِ CSS مثل `linear-gradient(90deg, #ff0000 0%, #0000ff 100%)` هست که مستقیم توی `background`/`background-image` قابل‌استفاده‌ست.

## API

| ورودی                             | نوع                           | پیش‌فرض  | توضیح                                                   |
| --------------------------------- | ----------------------------- | -------- | ------------------------------------------------------- |
| `theme`                           | `'light' \| 'dark' \| 'auto'` | `'auto'` | تمِ پنل                                                 |
| `setInputBackground` _(دایرکتیو)_ | `boolean`                     | `true`   | پس‌زمینه‌ی input رو به گرادیانِ انتخاب‌شده تنظیم می‌کنه |
| `change` _(دایرکتیو)_             | `EventEmitter<string>`        |          | رشته‌ی گرادیانِ جدید                                    |

## نکات UI

- هر color-stop با کلیک روی نوارِ گرادیان اضافه می‌شه و با درگ جابه‌جا می‌شه.
- برای حذف یه stop، دوبار کلیک روش کنید (یا دکمه‌ی حذف اگه نمایش داده بشه).
- برای تنظیم رنگِ هر stop، از همون پنلِ `ngx-kit/color-picker` استفاده می‌شه (این پکیج بهش وابسته‌ست).

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
