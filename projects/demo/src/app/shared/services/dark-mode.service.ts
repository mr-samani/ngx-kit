import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
export const DARK_MODE_KEY = 'dark';


@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal<boolean>(false);
  doc = inject(DOCUMENT);
  constructor() {
    let d = localStorage.getItem(DARK_MODE_KEY) || '';
    if (d != '') {
      if (d == 'true') {
        this.isDarkMode.set(true);
      } else if (d == 'false') {
        this.isDarkMode.set(false);
      }
      this.setHtmlDarkMode();
    }
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get prefersDarkMode(): boolean {
    if (!this.isBrowser) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleDarkMode() {
    this.isDarkMode.update((u) => !u);
    localStorage.setItem(DARK_MODE_KEY, this.isDarkMode().toString());
    this.setHtmlDarkMode();
  }

  private setHtmlDarkMode() {
    if (this.isDarkMode()) {
      this.doc.documentElement.classList.add('dark-scheme');
    } else {
      this.doc.documentElement.classList.remove('dark-scheme');
    }
  }
}
