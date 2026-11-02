import { ChangeDetectionStrategy, Component, inject, injectAsync } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { Header } from './layouts/header/header';
import { RouterProgressService } from './shared/services/router-progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class AppComponent {
  protected readonly _router = inject(Router);
  protected readonly _routerProgressService = inject(RouterProgressService);
  constructor() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const url = new URL(event.url, window.location.origin);

        if (location.pathname !== url.pathname) {
          this._routerProgressService.start();
        }
      }

      if (event instanceof NavigationEnd) {
        this._routerProgressService.complete();
      }

      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this._routerProgressService.cancel();
      }
    });
  }
}
