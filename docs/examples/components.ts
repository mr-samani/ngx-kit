import { Component, signal } from '@angular/core';
import { SideNav } from '../layouts/side-nav/side-nav';
import { RouterModule } from '@angular/router';
import { NgxDrawerMenuComponent } from 'ngx-kit/drawer-menu';

@Component({
  selector: 'app-components',
  imports: [SideNav, RouterModule, NgxDrawerMenuComponent],
  templateUrl: './components.html',
  styleUrl: './components.scss',
})
export class Components {
  protected readonly sidebarOpen = signal(false);
}
