import { Component, HostListener, inject } from '@angular/core';
import { NGX_MENU_CONTEXT } from '../../tokens/menu-context.token';
import { NgxMenu } from '../../directives/ngx-menu.directive';

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
      transition: all 300ms;
      &:hover {
        cursor: pointer;
        background-color: var(--ngx-menu-item-padding, #9bc6ff68);
      }
    }
  `,
})
export class NgxMenuItem {
  menuContext = inject(NGX_MENU_CONTEXT);
  childMenu = inject(NgxMenu, {
    self: true,
    optional: true,
  });

  @HostListener('click')
  onClick() {
    if (this.childMenu?.ngxMenu) {
      return;
    }
    this.menuContext?.close();
  }
}
