# ngx-kit/menu

منوی کشویی و منوی راست‌کلیک (context menu)، با موقعیت‌دهیِ هوشمند نسبت به anchor (از `ngx-kit/shared`'s `OverlayService`).

## نصب

```bash
npm install ngx-kit
```

## استفاده‌ی پایه (منوی کشویی)

```ts
import { NgxMenuModule } from 'ngx-kit/menu';

@Component({
  standalone: true,
  imports: [NgxMenuModule],
  template: `
    <button [ngxMenu]="userMenu">باز کردن منو</button>

    <ngx-menu #userMenu="ngxMenu">
      <ngx-menu-item (click)="editProfile()">ویرایش پروفایل</ngx-menu-item>
      <ngx-menu-item (click)="logout()">خروج</ngx-menu-item>
      <ngx-menu-divider></ngx-menu-divider>
      <ngx-menu-item [ngxMenu]="subMenu">تنظیمات بیشتر ›</ngx-menu-item>
    </ngx-menu>

    <ngx-menu #subMenu="ngxMenu">
      <ngx-menu-item>گزینه‌ی الف</ngx-menu-item>
      <ngx-menu-item>گزینه‌ی ب</ngx-menu-item>
    </ngx-menu>
  `,
})
export class MyComponent {}
```

نکته‌ی مهم: محتوای `<ngx-menu>` تا وقتی از طریق `[ngxMenu]` (یا `[ngxContextMenu]`) trigger نشه رندر نمی‌شه — یعنی `<ngx-menu>` رو نمی‌شه مستقیم و بدون یه trigger، به‌عنوان یه لیستِ همیشه-نمایان (مثل یه سایدبار) استفاده کرد؛ برای اون منظور از یه لیست معمولی با استایل مشابه استفاده کنید.

منوی تودرتو (زیرمنو) هم همون‌طور که بالا دیدید، فقط با گذاشتن `[ngxMenu]` روی خودِ `<ngx-menu-item>` کار می‌کنه.

## منوی راست‌کلیک

```html
<div [ngxContextMenu]="rightClickMenu">راست‌کلیک کن روی من</div>

<ngx-menu #rightClickMenu="ngxMenu">
  <ngx-menu-item>کپی</ngx-menu-item>
  <ngx-menu-item>چسباندن</ngx-menu-item>
</ngx-menu>
```

## API

### دایرکتیو `[ngxMenu]`

| ورودی       | نوع                           | توضیح                                                                |
| ----------- | ----------------------------- | -------------------------------------------------------------------- |
| `ngxMenu`   | `NgxMenu \| TemplateRef`      | رفرنسِ منویی که باید باز بشه                                         |
| `placement` | `'top' \| 'bottom' \| 'auto'` | جهتِ باز شدن؛ پیش‌فرض `'auto'` (خودکار انتخاب می‌شه اگه فضا کم باشه) |

### `<ngx-menu>`

| ورودی   | نوع      | توضیح                   |
| ------- | -------- | ----------------------- |
| `class` | `string` | کلاسِ CSS اضافی روی پنل |

### شخصی‌سازی ظاهر

از طریق CSS custom properties:

```css
ngx-menu {
  --ngx-menu-bg: light-dark(#fff, #252425);
  --ngx-menu-fg: light-dark(#000, #fff);
  --ngx-menu-radius: 10px;
  --ngx-menu-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  --ngx-menu-item-padding: 8px 14px;
  --ngx-menu-item-hover-bg: #9bc6ff68;
}
```

## دارک‌مود و RTL

هر دو خودکار پشتیبانی می‌شن (از طریق `ngx-kit/shared`'s `OverlayService`/`DirectionService` و `light-dark()`)؛ کار اضافه‌ای لازم نیست.
