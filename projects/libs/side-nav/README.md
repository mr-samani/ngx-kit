# ngx-kit/side-nav

A responsive side-navigation shell with a collapsible drawer and two display modes: content can be pushed beside the drawer, or the drawer can appear as an overlay at the configured breakpoint.

## Install

```bash
npm install ngx-kit
```

## Usage

```ts
import { NgxSideNav, NgxDrawerMenu, NgxDrawerMenuToggle } from 'ngx-kit/side-nav';

@Component({
  standalone: true,
  imports: [NgxSideNav, NgxDrawerMenu, NgxDrawerMenuToggle],
  template: `
    <ngx-side-nav #nav mode="overlay" [width]="280" [breakpoint]="900">
      <nav ngxDrawerMenu>
        <a href="/overview">Overview</a>
        <a href="/settings">Settings</a>
      </nav>

      <button type="button" ngxDrawerMenuToggle>Menu</button>
      <main>Page content</main>
    </ngx-side-nav>
  `,
})
export class ExampleComponent {}
```

The element marked with `ngxDrawerMenu` is projected into the drawer. The remaining content is rendered in the main content area. `ngxDrawerMenuToggle` toggles the nearest side navigation.

You can also import `NgxSideNavModule` if you prefer an NgModule-based import.

## API

### `<ngx-side-nav>`

| Input / model | Type | Default | Description |
|---|---|---:|---|
| `open` | `boolean` (two-way model) | `true` | Whether the drawer is open |
| `width` | `number` | `270` | Drawer width in pixels |
| `breakpoint` | `number \| null` | `null` | Responsive breakpoint in pixels |
| `mode` | `'push' \| 'overlay'` | `'push'` | Whether the drawer pushes content or overlays it |

### Directives

- `ngxDrawerMenu`: marks the drawer content.
- `ngxDrawerMenuToggle`: toggles the drawer.
- `hideOnBreakPoint`: input on the toggle directive; hides the toggle when the side navigation is not at its matching breakpoint.

## Notes

The component uses the browser's media-query and layout APIs. Include it in a browser-rendered view; verify your application's SSR and hydration behavior for the responsive layout you use.
