import { Component } from '@angular/core';
import { ComponentsRoutingModule } from '@demo/components/components-routing.module';
import { ICategory } from '@demo/shared/interfaces/ICategory';
import { MENU_LIST } from '@demo/shared/menu-items';

@Component({
  selector: 'app-home',
  imports: [ComponentsRoutingModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  defaultImage = 'images/no-iamge.jpg';
  list: ICategory[] = MENU_LIST;

  constructor() {
    // open all categories
    this.list.map((m) => (m.open = true));
  }
}
