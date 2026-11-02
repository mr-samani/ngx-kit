import { Component, signal } from '@angular/core';
import { SideNavComponent } from '../layouts/side-nav/side-nav';
import { RouterModule } from '@angular/router';
import { NgxSideNavModule } from 'ngx-kit/side-nav';
import { Header } from '@demo/layouts/header/header';

@Component({
  selector: 'app-components',
  imports: [SideNavComponent, RouterModule, NgxSideNavModule, Header],
  templateUrl: './components.html',
  styleUrl: './components.scss',
})
export class Components {
}
