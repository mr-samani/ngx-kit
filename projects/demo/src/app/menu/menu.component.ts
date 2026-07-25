import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxMenuModule } from 'ngx-kit/menu';
import { Notify } from 'ngx-kit/notify';

@Component({
  selector: 'app-menu',
  imports: [NgxMenuModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  action(act: string) {
    Notify.info(`Clicked on "${act}"!`);
  }
}