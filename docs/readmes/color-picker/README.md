# ngx-kit/color-picker

انتخاب‌گر رنگ کامل: پیکر بصری (اشباع/فام)، ورودی RGB/HSL/CMYK/HEX، کانال آلفا، و پشتیبانی از EyeDropper API مرورگر برای برداشتن رنگ از هرجای صفحه.

## نصب

```bash
npm install ngx-kit
```

## استفاده به‌عنوان کامپوننت

```html
<ngx-input-color
  [(ngModel)]="color"
  [outputType]="'HEX'"
  [defaultInspector]="ColorInspector.Picker"></ngx-input-color>
```

`NgxInputColorComponent` یه `ControlValueAccessor` کامله، پس با `ngModel`، `formControl`، `formControlName` همه کار می‌کنه.

## استفاده به‌عنوان دایرکتیو (روی یه input معمولی)

```html
<input type="text" [ngxInputColor]="color" (change)="color = $event" [outputType]="'RGB'" />
```

## API

### `<ngx-input-color>` / `[ngxInputColor]`

| ورودی                                      | نوع                                               | پیش‌فرض  | توضیح                                                       |
| ------------------------------------------ | ------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `theme`                                    | `'light' \| 'dark' \| 'auto'`                     | `'auto'` | `'auto'` یعنی از `prefers-color-scheme` مرورگر پیروی می‌کنه |
| `simpleMode`                               | `boolean`                                         | `false`  | حالت جمع‌وجورتر UI                                          |
| `outputType`                               | `'HEX' \| 'RGB' \| 'HSL' \| 'HSV' \| 'CMYK'`      | `'HEX'`  | فرمتِ رشته‌ی خروجی                                          |
| `defaultInspector`                         | `ColorInspector` (`Picker \| RGB \| HSL \| CMYK`) | `Picker` | تبِ پیش‌فرضِ باز                                            |
| `useAlphaChannel`                          | `boolean`                                         | `true`   | نمایش/عدم‌نمایش کانال شفافیت                                |
| `setInputBackgroundColor` _(فقط دایرکتیو)_ | `boolean`                                         | `true`   | پس‌زمینه‌ی خودِ input رو به رنگ انتخاب‌شده تنظیم می‌کنه     |
| `change` _(خروجی، فقط دایرکتیو)_           | `EventEmitter<string>`                            |          | مقدار جدید هر بار که رنگ عوض بشه                            |

### فرمت‌های ورودی/خروجی

مقدار می‌تونه هر کدوم از این‌ها باشه: `#rrggbb`, `#rrggbbaa` (شامل مخفف ۳ و ۴ کاراکتری با آلفا)، `rgb()`/`rgba()`، `hsl()`/`hsla()`.

## EyeDropper

اگه مرورگر کاربر از [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper) پشتیبانی کنه (کروم/اج جدید)، دکمه‌ی قطره‌چکان خودکار فعال می‌شه و کاربر می‌تونه رنگ رو از هرجای صفحه (حتی بیرون از مرورگر) بردارد. در مرورگرهایی که پشتیبانی نمی‌کنن، این دکمه مخفی می‌مونه.

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
