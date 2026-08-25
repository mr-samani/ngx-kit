# @ngx-kit/virtual-scroll

Virtual scroll مستقل، سبک و بدون وابستگی به `@angular/material`، با پشتیبانی کامل از
**اسکرول عمودی و افقی**. طراحی‌شده برای ادغام آسان با کامپوننت‌های سفارشی مثل جدول‌های
خودساخته (`ngx-table`).



```ts
// standalone
import { NgxVirtualScrollViewportComponent, NgxVirtualForOfDirective } from '@ngx-kit/virtual-scroll';

@Component({
  standalone: true,
  imports: [NgxVirtualScrollViewportComponent, NgxVirtualForOfDirective],
  ...
})
```

یا با NgModule:

```ts
import { NgxVirtualScrollModule } from '@ngx-kit/virtual-scroll';

@NgModule({ imports: [NgxVirtualScrollModule] })
export class AppModule {}
```

## استفاده‌ی پایه (لیست ساده - عمودی)

```html
<ngx-virtual-scroll-viewport [itemSize]="48" [minBufferPx]="200" [maxBufferPx]="400" style="height: 400px">
  <div *ngxVirtualFor="let item of items; trackBy: trackByFn; let i = index" class="row">
    {{ i }} - {{ item.name }}
  </div>
</ngx-virtual-scroll-viewport>
```

## استفاده‌ی افقی

```html
<ngx-virtual-scroll-viewport orientation="horizontal" [itemSize]="180" style="width: 100%; height: 60px">
  <div *ngxVirtualFor="let col of columns" class="col">{{ col.title }}</div>
</ngx-virtual-scroll-viewport>
```

## ادغام با `ngx-table` (معادل الگوی خودت با `mat-table`)

نکته‌ی مهم: اگر کل جدول (شامل `<thead>`) را داخل viewport بگذارید، هدر هم با
`transform` جابه‌جا می‌شود و ثابت نمی‌ماند. الگوی درست و متداول (که خودِ CDK هم
داخلی از همین ایده استفاده می‌کند) این است که فقط **بدنه‌ی ردیف‌ها** ویرچوالایز شود
و هدر بیرون از content-wrapper، به‌صورت جدا یا sticky بماند:

```html
<ngx-table class="example-container">
  <!-- هدر ثابت، خارج از ویرچوال‌اسکرول -->
  <thead>
    <tr>
      <th>No.</th>
      ...
    </tr>
  </thead>

  <!-- بدنه: اینجا ویرچوالایز می‌شود -->
  <ngx-virtual-scroll-viewport
    [itemSize]="52"
    [minBufferPx]="400"
    [maxBufferPx]="1200"
    style="display: block; height: 480px"
  >
    <tbody>
      <ng-container *ngxVirtualFor="let element of dataSource; trackBy: trackBy; let i = index">
        <tr>
          <td>{{ element.position }}</td>
          ...
        </tr>
      </ng-container>
    </tbody>
  </ngx-virtual-scroll-viewport>
</ngx-table>
```

اگر می‌خواهی دقیقاً همان syntax تو دو تگ تو در تو باشد:

```html
<ngx-virtual-scroll-viewport [itemSize]="52" [minBufferPx]="400" [maxBufferPx]="1200">
  <ngx-table [dataSource]="dataSource" [trackBy]="trackBy" [virtualRows]="true">
    ...
  </ngx-table>
</ngx-virtual-scroll-viewport>
```

در این حالت داخل `ngx-table` باید `*ngxVirtualFor` را روی `<tr>`های `tbody` بگذاری
(نه روی کل جدول)، دقیقاً همان‌طور که در مثال بالا نشان داده شد؛ ngx-table فقط باید
selector هدرش را با `position: sticky; top: 0; z-index: 1` بدهد تا هنگام اسکرول محتوای
داخلی، ثابت بماند (چون خودِ container اسکرول‌شونده در سطح `.ngx-virtual-scroll-viewport__scrollable`
است، نه سطح `ngx-table`).

## API

### `<ngx-virtual-scroll-viewport>` (alias: `<ngx-virtual-scroll>`)

