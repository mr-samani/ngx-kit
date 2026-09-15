import { NgModule } from '@angular/core';
import { NgxDialogBody } from './directives/body.directive';
import { NgxDialogFooter } from './directives/footer.directive';
import { NgxDialogHeader } from './directives/header.directive';
import { NgxDialogComponent } from './components/ngx-dialog.component';
import { provideNgxDialog } from './ngx-dialog.provider';

@NgModule({
  declarations: [],
  imports: [NgxDialogComponent, NgxDialogHeader, NgxDialogFooter, NgxDialogBody],
  exports: [NgxDialogComponent, NgxDialogHeader, NgxDialogFooter, NgxDialogBody],
  providers: [provideNgxDialog()],
})
export class NgxDialogModule {}
