# ngx-kit/drawer-menu

A gesture-first Angular navigation drawer designed for desktop and mobile.

## Highlights

- Logical `start` / `end` placement with RTL/LTR support.
- Mouse + touch + pen drag using Pointer Events.
- Open from the screen edge when closed.
- Drag the drawer itself to close it.
- Live 0..1 gesture progress — effects react while dragging.
- Fabric / curtain / spring / elastic effects.
- `overlay`, `push`, and `reveal` content modes.
- Desktop/mobile responsive state.
- Pin/unpin support.
- Controlled state with `[(open)]`.
- Reduced-motion support.
- Escape and backdrop closing.

## Recommended configuration

```html
<ngx-drawer-menu
  side="start"
  mode="push"
  effect="fabric"
  [width]="300"
  [openOnDesktop]="true"
  [openOnMobile]="false"
  [mobileBreakpoint]="960"
  [(open)]="drawerOpen"
  [(pinned)]="drawerPinned">
  <router-outlet />

  <div drawerContent>
    <!-- navigation -->
  </div>
</ngx-drawer-menu>
```

## Behavior model

The drawer owns one continuous `progress` value between `0` and `1`.

- `0`: fully closed.
- `1`: fully open.
- Pointer dragging directly changes progress.
- On release, velocity and the configured threshold decide the final state.

This is the key to getting a physical-feeling drawer instead of a drawer that simply jumps between CSS classes.

## Inputs

| Input               | Default   | Purpose                                                      |
| ------------------- | --------- | ------------------------------------------------------------ |
| `side`              | `start`   | Logical drawer side.                                         |
| `mode`              | `overlay` | `overlay`, `push`, or `reveal`.                              |
| `effect`            | `fabric`  | `slide`, `spring`, `fabric`, `curtain`, `elastic`, `reveal`. |
| `width`             | `300`     | Drawer width in px.                                          |
| `maxWidth`          | `420`     | Safety cap for drawer width.                                 |
| `edgeSize`          | `34`      | Edge swipe activation area.                                  |
| `swipeEnabled`      | `true`    | Enables gesture interaction.                                 |
| `backdropClose`     | `true`    | Close on backdrop press.                                     |
| `escapeClose`       | `true`    | Close on Escape.                                             |
| `open`              | `true`    | Two-way state via `[(open)]`.                                |
| `pinned`            | `false`   | Persistent drawer state via `[(pinned)]`.                    |
| `mobileBreakpoint`  | `768`     | Mobile breakpoint.                                           |
| `openOnDesktop`     | `true`    | State on desktop.                                            |
| `openOnMobile`      | `false`   | State on mobile/tablet.                                      |
| `respondToViewport` | `true`    | Enables live responsive switching.                           |
| `transitionMs`      | `420`     | Settle animation duration.                                   |

## Responsive behavior

By default:

- Desktop >= 768px: open.
- Mobile < 768px: closed.
- Crossing the breakpoint updates the drawer live.
- A pinned drawer is not closed by responsive rules.

A full `responsive` object is also available when a single config object is preferable:

```html
<ngx-drawer-menu
  [responsive]="{
    mode: 'auto',
    breakpoint: 960,
    desktopOpen: true,
    mobileOpen: false,
    respectPinned: true
  }"></ngx-drawer-menu>
```
