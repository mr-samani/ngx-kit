import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DropPositionService } from '../../services/drop-position.service';

/**
 * FlowDropIndicatorComponent
 * -------------------------------------------------------------
 * یک‌بار در ریشهٔ صفحه‌ساز قرار می‌گیرد (position: fixed).
 * تنها المنتی است که در طول درگ مدام آپدیت می‌شود؛ بقیهٔ آیتم‌های
 * لیست دست‌نخورده باقی می‌مانند. کاملاً با computed از signal سرویس
 * تغذیه می‌شود، بدون هیچ منطق اضافه در کامپوننت.
 */
@Component({
  selector: 'flow-drop-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (indicator().visible) {
      @if (indicator().highlightRect; as r) {
        <div class="flow-nest-highlight"
             [style.top.px]="r.top" [style.left.px]="r.left"
             [style.width.px]="r.width" [style.height.px]="r.height">
        </div>
      } @else if (indicator().orientation === 'h') {
        <div class="flow-indicator flow-indicator--h"
             [style.top.px]="indicator().y" [style.left.px]="indicator().x"
             [style.width.px]="indicator().length">
        </div>
      } @else if (indicator().orientation === 'v') {
        <div class="flow-indicator flow-indicator--v"
             [style.top.px]="indicator().y" [style.left.px]="indicator().x"
             [style.height.px]="indicator().length">
        </div>
      }
    }
  `,
  styles: [`
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
    .flow-indicator {
      position: fixed;
      background: var(--flow-accent, #146ef5);
      border-radius: 2px;
      pointer-events: none;
    }
    .flow-indicator--h { height: 3px; transform: translateY(-1.5px); }
    .flow-indicator--v { width: 3px; transform: translateX(-1.5px); }
    .flow-nest-highlight {
      position: fixed;
      border: 2px solid var(--flow-accent, #146ef5);
      background: color-mix(in srgb, var(--flow-accent, #146ef5) 10%, transparent);
      border-radius: 4px;
      pointer-events: none;
    }
  `],
})
export class FlowDropIndicatorComponent {
  private readonly dropPos = inject(DropPositionService);
  readonly indicator = computed(() => this.dropPos.indicator());
}
