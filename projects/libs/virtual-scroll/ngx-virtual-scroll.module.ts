import { NgModule } from '@angular/core';

import { NgxVirtualScrollViewportComponent } from './components/virtual-scroll-viewport.component';
import { NgxVirtualForOfDirective } from './directives/virtual-for-of.directive';


@NgModule({
  imports: [NgxVirtualScrollViewportComponent, NgxVirtualForOfDirective],
  exports: [NgxVirtualScrollViewportComponent, NgxVirtualForOfDirective],
})
export class NgxVirtualScrollModule {}
