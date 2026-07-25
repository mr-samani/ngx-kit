import { CommonModule } from '@angular/common';
import { Component, input, TemplateRef, viewChild } from '@angular/core';
import { OverlayRef } from 'ngx-kit/shared';
import { MenuContext, NGX_MENU_CONTEXT } from '../../tokens/menu-context.token';

@Component({
  selector: 'ngx-menu,[ngx-menu]',
  template: `
    <ng-template>
      <div class="ngx-menu-panel" [ngClass]="class()">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  exportAs: 'NgxMenu',
  styles: `
    .ngx-menu-panel {
      overflow: auto;
      box-sizing: border-box;
      outline: 0;
      background-color: var(--ngx-menu-bg, #ffffff);
      color: var(--ngx-menu-fg, #111111);
      box-shadow: var(--ngx-menu-shadow, 0px 0px 4px rgb(0 0 0 / 30%));
      border-radius: var(--ngx-menu-radius, 10px);
      padding: var(--ngx-menu-padding, 5px);
      min-width: var(--ngx-menu-min-width, 20px);
      min-height: var(--ngx-menu-min-height, 40px);
      will-change: transform, opacity;
    }
    .ngx-menu-panel.ngx-menu-panel-exit {
      animation: menu-exit 100ms 25ms linear forwards;
    }
  `,
  imports: [CommonModule],
  providers: [{ provide: NGX_MENU_CONTEXT, useExisting: NgxMenuPanel }],
})
export class NgxMenuPanel implements MenuContext {
  template = viewChild<TemplateRef<any>>(TemplateRef);
  class = input<string>();

  containerRef?: OverlayRef<NgxMenuPanel>;

  close(): void {
    this.containerRef?.close();
  }
}
