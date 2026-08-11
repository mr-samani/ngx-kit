# ngx-kit/shared

ابزارها و سرویس‌های مشترکی که بقیه‌ی بسته‌های `ngx-kit` روشون بنا شدن: مدیریت اورلی/دیالوگ، تشخیص جهت صفحه (RTL/LTR)، تشخیص تنظیمات مرورگر، و چند کامپوننت پایه‌ی قابل‌استفاده‌ی مجدد (اسلایدر، رنج‌اسلایدر، صفحه‌ی اشباع رنگ).

معمولاً مستقیم به این پکیج نیازی ندارید — بقیه‌ی بسته‌ها به‌صورت خودکار بهش وابسته‌ان. ولی اگه دارید یه کامپوننت سفارشی می‌سازید که باید با بقیه‌ی کتابخونه هم‌خونی داشته باشه (دارک‌مود، RTL، درگ‌وپرفورمنس)، از همین ابزارها استفاده کنید.

## نصب

```bash
npm install ngx-kit
```

سبک‌های پایه (شامل `color-scheme` که دارک‌مود رو فعال می‌کنه) رو یک‌بار در سراسر اپ ایمپورت کنید:

```scss
// styles.scss
@import 'ngx-kit/styles/all.css';
```

## سرویس‌ها

### `OverlayService`

موتور اصلی پشتِ همه‌ی چیزهای شناور کتابخونه (منو، دیالوگ، پاپ‌آپ‌های رنگ/گرادیان/زاویه). یک المنت انگولاری رو داخل یک `<dialog>` بومیِ مرورگر (`showModal()`) نمایش می‌ده و نسبت به یک anchor موقعیت‌دهی می‌کنه.

```ts
import { OverlayService } from 'ngx-kit/shared';

const overlay = inject(OverlayService);
const viewContainerRef = inject(ViewContainerRef);

const ref = overlay.open({
  component: MyComponent,
  viewContainerRef,
  anchor: buttonElementRef.nativeElement,
  placement: 'bottom', // 'top' | 'bottom' | 'auto'
  alignment: 'start', // 'start' | 'center' | 'end'
  margin: 8,
});

ref.close(); // OverlayRef.close() آرگومان یا afterClosed نداره؛ برای اون‌جور رفتار (نتیجه‌ی بازگشتی، افترکلوز) از ngx-kit/dialog استفاده کنید که روی همین سرویس بنا شده
```

چیزهایی که به‌صورت خودکار برات مدیریت می‌شه:

- **موقعیت‌دهی هوشمند**: اگه فضای کافی پایین anchor نباشه، خودکار بالا می‌ره (`placement:'auto'`).
- **بستن با کلیک بیرون**: با تشخیص کلیک روی backdrop، نه با listener سراسری روی document.
- **پشته‌بندی درست**: چند اورلیِ هم‌زمان (مثلاً یه منوی زیرمنو‌دار) درست کار می‌کنن؛ Escape فقط آخرین (بالاترین) اورلی رو می‌بنده.
- **بازگشتِ فوکوس**: بعد از بسته‌شدن، فوکوس به همون المنتی که قبلش فوکوس داشت برمی‌گرده (دسترس‌پذیری).
- **RTL خودکار**: alignment و placement بر اساس جهت واقعیِ صفحه (نه فقط یه فرض ثابت) حساب می‌شن.

### `DirectionService`

یه سیگنال (`isRtl(): boolean`) که با `MutationObserver` روی attribute-ی `dir` عنصر `<html>` گوش می‌ده و به‌محض تغییرش، ری‌اکتیو آپدیت می‌شه — یعنی اگه اپ شما زبان رو runtime عوض کنه، همه‌چیز خودکار هماهنگ می‌مونه.

```ts
const direction = inject(DirectionService);
direction.isRtl(); // signal<boolean>
```

### `BrowserService`

