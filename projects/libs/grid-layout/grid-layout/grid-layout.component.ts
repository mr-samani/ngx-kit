import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GridLayoutService, GridItemState } from '../services/grid-layout.service';
import { GridLayoutOptions, IGridLayoutOptions } from '../options/options';
import { LayoutOutput } from '../options/layout-output';

@Component({
  selector: 'ngx-grid-layout',
  standalone: true,
  template: `
    <div class="ngx-grid-layout__surface"><ng-content /></div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        contain: layout style;
        min-height: 1px;
      }
      .ngx-grid-layout__surface {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: inherit;
      }
      .ngx-grid-layout__surface::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-size: calc(
            (100% - var(--grid-gap) * (var(--grid-cols) - 1)) / var(--grid-cols) + var(--grid-gap)
          )
          var(--grid-row);
        background-image:
          linear-gradient(to right, var(--grid-col-color) 1px, transparent 1px),
          linear-gradient(to bottom, var(--grid-row-color) 1px, transparent 1px);
        opacity: var(--grid-bg-opacity);
        border: var(--grid-border-width) solid var(--grid-border-color);
        box-sizing: border-box;
      }
      .ngx-grid-layout--dragging .ngx-grid-layout__surface::before {
        opacity: 1;
      }
    `,
  ],
  host: {
    '[class.ngx-grid-layout--dragging]': 'service.isInteracting()',
    '[style.height.px]': 'service.height()',
    '[attr.dir]': 'dir()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridLayoutComponent {
  readonly options = input<IGridLayoutOptions>(new GridLayoutOptions());
  readonly editMode = input(true);
  readonly layoutChange = output<LayoutOutput[]>();
  readonly dir = input<'ltr' | 'rtl'>('ltr');
  readonly service = inject(GridLayoutService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private initialized = signal(false);
  constructor() {
    effect(() => {
      this.service.setOptions(this.options());
      this.service.setEditMode(this.editMode());
    });
    effect(() => {
      this.service.connect((layout) => this.layoutChange.emit(layout));
    });
  }
  ngAfterViewInit(): void {
    const surface = this.el.nativeElement.querySelector('.ngx-grid-layout__surface') as HTMLElement;
    this.service.attachElement(surface);
    this.initialized.set(true);
    this.setCss();
    new ResizeObserver(() => this.setCss()).observe(surface);
  }
  setItems(items: GridItemState[]): void {
    this.service.setItems(items);
  }
  update(options: Partial<IGridLayoutOptions>): void {
    this.service.setOptions(options);
  }
  private setCss(): void {
    const el = this.el.nativeElement,
      o = this.service.options();
    el.style.setProperty('--grid-cols', String(o.cols));
    el.style.setProperty('--grid-gap', `${o.gap ?? 0}px`);
    el.style.setProperty('--grid-row', `${o.rowHeight === 'fit' ? 100 : o.rowHeight}px`);
    const b = o.gridBackgroundConfig;
    el.style.setProperty('--grid-border-width', `${b?.borderWidth ?? 0}px`);
    el.style.setProperty('--grid-border-color', b?.borderColor ?? 'transparent');
    el.style.setProperty('--grid-row-color', b?.rowColor ?? 'transparent');
    el.style.setProperty('--grid-col-color', b?.columnColor ?? 'transparent');
    el.style.setProperty(
      '--grid-bg-opacity',
      b?.show === 'never'
        ? '0'
        : b?.show === 'whenDragging'
          ? this.service.isInteracting()
            ? '1'
            : '0'
          : '1',
    );
  }
}
