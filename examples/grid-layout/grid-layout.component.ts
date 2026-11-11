import { Component, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GridItemConfig,
  IGridLayoutOptions,
  LayoutOutput,
  NgxGridLayoutModule,
} from 'ngx-kit/grid-layout';
import { NgxGridLayoutComponent } from 'ngx-kit/grid-layout';
import { NgxInputColor } from 'ngx-kit/color-picker';

export interface SampleLayout {
  id: string;
  type: string;
  icon?: string;
  title: string;
  description: string;
  config: GridItemConfig;
}
@Component({
  selector: 'app-grid-layout',
  imports: [FormsModule, NgxGridLayoutModule, NgxInputColor],
  templateUrl: './grid-layout.component.html',
  styleUrl: './grid-layout.component.scss',
})
export class GridLayoutComponent implements OnInit {
  ngxGridLayout = viewChild<NgxGridLayoutComponent>('ngxGridLayout');
  gridSettings = {
    editMode: false,
    pushOnDrag: true,
  };

  gridOptions: IGridLayoutOptions = {
    cols: 12,
    rowHeight: 80,
    gap: 10,
    compact: 'vertical',
    flow: 'vertical',
    animate: true,
    swap: false,
    pushItems: true,
    gridBackgroundConfig: {
      borderWidth: 1,
      borderColor: '#e0e0e065',
      gapColor: '#c8c8c83f',
      rowColor: 'rgba(0,0,0,0.02)',
      columnColor: 'rgba(0,0,0,0.02)',
    },
  };

  items = signal<SampleLayout[]>([]);

  DEFAULT_ITEMS: SampleLayout[] = [
    {
      id: 'chart-1',
      type: 'chart',
      icon: '📊',
      title: 'Sales chart',
      description: 'Monthly sales overview',
      config: new GridItemConfig(0, 0, 6, 3),
    },
    {
      id: 'stats-1',
      type: 'stats',
      icon: '📈',
      title: 'Total statistics',
      description: 'A snapshot of your audience',
      config: new GridItemConfig(6, 0, 3, 2),
    },
    {
      id: 'info-1',
      type: 'info',
      icon: 'ℹ️',
      title: 'Info statistics',
      description: 'Conversion performance',
      config: new GridItemConfig(9, 0, 3, 2),
    },
    {
      id: 'content-1',
      type: 'content',
      icon: '📝',
      title: 'Content statistics',
      description: 'Your workspace health',
      config: new GridItemConfig(0, 3, 4, 2),
    },
    {
      id: 'chart-2',
      type: 'cost',
      icon: '📉',
      title: 'Cost chart',
      description: 'Operating expenses',
      config: new GridItemConfig(4, 3, 4, 2),
    },
    {
      id: 'stats-2',
      type: 'income',
      icon: '💰',
      title: 'Income',
      description: 'Monthly revenue',
      config: new GridItemConfig(8, 3, 4, 2),
    },
    {
      id: 'STATIC',
      type: 'Static',
      icon: 'S',
      title: 'Pinned widget',
      description: 'This widget stays right where you put it.',
      config: new GridItemConfig(7, 7, 2, 2, true),
    },
  ];

  ngOnInit(): void {
    this.items.set(this.copyItems(this.DEFAULT_ITEMS));
  }

  onLayoutChange(layout: LayoutOutput[]): void {
    const positions = new Map(layout.map((item) => [item.id, item] as const));
    this.items.update((items) =>
      items.map((item) => {
        const position = positions.get(item.id);
        if (!position) return item;
        return {
          ...item,
          config: Object.assign(new GridItemConfig(), item.config, {
            x: position.x,
            y: position.y,
            w: position.w,
            h: position.h,
          }),
        };
      }),
    );
  }

  update(): void {
    this.ngxGridLayout()?.update(this.gridOptions);
  }

  addRandomItem(): void {
    const newNumber = this.items().length + 1;
    const randomW = Math.floor(Math.random() * 3) + 2; // 2-4
    const randomH = Math.floor(Math.random() * 2) + 2; // 2-3

    const newItem: SampleLayout = {
      id: `test-${Date.now()}`,
      icon: '✦',
      title: `New widget ${newNumber}`,
      description: 'Drag and resize this widget to make it yours.',
      type: 'custom',
      config: new GridItemConfig(0, 0, randomW, randomH),
    };

    this.items.update((u) => [...u, newItem]);
  }

  removeItem(id: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
    this.update();
  }

  resetToDefault(): void {
    this.items.set(this.copyItems(this.DEFAULT_ITEMS));
    setTimeout(() => {
      this.update();
    });
  }

  private copyItems(items: readonly SampleLayout[]): SampleLayout[] {
    return items.map((item) => ({
      ...item,
      config: Object.assign(new GridItemConfig(), item.config),
    }));
  }
}
