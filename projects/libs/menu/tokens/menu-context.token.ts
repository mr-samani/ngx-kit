import { InjectionToken } from '@angular/core';

export interface MenuContext {
  close(): void;
}

export const NGX_MENU_CONTEXT = new InjectionToken<MenuContext>('ngx-menu-context');
