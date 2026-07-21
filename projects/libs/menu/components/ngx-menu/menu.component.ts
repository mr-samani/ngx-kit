import { CommonModule } from '@angular/common';
import { Component, input, OnInit, TemplateRef, viewChild, viewChildren } from '@angular/core';
import { NgxMenuItem } from '../ngx-menu-item/menu-item.component';
import { OverlayRef } from 'ngx-kit/shared';
import { MenuContext, NGX_MENU_CONTEXT } from '../../tokens/menu-context.token';

@Component({
  selector: 'ngx-menu',
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
      transform-origin: left top;
      animation: menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
      background-color: var(--ngx-menu-bg, #f1f0f0);
      color: var(--ngx-menu-fg, #111111);
      box-shadow: var(--ngx-menu-shadow, 0px 0px 4px rgb(0 0 0 / 30%));
      border-radius: var(--ngx-menu-radius, 10px);
      padding: var(--ngx-menu-padding, 5px);
      min-width: var(--ngx-menu-min-width, 20px);
      min-height: var(--ngx-menu-min-height, 100px);
      will-change: transform, opacity;
    }
    .ngx-menu-panel.ngx-menu-panel-exit {
      animation: _mat-menu-exit 100ms 25ms linear forwards;
    }
    @keyframes menu-enter {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes menu-exit {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
  imports: [CommonModule],
  providers: [{ provide: NGX_MENU_CONTEXT, useExisting: NgxMenuPanel }],
})
export class NgxMenuPanel implements MenuContext {
  template = viewChild<TemplateRef<any>>(TemplateRef);
  class = input<string>('class');

  containerRef?: OverlayRef<NgxMenuPanel>;

  close(): void {
    this.containerRef?.close();
  }
}
