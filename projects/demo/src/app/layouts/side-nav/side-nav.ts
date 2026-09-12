import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IAppMenu } from '@demo/shared/interfaces/IAppMenu';
import { MENU_LIST } from '@demo/shared/menu-items';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  private readonly router = inject(Router);

  readonly list = MENU_LIST;

  /**
   * Reactive URL.
   *
   * Unlike router.url, this signal updates after every navigation.
   */
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.normalizeUrl(event.urlAfterRedirects)),
      startWith(this.normalizeUrl(this.router.url)),
    ),
    {
      initialValue: this.normalizeUrl(this.router.url),
    },
  );

  /**
   * Currently active menu item.
   */
  readonly activeMenuItem = computed<IAppMenu | null>(() => {
    const url = this.currentUrl();

    for (const category of this.list) {
      for (const item of category.items) {
        if (this.normalizeUrl(item.url!) === url) {
          return item;
        }
      }
    }

    return null;
  });

  /**
   * Which menu is currently displayed.
   *
   * null = main navigation
   * item = fragment navigation
   */
  readonly fragmentMenuItem = signal<IAppMenu | null>(this.findMenuItemByCurrentUrl());

  readonly isFragmentNavigation = computed(() => this.fragmentMenuItem() !== null);

  readonly activeFragments = computed(() => this.fragmentMenuItem()?.fragments ?? []);

  /**
   * Main menu item click.
   */
  openMenuItem(item: IAppMenu): void {
    if (item.fragments?.length) {
      this.fragmentMenuItem.set(item);
    } else {
      this.fragmentMenuItem.set(null);
    }
  }

  /**
   * Back to main navigation.
   *
   * No router navigation here.
   *
   * This is important because the main menu is
   * a sidebar state, not another route.
   */
  backToMainMenu(): void {
    this.fragmentMenuItem.set(null);
  }

  /**
   * Called when navigation happens from somewhere else:
   *
   * - browser Back / Forward
   * - another menu item
   * - direct router navigation
   * - programmatic navigation
   *
   * We use the reactive currentUrl signal.
   */
  private readonly navigationSync = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        const item = this.findMenuItemByCurrentUrl();

        if (item?.fragments?.length) {
          this.fragmentMenuItem.set(item);
        } else {
          this.fragmentMenuItem.set(null);
        }

        return true;
      }),
      startWith(false),
    ),
    {
      initialValue: false,
    },
  );

  private findMenuItemByCurrentUrl(): IAppMenu | null {
    const url = this.normalizeUrl(this.router.url);

    for (const category of this.list) {
      for (const item of category.items) {
        if (this.normalizeUrl(item.url!) === url && item.fragments?.length) {
          return item;
        }
      }
    }

    return null;
  }

  private normalizeUrl(url: string): string {
    return url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  }
}
