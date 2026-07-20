import { Component } from '@angular/core';

@Component({
  selector: 'ngx-menu-divider',
  template: `
    <div class="ngx-menu-divider"></div>
  `,
  styles: `
    .ngx-menu-divider {
      border-bottom: var(--ngx-menu-item-border, 1px #43434d95 solid);
      border-bottom-color: var(--ngx-menu-divider-border-color, #43434d95);
    }
  `,
})
export class NgxMenuDivider {}
