import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { GridLayoutService, GridItemState } from '../services/grid-layout.service';
import { GridLayoutOptions, IGridLayoutOptions } from '../options/options';
import { LayoutOutput } from '../options/layout-output';

@Component({
  selector: 'ngx-grid-layout',
  standalone: true,
  template: `
    <div class="ngx-grid-layout__surface">
      <div class="ngx-grid-layout__placeholder"></div>
      <ng-content />
    </div>
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
      .ngx-grid-layout__placeholder {
        display: none;
        position: absolute;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 0;
        border: 2px dashed currentColor;
        border-radius: inherit;
        opacity: 0.45;
      }

      .ngx-grid-layout__surface::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;

        opacity: var(--grid-bg-opacity);
        border: var(--grid-border-width) solid var(--grid-border-color);
        box-sizing: border-box;
        transition: opacity 0.15s ease;

        background-image:
          repeating-linear-gradient(
            var(--grid-border-color) 0 var(--grid-border-width),
            var(--grid-row-color) var(--grid-border-width)
              calc(var(--grid-row) - var(--grid-border-width)),
            var(--grid-border-color) calc(var(--grid-row) - var(--grid-border-width))
              calc(var(--grid-row)),
            var(--grid-gap-color) calc(var(--grid-row)) calc(var(--grid-row) + var(--grid-gap))
          ),
          repeating-linear-gradient(
            90deg,
            var(--grid-border-color) 0 var(--grid-border-width),
            var(--grid-col-color) var(--grid-border-width)
              calc(100% - (var(--grid-border-width) + var(--grid-gap))),
            var(--grid-border-color) calc(100% - (var(--grid-border-width) + var(--grid-gap)))
              calc(100% - var(--grid-gap)),
            var(--grid-gap-color) calc(100% - var(--grid-gap)) 100%
          );
        background-size: calc((100% + var(--grid-gap)) / var(--grid-cols))
          calc(var(--grid-row) + var(--grid-gap));
        background-position: 0 0;
      }
    `,
  ],
  host: {
    '[class.ngx-grid-layout--dragging]': 'service.isInteracting()',
    '[class.ngx-grid-layout--view]': '!editMode()',
    '[style.height.px]': 'service.height()',
    '[attr.dir]': 'dirOverride() ?? null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridLayoutComponent implements AfterViewInit, OnDestroy {
  readonly options = input<IGridLayoutOptions>(new GridLayoutOptions());
  readonly editMode = input(true);
  readonly layoutChange = output<LayoutOutput[]>();
  /** Explicit direction override. Leave unset to inherit the page/host direction automatically. */
  readonly dir = input<'ltr' | 'rtl' | undefined>(undefined);
  readonly dirOverride = this.dir;

  readonly service = inject(GridLayoutService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private surface?: HTMLElement;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const opts = { ...this.options() };
      if (this.dir()) opts.rtl = this.dir() === 'rtl';
      this.service.setOptions(opts);
      this.service.setEditMode(this.editMode());
    });

    this.service.connect((layout) => this.layoutChange.emit(layout));
  }

  ngAfterViewInit(): void {
    this.surface = this.el.nativeElement.querySelector('.ngx-grid-layout__surface') as HTMLElement;
    this.service.attachElement(this.surface);
    this.setCss();

    this.resizeObserver = new ResizeObserver(() => {
      this.service.refreshMetrics();
      this.setCss();
    });
    this.resizeObserver.observe(this.surface);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  setItems(items: GridItemState[]): void {
    this.service.setItems(items);
  }
  update(options: Partial<IGridLayoutOptions>): void {
    this.service.setOptions(options);
    this.setCss();
  }

  private setCss(): void {
    const el = this.el.nativeElement,
      o = this.service.options();
    el.style.setProperty('--grid-cols', String(o.cols));
    el.style.setProperty('--grid-gap', `${o.gap ?? 0}px`);
    el.style.setProperty('--grid-row', `${o.rowHeight === 'fit' ? 100 : o.rowHeight}px`);
    const b = o.gridBackgroundConfig;
    el.style.setProperty('--grid-gap-color', `${b.gapColor}`); 
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
