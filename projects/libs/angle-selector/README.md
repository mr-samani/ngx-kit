# ngx-kit/angle-selector

انتخاب‌گر زاویه (۰ تا ۳۶۰ درجه) با یه دستگیره‌ی قابل‌درگِ دایره‌ای — برای تنظیمِ جهتِ گرادیان، چرخشِ سایه، یا هر مقدارِ زاویه‌ای دیگه.

## نصب

```bash
npm install ngx-kit
```

## استفاده

```html
<ngx-input-angle [(ngModel)]="angle"></ngx-input-angle>
```

یا روی یه input معمولی:

```html
<input type="number" [ngxInputAngle]="angle" (change)="angle = $event" />
```

## API

| ورودی                 | نوع                           | پیش‌فرض  | توضیح                      |
| --------------------- | ----------------------------- | -------- | -------------------------- |
| `theme`               | `'light' \| 'dark' \| 'auto'` | `'auto'` | تمِ کامپوننت               |
| `change` _(دایرکتیو)_ | `EventEmitter<number>`        |          | زاویه‌ی جدید (بر حسب درجه) |

مقدار همیشه یه عددِ بین `0` تا `360` هست.

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه. دستگیره با RxJS (`switchMap` + `takeUntil` + `takeUntilDestroyed`) پیاده شده، پس listenerهای درگ فقط دقیقاً حین یه درگِ واقعی فعالن.
