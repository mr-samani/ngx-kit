import { IPosition, IResizableOutput, NgxDraggable, NgxResizable } from 'ngx-kit/drag-resize';
import { Component, computed, inject, signal, type OnDestroy, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { IAppMenu } from '@demo/shared/interfaces/IAppMenu';
import { ActivatedRoute } from '@angular/router';

type Direction = 'ltr' | 'rtl';

type PositionMode = 'static' | 'relative' | 'absolute' | 'fixed';

type DemoEventType = 'dragStart' | 'dragEnd' | 'resizeStart' | 'resizeEnd';

interface DemoEvent {
  id: number;
  type: DemoEventType;
  time: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-drag-resize',
  imports: [CommonModule, NgxDraggable, NgxResizable],
  templateUrl: './drag-resize.component.html',
  styleUrl: './drag-resize.component.scss',
})
export class DragResizeComponent implements OnInit, OnDestroy {
  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------
  protected readonly route = inject(ActivatedRoute);

  readonly selectedExample = signal('overview');

  // ---------------------------------------------------------
  // Playground state
  // ---------------------------------------------------------

  readonly direction = signal<Direction>('ltr');

  readonly darkMode = signal(false);

  readonly showGrid = signal(true);

  readonly gridSize = signal(20);

  readonly selectedPosition = signal<PositionMode>('absolute');

  readonly events = signal<DemoEvent[]>([]);

  readonly selectedElement = signal<string | null>(null);

  readonly demoX = signal(120);

  readonly demoY = signal(80);

  readonly demoWidth = signal(280);

  readonly demoHeight = signal(160);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  readonly sidebarCollapsed = signal(false);

  readonly showCode = signal(true);

  readonly showEvents = signal(true);

  // ---------------------------------------------------------
  // Computed
  // ---------------------------------------------------------

  readonly directionLabel = computed(() =>
    this.direction() === 'rtl' ? 'Right to Left' : 'Left to Right',
  );

  readonly positionLabel = computed(() => this.selectedPosition());

  readonly generatedCode = computed(() => {
    const position = this.selectedPosition();

    return `<div
  class="demo-item"
  ngxDraggable
  ngxResizable
  style="position: ${position};"
  (dragEnd)="onDragEnd($event)"
  (resizeEnd)="onResizeEnd($event)">
  Drag & Resize
</div>`;
  });

  constructor() {
    this.route.fragment.subscribe((f) => {
      this.selectedExample.set(f ?? 'overview');
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------

  selectExample(id: string): void {
    this.selectedExample.set(id);
  }

  // ---------------------------------------------------------
  // Direction
  // ---------------------------------------------------------

  setDirection(direction: Direction): void {
    this.direction.set(direction);
  }

  // ---------------------------------------------------------
  // Position
  // ---------------------------------------------------------

  setPosition(position: PositionMode): void {
    this.selectedPosition.set(position);
  }

  // ---------------------------------------------------------
  // Theme
  // ---------------------------------------------------------

  toggleTheme(): void {
    this.darkMode.update((value) => !value);
  }

  // ---------------------------------------------------------
  // Grid
  // ---------------------------------------------------------

  toggleGrid(): void {
    this.showGrid.update((value) => !value);
  }

  // ---------------------------------------------------------
  // Code
  // ---------------------------------------------------------

  toggleCode(): void {
    this.showCode.update((value) => !value);
  }

  // ---------------------------------------------------------
  // Events
  // ---------------------------------------------------------

  onDragStart(event?: any): void {
    this.addEvent({
      type: 'dragStart',
      x: this.readNumber(event, 'x'),
      y: this.readNumber(event, 'y'),
    });
  }

  onDragEnd(event: any): void {
    const x = this.readNumber(event, 'x');
    const y = this.readNumber(event, 'y');

    if (x !== undefined) {
      this.demoX.set(x);
    }

    if (y !== undefined) {
      this.demoY.set(y);
    }

    this.addEvent({
      type: 'dragEnd',
      x,
      y,
    });
  }

  onResizeStart(event?: any): void {
    this.addEvent({
      type: 'resizeStart',
      width: this.readNumber(event, 'width'),
      height: this.readNumber(event, 'height'),
    });
  }

  onResizeEnd(event: any): void {
    const width = this.readNumber(event, 'width');
    const height = this.readNumber(event, 'height');

    if (width !== undefined) {
      this.demoWidth.set(width);
    }

    if (height !== undefined) {
      this.demoHeight.set(height);
    }

    this.addEvent({
      type: 'resizeEnd',
      width,
      height,
    });
  }

  private addEvent(event: Omit<DemoEvent, 'id' | 'time'>): void {
    const item: DemoEvent = {
      ...event,
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
    };

    this.events.update((events) => [item, ...events].slice(0, 30));
  }

  clearEvents(): void {
    this.events.set([]);
  }

  // ---------------------------------------------------------
  // Selected element
  // ---------------------------------------------------------

  selectElement(id: string): void {
    this.selectedElement.set(id);
  }

  // ---------------------------------------------------------
  // Utility
  // ---------------------------------------------------------

  private readNumber(event: any, key: string): number | undefined {
    if (!event) {
      return undefined;
    }

    const value = event[key];

    return typeof value === 'number' ? Math.round(value) : undefined;
  }

  trackByEvent(_: number, event: DemoEvent): number {
    return event.id;
  }
}
