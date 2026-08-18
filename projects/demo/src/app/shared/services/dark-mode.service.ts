import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Subject } from 'rxjs';
export const DARK_MODE_KEY = 'dark';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal<boolean>(false);
  onChange = new Subject<'light' | 'dark'>();
  doc = inject(DOCUMENT);
  constructor() {
    // قبلاً localStorage/document مستقیم و بدون چک isBrowser صدا زده می‌شد؛
    // با این‌که این سرویس از قبل PLATFORM_ID رو تزریق می‌کرد و isBrowser
    // getter هم داشت (یعنی قصد پشتیبانی از SSR بوده)، همون تو constructor
    // نادیده گرفته می‌شدن. الان اگه اپ در آینده SSR فعال بشه (که امکانش با
    // توجه به همین ساختار هست)، دیگه سرور با خطای «localStorage is not
    // defined» کرش نمی‌کنه.
    if (!this.isBrowser) return;

    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored === 'true' || stored === 'false') {
      this.isDarkMode.set(stored === 'true');
    } else {
      // قبلاً prefersDarkMode تعریف شده بود ولی هیچ‌جا استفاده نمی‌شد؛ یعنی
      // بار اولی که کاربر بدون هیچ ترجیح ذخیره‌شده‌ای وارد می‌شد، همیشه
      // روی حالت روشن می‌افتاد، حتی اگه سیستم/مرورگرش روی دارک بود.
      this.isDarkMode.set(this.prefersDarkMode);
    }
    this.setHtmlDarkMode();
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
      this.doc.documentElement.classList.remove('light-scheme');
    } else {
      this.doc.documentElement.classList.remove('dark-scheme');
      this.doc.documentElement.classList.add('light-scheme');
    }
    this.onChange.next(this.isDarkMode() ? 'dark' : 'light');
  }
}