| Input          | نوع                            | پیش‌فرض | توضیح                                   |
| -------------- | ------------------------------- | ------- | ---------------------------------------- |
| `orientation`  | `'vertical' \| 'horizontal'`    | `vertical` | جهت اسکرول                            |
| `itemSize`     | `number`                        | `50`    | اندازه‌ی ثابت هر آیتم (px)               |
| `minBufferPx`  | `number`                        | `100`   | حداقل بافر قبل از محاسبه‌ی دوباره        |
| `maxBufferPx`  | `number`                        | `200`   | حداکثر بافر رندر خارج از دید             |

| Output                 | نوع                              | توضیح                          |
| ----------------------- | --------------------------------- | ------------------------------- |
| `scrolledIndexChange`   | `EventEmitter<number>`            | ایندکس اولین آیتم قابل‌مشاهده  |
| `renderedRangeChange`   | `EventEmitter<NgxVirtualScrollRange>` | بازه‌ی فعلی رندرشده        |

| متد                                              | توضیح                         |
| -------------------------------------------------- | ------------------------------ |
| `scrollToIndex(index, behavior?)`                  | اسکرول برنامه‌ای به یک ایندکس |
| `scrollToOffset(offset, behavior?)`                | اسکرول برنامه‌ای به یک آفست   |
| `getRenderedRange()`                               | بازه‌ی فعلی رندرشده           |
| `checkViewportSize()`                              | اندازه‌گیری مجدد دستی          |

### `*ngxVirtualFor`

```html
*ngxVirtualFor="let item of items; trackBy: trackByFn; let i = index"
```

کانتکست تمپلیت: `$implicit`, `index`, `count`, `first`, `last`, `even`, `odd`.

### استراتژی سفارشی (برای اندازه‌ی متغیر یا الگوریتم دلخواه)

```ts
providers: [
  { provide: NGX_VIRTUAL_SCROLL_STRATEGY, useClass: MyCustomStrategy }
]
```

کافیست `NgxVirtualScrollStrategy` را پیاده‌سازی کنید (فایل
`strategies/virtual-scroll-strategy.ts`).

## مقایسه با `cdk-virtual-scroll-viewport`

| ویژگی                                   | Angular CDK                          | @ngx-kit/virtual-scroll         |
| ----------------------------------------- | -------------------------------------- | ---------------------------------- |
| اسکرول عمودی fixed-size                  | ✅ پایدار                              | ✅                                  |
| اسکرول افقی                              | ⚠️ تجربی / محدود                       | ✅ به‌صورت رسمی                    |
| وابستگی                                  | کل `@angular/cdk/scrolling`            | فقط `@angular/core` + `rxjs`      |
| استراتژی سفارشی                          | ✅ (پیچیده‌تر برای پیاده‌سازی)          | ✅ اینترفیس ساده و مینیمال          |
| ادغام با جدول سفارشی (غیر از mat-table)  | نیازمند trick و override زیاد           | طراحی‌شده برای این منظور           |
| اندازه‌بندی متغیر (variable size)        | Experimental                          | با پیاده‌سازی استراتژی سفارشی      |

## معماری داخلی (خلاصه)

```
src/lib/
  types/                 → orientation, range, template-context
  tokens/                → NgxVirtualScrollViewportRef + DI token استراتژی
  strategies/
    virtual-scroll-strategy.ts          → قرارداد انتزاعی
    fixed-size-virtual-scroll-strategy.ts → پیاده‌سازی پیش‌فرض (هر دو جهت)
  viewport/
    virtual-scroll-viewport.component.ts  → مدیریت DOM، scroll listener، ResizeObserver
  directives/
    virtual-for-of.directive.ts           → recycle کردن EmbeddedViewها
  ngx-virtual-scroll.module.ts
```

الگوی رندر دقیقاً مشابه CDK است: یک `spacer` نامرئی با اندازه‌ی کل لیست (برای
اسکرول‌بار native درست) + یک `content-wrapper` که با `transform: translate` به
موقعیت بازه‌ی رندرشده منتقل می‌شود، به‌جای positioning تک‌تک آیتم‌ها. این یعنی
آیتم‌های داخل `tbody` می‌توانند به‌صورت طبیعی (document flow) کنار هم بچینند و
لایوت جدول native حفظ می‌شود.
