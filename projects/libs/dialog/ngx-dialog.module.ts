import { CommonModule, isPlatformServer } from '@angular/common';
import { NgModule, Optional, PLATFORM_ID, SkipSelf, inject } from '@angular/core';
import { NgxDialogBody } from './directives/body.directive';
import { NgxDialogFooter } from './directives/footer.directive';
import { NgxDialogHeader } from './directives/header.directive';
import { NgxDialogComponent } from './components/ngx-dialog.component';
import { Dialog as DialogFacade } from './dialog.facade';
import { NgxDialogService } from './services/ngx-dialog.service';

@NgModule({
  declarations: [],
  imports: [
    NgxDialogComponent,
    NgxDialogHeader,
    NgxDialogFooter,
    NgxDialogBody,
  ],
  exports: [
    NgxDialogComponent,
    NgxDialogHeader,
    NgxDialogFooter,
    NgxDialogBody,
  ],
  providers: [NgxDialogService],
})
export class NgxDialogModule {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    @Optional() @SkipSelf() parentModule: NgxDialogModule | null,
    service: NgxDialogService,
  ) {
    if (parentModule) {
      return;
    }

    // API استاتیک Dialog.open(...) روی یک static field کلاسی پیاده شده تا
    // بدون تزریق دستی سرویس هم قابل استفاده باشه. این static field برای کل
    // پروسه‌ی Node.js مشترکه، نه به‌ازای هر درخواست — پس در Angular SSR،
    // چند درخواست هم‌زمان می‌تونستن instance همدیگه رو overwrite کنن و
    // دیالوگ یک کاربر با ApplicationRef اشتباه (کاربر دیگه) کار کنه.
    // به‌جای این‌که این باگ به‌صورت خاموش رخ بده، روی سرور اصلاً static
    // instance رو ست نمی‌کنیم؛ Dialog.open() روی سرور با همون خطای
    // «service not initialized» که از قبل وجود داشت fail می‌کنه (fail-loud
    // به‌جای corrupt خاموش). برای SSR باید NgxOverlayService رو مستقیم
    // inject کرد (که per-request/per-injector امنه)، نه از API استاتیک
    // استفاده کرد. رفتار کلاینت (که ۹۹٪ کاربردهاست) کاملاً بدون تغییره.
    if (isPlatformServer(this.platformId)) {
      return;
    }

    DialogFacade._setService(service);
  }
}
