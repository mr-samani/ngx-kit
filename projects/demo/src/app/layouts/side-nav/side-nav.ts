import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICategory } from '@demo/shared/interfaces/ICategory';
import { MENU_LIST } from '@demo/shared/menu-items';

@Component({
  selector: 'app-side-nav',
  imports: [RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
    list: ICategory[] = MENU_LIST;
  
}
