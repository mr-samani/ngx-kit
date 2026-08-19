import { ApplicationConfig, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

import { routes } from './app.routes';
import { provideNotify } from 'ngx-kit/notify';
import { provideMessage } from 'ngx-kit/message';
import { provideTable } from 'ngx-kit/data-table';
import { AvatarCellRenderer } from './shared/renderers/AvatarCellRenderer';
import { BooleanCellRenderer } from './shared/renderers/BooleanCellRenderer';
import { DateCellRenderer } from './shared/renderers/DateCellRenderer';
import { ImageCellRenderer } from './shared/renderers/ImageCellRenderer';
import { RolesCellRenderer } from './shared/renderers/RolesCellRenderer';
import { StatusCellRenderer } from './shared/renderers/StatusCellRenderer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideMonacoEditor({
      baseUrl: 'assets/monaco/min/vs',
    }),
    provideNotify({ timeout: 5000, dismissible: true, position: 'bottom-center' }),
    provideMessage(),
    // providePagination(),
    provideTable({
      renderers: {
        boolean: BooleanCellRenderer,
        date: DateCellRenderer,
        image: ImageCellRenderer,
        avatar: AvatarCellRenderer,
        status: StatusCellRenderer,
        roles: RolesCellRenderer,
      },
      labels: {},
      formatters: {
        emptyDash: (value) => {
          return value == null || value === '' ? '—' : String(value);
        },

        uppercase: (value) => {
          return value == null ? '' : String(value).toUpperCase();
        },
        percent: (value) => (value == null ? '' : `${value}%`),
        number: (value) => {
          if (value == null || value === '') {
            return '—';
          }

          return Number(value).toLocaleString('en-US');
        },
      },
    }),

    // provideTable({
    //   column: { minWidth: 90, maxWidth: 480, defaultWidth: 160 },
    //   pagination: { pageSizeOptions: [10, 20, 50, 100], defaultPageSize: 20 },
    //   multiSort: true,
    //   locale: {
    //     noData: 'داده‌ای یافت نشد',
    //     loading: 'در حال بارگذاری...',
    //     rowsPerPage: 'ردیف در صفحه',
    //     of: '{first}-{last} از {total}',
    //     first: 'صفحه اول',
    //     last: 'صفحه آخر',
    //     next: 'بعدی',
    //     previous: 'قبلی',
    //   },
    // }),
    // {
    //   provide: NGX_MESSAGE_CONFIGS,
    //   useFactory: async () => {
    //     const l = inject(FakeLocalizer);
    //     const k = await l.get('dddddddddddd');
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
