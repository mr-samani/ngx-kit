import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
export type DirectionType = 'ltr' | 'rtl';
@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  isRtl = signal(false);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    // همون کلاس باگ DarkModeService: قبلاً localStorage و document سراسری
    // (به‌جای توکن تزریق‌شده‌ی DOCUMENT) بدون هیچ چک SSR صدا زده می‌شدن.
    const stored = this.isBrowser ? (localStorage.getItem('dir') as DirectionType | null) : null;
    const dir: DirectionType = stored === 'rtl' || stored === 'ltr' ? stored : 'ltr';
    this.setDir(dir);
    this.isRtl.set(dir === 'rtl');
  }
  toggleDirection() {
    this.isRtl.update((u) => !u);
    let dir: DirectionType = this.isRtl() ? 'rtl' : 'ltr';
    if (this.isBrowser) localStorage.setItem('dir', dir);
    this.setDir(dir);
  }

  private setDir(dir: DirectionType) {
    this.doc.documentElement.setAttribute('dir', dir);
  }
}
