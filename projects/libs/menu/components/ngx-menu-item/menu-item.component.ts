import { Component, HostListener, inject, output } from '@angular/core';
import { NGX_MENU_CONTEXT } from '../../tokens/menu-context.token';

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
export class NgxMenuItem {
  menuContext = inject(NGX_MENU_CONTEXT);

  @HostListener('click')
  onClick() {
    this.menuContext?.close();
  }
}
