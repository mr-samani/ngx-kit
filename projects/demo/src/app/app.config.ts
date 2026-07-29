import { ApplicationConfig, inject, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNotify } from 'ngx-kit/notify';
import { NGX_MESSAGE_CONFIGS, provideMessage } from 'ngx-kit/message';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNotify({ timeout: 5000, dismissible: true, position: 'bottom-center' }),
    provideMessage(),
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
