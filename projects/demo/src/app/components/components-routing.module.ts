import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Components } from './components';

const routes: Routes = [
  {
    path: '',
    component: Components,
    children: [
      { path: '', redirectTo: 'color-picker', pathMatch: 'full' },
      {
        path: 'color-picker',
        loadComponent: () =>
          import('./color-picker/color-picker.component').then((c) => c.ColorPickerComponent),
      },
      {
        path: 'gradient-picker',
        loadComponent: () =>
          import('./gradient-picker/gradient-picker.component').then(
            (c) => c.GradientPickerComponent,
          ),
      },
      {
        path: 'box-shadow',
        loadComponent: () =>
          import('./box-shadow/box-shadow.component').then((c) => c.BoxShadowComponent),
      },
      {
        path: 'angle-selector',
        loadComponent: () =>
          import('./angle-selector/angle-selector.component').then((c) => c.AngleSelectorComponent),
      },
      {
        path: 'date-picker',
        loadComponent: () =>
          import('./date-picker/date-picker.component').then((c) => c.DatePickerComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./calendar/calendar.component').then((c) => c.CalendarComponent),
      },
      {
        path: 'notify',
        loadComponent: () => import('./notify/notify.component').then((c) => c.NotifyComponent),
      },
      {
        path: 'dialog',
        loadComponent: () => import('./dialog/dialog').then((c) => c.DialogDemo),
      },
      {
        path: 'menu',
        loadComponent: () => import('./menu/menu.component').then((c) => c.MenuComponent),
      },
      {
        path: 'message',
        loadComponent: () => import('./message/message').then((c) => c.MessageComponent),
      },
      {
        path: 'table',
        loadComponent: () => import('./table/demo-table').then((c) => c.DemoTable),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
