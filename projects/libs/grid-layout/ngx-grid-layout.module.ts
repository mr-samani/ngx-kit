import { NgModule } from '@angular/core';
import { NgxGridLayoutComponent } from './grid-layout/grid-layout.component';
import { NgxGridItemComponent } from './grid-item/grid-item.component';
import { GridLayoutService } from './services/grid-layout.service';

@NgModule({
  imports: [NgxGridLayoutComponent, NgxGridItemComponent],
  exports: [NgxGridLayoutComponent, NgxGridItemComponent],
  providers: [GridLayoutService],
})
export class NgxGridLayoutModule {}
