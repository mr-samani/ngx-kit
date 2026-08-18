# ngx-kit/menu

Dropdown menu and context (right-click) menu, with smart positioning relative to an anchor (via `ngx-kit/shared`'s `OverlayService`).

## Install

```bash
npm install ngx-kit
```

## Basic usage (dropdown menu)

```ts
import { NgxMenuModule } from 'ngx-kit/menu';

@Component({
  standalone: true,
  imports: [NgxMenuModule],
  template: `
    <button [ngxMenu]="userMenu">Open menu</button>

    <ngx-menu #userMenu="ngxMenu">
      <ngx-menu-item (click)="editProfile()">Edit profile</ngx-menu-item>
      <ngx-menu-item (click)="logout()">Sign out</ngx-menu-item>
      <ngx-menu-divider></ngx-menu-divider>
      <ngx-menu-item [ngxMenu]="subMenu">More settings ›</ngx-menu-item>
    </ngx-menu>

    <ngx-menu #subMenu="ngxMenu">
      <ngx-menu-item>Option A</ngx-menu-item>
      <ngx-menu-item>Option B</ngx-menu-item>
    </ngx-menu>
  `,
})
export class MyComponent {}
```

Important: `<ngx-menu>`'s content isn't rendered until it's triggered via `[ngxMenu]` (or `[ngxContextMenu]`) — so you can't use `<ngx-menu>` directly, without a trigger, as an always-visible list (like a sidebar). For that, use a regular list styled similarly.

Nested menus (submenus) work exactly as shown above, just by putting `[ngxMenu]` on the `<ngx-menu-item>` itself.

## Right-click (context) menu

```html
<div [ngxContextMenu]="rightClickMenu">Right-click me</div>

<ngx-menu #rightClickMenu="ngxMenu">
  <ngx-menu-item>Copy</ngx-menu-item>
  <ngx-menu-item>Paste</ngx-menu-item>
</ngx-menu>
```

## API

### `[ngxMenu]` directive

| Input | Type | Description |
| --- | --- | --- |
| `ngxMenu` | `NgxMenu \| TemplateRef` | Reference to the menu to open |
| `placement` | `'top' \| 'bottom' \| 'auto'` | Opening direction; defaults to `'auto'` (picked automatically if there isn't enough room) |

### `<ngx-menu>`

| Input | Type | Description |
| --- | --- | --- |
| `class` | `string` | Extra CSS class on the panel |

### Styling

Via CSS custom properties:

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

## Dark mode and RTL

Both are supported automatically (via `ngx-kit/shared`'s `OverlayService`/`DirectionService` and `light-dark()`); no extra work needed.