```ts
const browser = inject(BrowserService);
browser.prefersDarkMode; // boolean — یه‌بار در لحظه‌ی ساخت سرویس خونده می‌شه
```

## ابزارهای Utility

### `startDragSession(callbacks)`

جایگزینِ الگوی مشکل‌دارِ `@HostListener('document:mousemove', ...)` که listener رو برای کل عمر کامپوننت روی `document` نگه می‌داره (حتی وقتی دراگی در جریان نیست — یه مشکل واقعیِ پرفورمنس روی صفحاتی با چند نمونه‌ی هم‌زمان). این تابع فقط در طول یک درگِ واقعی، listener اضافه می‌کنه و خودش پاک می‌کنه؛ `touchmove` هم با `{passive:false}` مدیریت می‌شه، پس درگ‌کردن روی موبایل صفحه رو اسکرول نمی‌کنه.

```ts
import { startDragSession } from 'ngx-kit/shared';

let stop: (() => void) | undefined;

function onPointerDown(ev: MouseEvent | TouchEvent) {
  stop?.();
  stop = startDragSession({
    onMove: (ev) => {
      /* آپدیت موقعیت */
    },
    onEnd: () => {
      stop = undefined;
    },
  });
}
```

> اگه کامپوننت‌تون `OnPush` هست و از `startDragSession` (به‌جای `@HostListener`) استفاده می‌کنید، حتماً داخل `onMove`/`onEnd` خودتون `ChangeDetectorRef.markForCheck()` رو صدا بزنید — برخلاف `@HostListener` که خودکار view رو dirty می‌کنه، `addEventListener` دستی این کار رو نمی‌کنه.

### `getOffsetPosition(event, element)`

موقعیت pointer/touch رو نسبت به گوشه‌ی بالا-چپِ یه المنت مشخص برمی‌گردونه؛ برای پیاده‌سازیِ کامپوننت‌های درگ‌محور (اسلایدر، انتخاب‌گر رنگ و ...) استفاده می‌شه.

### `mergeConfig(base, override)`

ادغام عمیقِ دو آبجکت کانفیگ (برای الگوی `provideXxx({...})` که همه‌ی کتابخونه ازش استفاده می‌کنه).

## کامپوننت‌های پایه

اینا رو مستقیم هم می‌شه استفاده کرد، ولی بیشتر به‌عنوان بلوک‌های سازنده‌ی کامپوننت‌های دیگه (مثل `color-picker`, `box-shadow`) طراحی شدن:

| کامپوننت               | Selector             | توضیح                                                               |
| ---------------------- | -------------------- | ------------------------------------------------------------------- |
| `SliderComponent`      | `slider`             | اسلایدر تک‌مقداره، `ControlValueAccessor`، `[min]`/`[max]`/`[step]` |
| `RangeSliderComponent` | `range-slider`       | اسلایدر بازه‌ای (دو thumb)                                          |
| `SaturationComponent`  | داخلی (color-picker) | صفحه‌ی دوبعدیِ انتخاب اشباع/روشنایی رنگ                             |

## دارک‌مود و RTL

هر دو مستقیماً روی `ngx-kit/shared` تکیه دارن:

- **دارک‌مود**: از تابع CSS بومیِ `light-dark()` استفاده می‌شه. برای این‌که کار کنه، باید `color-scheme: light dark` (یا `only light`/`only dark` برای force کردن دستی) روی `:root` ست بشه — این کار با ایمپورت‌کردن `ngx-kit/styles/all.css` خودکار انجام می‌شه. برای force کردن دستیِ تم (مستقل از `prefers-color-scheme` سیستم)، `data-ngx-theme="dark"` یا `"light"` رو روی `<html>`/`<body>` بذارید.
- **RTL**: با `dir="rtl"` روی `<html>` فعال می‌شه؛ همه‌جای کتابخونه از CSS logical properties (`inset-inline-start` و ...) استفاده شده، پس نیازی به استایل جداگانه نیست.
