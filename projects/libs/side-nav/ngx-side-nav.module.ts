import { NgModule } from '@angular/core';
import { NgxDrawerMenu } from './directives/drawer-menu';
import { NgxDrawerMenuToggle } from './directives/drawer-menu-toggle';
import { NgxSideNav } from './components/side-nav/side-nav';

const d = [NgxDrawerMenu, NgxDrawerMenuToggle];
const c = [NgxSideNav];

@NgModule({
  imports: [...d, ...c],
  exports: [...d, ...c],
})
export class NgxSideNavModule {}
