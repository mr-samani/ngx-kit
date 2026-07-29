import { ApplicationConfig, inject, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNotify } from 'ngx-kit/notify';
import { NGX_MESSAGE_CONFIGS, provideMessage } from 'ngx-kit/message';
import { provideTable } from 'ngx-kit/table';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNotify({ timeout: 5000, dismissible: true, position: 'bottom-center' }),
    provideMessage(),
    provideTable({
      column: { minWidth: 90, maxWidth: 480, defaultWidth: 160 },
      pagination: { pageSizeOptions: [10, 20, 50, 100], defaultPageSize: 20 },
      multiSort: true,
      locale: {
        noData: 'داده‌ای یافت نشد',
        loading: 'در حال بارگذاری...',
        rowsPerPage: 'ردیف در صفحه',
        of: '{first}-{last} از {total}',
        first: 'صفحه اول',
        last: 'صفحه آخر',
        next: 'بعدی',
        previous: 'قبلی',
      },
    }),
    // {
    //   provide: NGX_MESSAGE_CONFIGS,
    //   useFactory: async () => {
    //     const l = inject(FakeLocalizer);
    //     const k = await l.get('dddddddddddd');
    //     debugger;
    //     return {
    //       confirmButtonText: k,
    //     };
    //   },
    // },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class FakeLocalizer {
  async get(key: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('localized_' + key);
      }, 500);
    });
  }
}
