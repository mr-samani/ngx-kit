# ngx-kit/drawer-menu

A side drawer menu with 7 different opening/closing effects (from simple to 3D/jelly), 3 behaviors for the page content (overlay/push/reveal), and a responsive default open/closed state based on screen size.

## Install

```bash
npm install ngx-kit
```

## Basic usage

```html
<ngx-drawer-menu
  side="start"
  effect="jelly"
  contentBehavior="push"
  [width]="280"
  [openOnDesktop]="true"
  [openOnMobile]="false"
  [(open)]="isOpen"
>
  <div drawerContent>
    <!-- menu content -->
    <a routerLink="/home">Home</a>
    <a routerLink="/settings">Settings</a>
  </div>

  <!-- main page content (default, no select) -->
  <router-outlet />
</ngx-drawer-menu>
```

## API

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'start' \| 'end'` | `'start'` | Logical — automatically flips under RTL |
| `effect` | `'slide' \| 'curtain' \| 'jelly' \| 'pull' \| 'rotate3d' \| 'flip3d' \| 'scale'` | `'slide'` | The panel's own open/close effect (described below) |
| `contentBehavior` | `'overlay' \| 'push' \| 'reveal'` | `'overlay'` | How the main page content behaves |
| `width` | `number` | `280` | Panel width in pixels |
| `swipeEnabled` | `boolean` | `true` | Open by swiping from the screen edge |
| `swipeEdgeSize` | `number` | `24` | Width of the invisible edge zone that a swipe can start from |
| `backdropClose` | `boolean` | `true` | Close on backdrop click (or dimming the content in push/reveal) |
| `curtainStrips` | `number` | `7` | Only for `effect="curtain"` |
| `open` | `boolean` (model, two-way) | `false` | Controllable via `[(open)]` |
| `respondToViewport` | `boolean` | `true` | Crossing `mobileBreakpoint` **live** (not just on first load) syncs `open` with `openOnDesktop`/`openOnMobile` |
| `openOnDesktop` / `openOnMobile` | `boolean` | `true` / `false` | |
| `mobileBreakpoint` | `number` | `768` | |

### Effects (`effect`)

| Value | Description |
| --- | --- |
| `slide` | Classic simple slide |
| `curtain` | Several same-colored vertical strips that collapse with a staggered delay, revealing the content |
| `jelly` | A multi-stage spring oscillation that settles down (inspired by the [Jelly Slide Menu](https://dribbble.com/shots/2307371) effect) |
| `pull` | A single rubber-band stretch |
| `rotate3d` | A 3D rotation around a hinge, like a door opening |
| `flip3d` | Flips with depth on the Z axis, like a book cover |
| `scale` | Zooms in from the center with a fade |

### Content behavior (`contentBehavior`)

| Value | Description |
| --- | --- |
| `overlay` | Content stays in place, the drawer floats over it (with a backdrop) |
| `push` | Content is pushed aside by the drawer's width |
| `reveal` | Content shrinks/recedes slightly, as if the drawer is revealed behind it (the iOS effect) |

## Architecture note: embedding inside a bounded area

By default, the drawer takes up the full height of the nearest positioned ancestor (which is what you want for a full app shell). If you want to embed it inside a bounded card/area (not the whole page), just give that container `position: relative` and a defined height — the drawer will automatically confine itself to that box (thanks to the `perspective` it uses for 3D effects, which per the CSS spec creates a containing block for `position:fixed` descendants).

## Dark mode and RTL

Supported automatically; drag math (which, unlike CSS logical properties, needs the real physical direction) uses the shared `DirectionService`, so it works correctly even with a live `dir` change.
