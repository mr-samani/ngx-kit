# ngx-kit/gallery

ویوئرِ حرفه‌ایِ تصویر: یه لیست تصویر می‌گیره، با دکمه‌های ‹ › (مثلِ کاروسل) بین‌شون می‌رید، نوارِ ابزارِ کاملاً قابل‌تنظیم (زوم، چرخش، دانلود، پرینت، تمام‌صفحه)، زوم با اسکرول موس یا پینچِ دوانگشتی، و پن با درگ وقتی زوم‌شده.

## نصب

```bash
npm install ngx-kit
```

## استفاده — مستقیم توی صفحه

```html
<ngx-image-viewer [images]="images" [toolbar]="{ print: false }" />
```

```ts
images: NgxImageViewerItem[] = [
  { src: '/img/1.jpg', alt: 'تصویر ۱', caption: 'کوه‌های البرز' },
  { src: '/img/2.jpg', alt: 'تصویر ۲' },
];
```

## استفاده — داخلِ یه دیالوگِ تمام‌صفحه

```ts
import { NgxImageViewerService } from 'ngx-kit/gallery';

constructor(private viewer: NgxImageViewerService) {}

openGallery() {
  this.viewer.open(this.images, { startIndex: 0 });
}
```

`NgxImageViewerComponent` به هیچ دیالوگی وابسته نیست (فقط یه خروجیِ `closed` داره) — اگه می‌خواید داخلِ دیالوگِ خودتون (مثلاً `ngx-kit/dialog`) بذاریدش، مستقیم از خودِ کامپوننت استفاده کنید؛ سرویس فقط یه میان‌بره.

## API

### `<ngx-image-viewer>`

| ورودی                              | نوع                                 | پیش‌فرض           | توضیح                                        |
| ---------------------------------- | ----------------------------------- | ----------------- | -------------------------------------------- |
| `images`                           | `NgxImageViewerItem[]` **(اجباری)** |                   | `{ src, alt?, caption?, downloadFileName? }` |
| `startIndex`                       | `number`                            | `0`               |                                              |
| `toolbar`                          | `NgxImageViewerToolbarConfig`       | همه `true`        | هر دکمه جدا فعال/غیرفعال می‌شه (پایین‌تر)    |
| `minZoom` / `maxZoom` / `zoomStep` | `number`                            | `1` / `6` / `0.4` |                                              |

| خروجی         | نوع      | توضیح                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `indexChange` | `number` | تغییرِ تصویرِ فعال                                                                              |
| `closed`      | `void`   | کاربر دکمه‌ی بستن رو زد یا Esc رو فشرد (خودِ کامپوننت چیزی رو نمی‌بنده؛ تصمیم با مصرف‌کننده‌ست) |

### `NgxImageViewerToolbarConfig`

`prevNext`, `counter`, `zoomIn`, `zoomOut`, `resetZoom`, `rotateLeft`, `rotateRight`, `download`, `print`, `fullscreen`, `close` — همه `boolean`، پیش‌فرضِ همه `true` به‌جز `close` (`false`).

## تعامل‌ها

| ژست                                    | نتیجه                                                 |
| -------------------------------------- | ----------------------------------------------------- |
| اسکرولِ موس                            | زوم، نسبت به همون نقطه‌ی زیرِ cursor (نه مرکزِ تصویر) |
| پینچِ دوانگشتی (تاچ)                   | زوم                                                   |
| درگ با موس یا تک‌انگشتی (وقتی زوم‌شده) | پن                                                    |
| ← / →                                  | تصویرِ قبلی/بعدی                                      |
| + / -                                  | زوم این/اوت                                           |
| Esc                                    | امیتِ `closed`                                        |

## دارک‌مود و RTL

خودکار پشتیبانی می‌شه.
