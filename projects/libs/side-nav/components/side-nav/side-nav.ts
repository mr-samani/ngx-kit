import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  effect,
  inject,
  InjectionToken,
  input,
  model,
  OnInit,
  signal,
  type OnDestroy,
} from '@angular/core';
import { WINDOW } from 'ngx-kit/core';
import { NgxSideNavMode } from '../../contracts/mode';

export const NGX_SIDE_NAV = new InjectionToken<NgxSideNav>('NGX_SIDE_NAV');

@Component({
  selector: 'ngx-side-nav',
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.scss'],
  imports: [CommonModule],
  host: {
    '[style.--ngx-drawer-size.px]': 'width()',
  },
  providers: [
    {
      provide: NGX_SIDE_NAV,
      useExisting: NgxSideNav,
    },
  ],
})
export class NgxSideNav implements OnInit, OnDestroy {
  readonly open = model<boolean>(true);
  readonly width = input<number>(270);
  readonly breakpoint = input<number | null>(null);
  readonly mode = input<NgxSideNavMode>('push');
  shouldShowOverlay = signal(false);

  private mediaQuery?: MediaQueryList;
  readonly isMatchMediaQuery = signal(false);
  private removeMediaQueryListener?: () => void;

  protected readonly win = inject(WINDOW);

  constructor() {
    afterNextRender(() => {
      this.setupMediaQuery();
    });
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.removeMediaQueryListener?.();
  }

  initialize() {
    if (!this.win) return;
    const breakpoint = this.breakpoint() ?? 0;
    if (breakpoint == 0) {
      this.isMatchMediaQuery.set(true);
      this.open.set(true);
      return;
    }

    if (this.win.innerWidth <= breakpoint) {
      this.isMatchMediaQuery.set(true);
      this.open.set(false);
    } else {
      this.open.set(true);
    }
  }

  setupMediaQuery() {
    const breakpoint = this.breakpoint();
    if (!this.win || !breakpoint) return;

    this.mediaQuery = this.win.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const listener = () => this.onResize();

    this.mediaQuery.addEventListener('change', listener);
    this.removeMediaQueryListener = () => this.mediaQuery?.removeEventListener('change', listener);
  }
  onResize() {
    if (!this.mediaQuery) {
      return;
    }
    this.isMatchMediaQuery.set(this.mediaQuery.matches);
    this.open.set(!this.isMatchMediaQuery());
  }

  toggleMenu() {
    if (this.open()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  closeMenu() {
    this.open.set(false);
    this.shouldShowOverlay.set(false);
  }
  openMenu() {
    this.open.set(true);
    if (this.mode() == 'overlay' && this.open() == true) {
      this.shouldShowOverlay.set(true);
    } else {
      this.shouldShowOverlay.set(false);
    }
  }
}
