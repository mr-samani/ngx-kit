import {
  Directive,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { NGX_SIDE_NAV } from '../components/side-nav/side-nav';

@Directive({
  selector: '[ngxDrawerMenuToggle]',
  host: {
    '[style.display]': "hide()?'none':''",
  },
})
export class NgxDrawerMenuToggle {
  readonly hideOnBreakPoint = input(false);

  protected readonly sideNav = inject(NGX_SIDE_NAV);
  hide = signal(true);

  constructor() {
    effect(() => {
      const isMatch = this.sideNav.isMatchMediaQuery();
      this.hide.set(this.hideOnBreakPoint() && !isMatch);
    });
  }

  @HostListener('click')
  protected onClick() {
    this.sideNav.toggleMenu();
  }
}
