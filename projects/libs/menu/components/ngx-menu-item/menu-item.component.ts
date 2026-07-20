import { Component } from '@angular/core';

@Component({
  selector: 'ngx-menu-item,[ngx-menu-item]',
  template: `
    <div class="ngx-menu-item">
      <ng-content></ng-content>
    </div>
  `,
  exportAs: 'NgxMenuItem',
  styles: `
    .ngx-menu-item {
      box-sizing: border-box;
      outline: 0;
      padding: var(--ngx-menu-item-padding, 6px 12px);
      &:hover {
        cursor: pointer;
        background-color: var(--ngx-menu-item-padding, #9bc6ff68);
      }
    }
  `,
})
export class NgxMenuItem {}
