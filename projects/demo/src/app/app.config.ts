import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNotify } from 'ngx-kit/notify';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideNotify({ timeout: 5000, dismissible: true })],
};
