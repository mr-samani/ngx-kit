import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgxDraggable, NgxResizable, NgxDropList } from 'ngx-kit/drag-resize';
import {
  NgxGridLayoutComponent,
  NgxGridItemComponent,
  LayoutOutput,
  GridLayoutOptions,
} from 'ngx-kit/grid-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxGridLayoutComponent, NgxGridItemComponent, NgxDraggable, NgxResizable, NgxDropList],
  template: `
    <main [attr.dir]="rtl() ? 'rtl' : 'ltr'">
      <header>
        <h1>ngx-kit layout engine</h1>
        <button (click)="rtl.update((v) => !v)">
          {{ rtl() ? 'Switch to LTR' : 'Switch to RTL' }}
        </button>
      </header>
      <p>
        Drag, resize from any edge/corner, and switch compaction policies while the grid is live.
      </p>
      <ngx-grid-layout
        [dir]="rtl() ? 'rtl' : 'ltr'"
        [options]="options()"
        (layoutChange)="onLayout($event)">
        @for (item of items(); track item.id) {
          <ngx-grid-item [itemId]="item.id!" [config]="item">
            <article class="card">
              <strong>{{ item.id }}</strong>
              <small>{{ item.x }}, {{ item.y }} · {{ item.w }}×{{ item.h }}</small>
            </article>
          </ngx-grid-item>
        }
      </ngx-grid-layout>
      <h2>Flex-wrap drop list</h2>
      <section class="drop-list" NgxDropList>
        @for (item of flexItems(); track item) {
          <div class="chip" NgxDraggable>{{ item }}</div>
        }
      </section>
    </main>
  `,
  styles: [
    `
      main {
        font-family: system-ui;
        padding: 24px;
        max-width: 1100px;
        margin: auto;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ngx-grid-layout {
        border: 1px solid #ddd;
      }
      .card {
        height: 100%;
        box-sizing: border-box;
        border: 1px solid #bbb;
        border-radius: 12px;
        padding: 14px;
        background: canvas;
        display: flex;
        flex-direction: column;
        gap: 6px;
        cursor: grab;
      }
      .card small {
        opacity: 0.65;
      }
      .drop-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 16px;
        border: 1px dashed #aaa;
        min-height: 100px;
      }
      .chip {
        padding: 10px 14px;
        border-radius: 999px;
        background: #eee;
        cursor: grab;
      }
      button {
        padding: 8px 12px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly rtl = signal(false);
  readonly flexItems = signal(['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']);
  readonly items = signal<LayoutOutput[]>([
    { id: 'Analytics', x: 0, y: 0, w: 5, h: 3 },
    { id: 'Revenue', x: 5, y: 0, w: 3, h: 2 },
    { id: 'Users', x: 8, y: 0, w: 4, h: 4 },
    { id: 'Orders', x: 5, y: 2, w: 3, h: 2 },
    { id: 'Activity', x: 0, y: 3, w: 8, h: 3 },
  ]);
  readonly options = signal(new GridLayoutOptions());
  onLayout(v: LayoutOutput[]): void {
    this.items.set(v);
  }
}
