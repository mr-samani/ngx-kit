import { Component } from '@angular/core';

@Component({
  selector: 'ngx-menu-divider,[ngx-menu-divider]',
  template: ``,
  styles: `
    :host {
      display: block;
      border-bottom: var(--ngx-menu-item-border, 1px #43434d3d solid);
      border-bottom-color: var(--ngx-menu-divider-border-color, #43434d3d);
      margin: var(--ngx-menu-divider-margin, 10px calc(var(--ngx-menu-padding, 5px) * -1));
    }
  `,
})
export class NgxMenuDivider {}
