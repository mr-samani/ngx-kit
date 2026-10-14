import { NgModule } from '@angular/core';
import { NgxDialogModule } from 'ngx-kit/dialog';
import { MyCustomDialog } from './my-custom-dialog/my-custom-dialog';
import { ExampleShowcaseComponent } from '@demo/shared/showcase/example-showcase.component';
import { DialogDemo } from './dialog';
import { RouterModule } from '@angular/router';
import { MyTestService } from './test.service';

@NgModule({
  declarations: [DialogDemo, MyCustomDialog],
  imports: [
    ExampleShowcaseComponent,
    NgxDialogModule,
    RouterModule.forChild([
      {
        path: '',
        component: DialogDemo,
      },
    ]),
  ],
  providers: [MyTestService],
})
export class DemoDialogModule {}
