import { Injectable, signal } from '@angular/core';
import { IsRtl } from 'ngx-kit/shared/utils/is-rtl';
export type DirectionType = 'ltr' | 'rtl';
@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  isRtl = signal(false);
  constructor() {
    const dir = (localStorage.getItem('dir') || 'ltr') as DirectionType;
    this.setDir(dir);
    this.isRtl.update((u) => (u = dir == 'rtl' ? true : false));
  }
  toggleDirection() {
    this.isRtl.update((u) => !u);
    let dir: DirectionType = this.isRtl() ? 'rtl' : 'ltr';
    localStorage.setItem('dir', dir);
    this.setDir(dir);
  }

  private setDir(dir: DirectionType) {
    document.documentElement.setAttribute('dir', dir);
  }
}
