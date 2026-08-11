# ngx-kit/box-shadow

ابزار بصریِ ساختِ `box-shadow`: جابه‌جاییِ سایه با درگِ ماوس/تاچ روی یه صفحه‌ی دوبعدی، به‌همراه کنترلِ بلور، پخش (spread)، و رنگ.

## نصب

```bash
npm install ngx-kit
```

## استفاده

```html
<ngx-box-shadow [(ngModel)]="shadowCss"></ngx-box-shadow>
```

یا روی یه input معمولی:

```html
<input type="text" [ngxInputBoxShadow]="shadowCss" (change)="shadowCss = $event" />
```

خروجی یه رشته‌ی معتبرِ CSS مثل `0px 4px 12px 0px rgba(0,0,0,0.25)` هست.

## API

| ورودی                             | نوع       | پیش‌فرض | توضیح                                     |
| --------------------------------- | --------- | ------- | ----------------------------------------- |
| `setInputBackground` _(دایرکتیو)_ | `boolean` | `true`  | نمایش رنگِ سایه به‌عنوان پس‌زمینه‌ی input |

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه. صفحه‌ی درگِ سایه با Pointer Capture پیاده شده (بدون نیاز به listener سراسری روی document)، پس روی موبایل هم روون کار می‌کنه.
