import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { NgxDialogBodyDirective } from './directives/body.directive';
import { NgxDialogFooterDirective } from './directives/footer.directive';
import { NgxDialogHeaderDirective } from './directives/header.directive';
import { NgxDialogComponent } from './ngx-dialog.component';
import { NgxDialogService } from './ngx-dialog.service';
import { Dialog as DialogFacade } from './dialog.facade';

@NgModule({
  declarations: [NgxDialogComponent, NgxDialogHeaderDirective, NgxDialogFooterDirective, NgxDialogBodyDirective],
  imports: [CommonModule],
  exports: [NgxDialogComponent, NgxDialogHeaderDirective, NgxDialogFooterDirective, NgxDialogBodyDirective],
  providers: [NgxDialogService],
})
export class NgxDialogModule {
  constructor(@Optional() @SkipSelf() parentModule: NgxDialogModule | null, service: NgxDialogService) {
    if (parentModule) {
      return;
    }
    DialogFacade._setService(service);
  }
}
