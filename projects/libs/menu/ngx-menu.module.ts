import { NgModule } from '@angular/core';
import { NgxMenuDivider } from './components/ngx-menu-divider/menu-divider.component';
import { NgxMenuItem } from './components/ngx-menu-item/menu-item.component';
import { NgxMenuPanel } from './components/ngx-menu/menu.component';
import { NgxMenu } from './directives/ngx-menu.directive';

@NgModule({
  imports: [NgxMenu, NgxMenuPanel, NgxMenuItem, NgxMenuDivider],
  exports: [NgxMenu, NgxMenuPanel, NgxMenuItem, NgxMenuDivider],
})
export class NgxMenuModule {}
