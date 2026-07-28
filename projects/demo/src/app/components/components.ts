import { Component } from '@angular/core';
import { SideNav } from '../layouts/side-nav/side-nav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-components',
  imports: [SideNav, RouterModule],
  templateUrl: './components.html',
  styleUrl: './components.scss',
})
export class Components {}
