import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((c) => c.Home),
  },
  {
    path: 'components',
    loadChildren: () => import('./components/components.module').then((m) => m.ComponentsModule),
  },
];
