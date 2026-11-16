import { NgxDraggable, NgxResizable, NgxDropListGroup, NgxDropList } from 'ngx-kit/drag-resize';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DirectionService } from 'ngx-kit/core';
import { NgxResizeHandle } from 'ngx-kit/drag-resize';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

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
  imports: [
    CommonModule,
    NgxDraggable,
    NgxResizable,
    NgxResizeHandle,
    NgxDropListGroup,
    NgxDropList,
    ExampleShowcaseComponent,
  ],
  templateUrl: './drag-resize.component.html',
  styleUrl: './drag-resize.component.scss',
})
export class DragResizeComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/drag-resize/drag-resize.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/drag-resize/drag-resize.component.html', language: 'html' },
    { label: 'SCSS', path: 'examples/drag-resize/drag-resize.component.scss', language: 'scss' },
  ];

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------
  protected readonly route = inject(ActivatedRoute);
  protected readonly direction = inject(DirectionService);

  readonly selectedExample = signal('overview');
  readonly examples = [
    { id: 'overview', label: 'Overview' },
    { id: 'drag', label: 'Drag' },
    { id: 'resize', label: 'Resize' },
    { id: 'combined', label: 'Combined' },
    { id: 'positions', label: 'Positions' },
    { id: 'boundary', label: 'Boundary' },
    { id: 'handle', label: 'Handle' },
    { id: 'scroll', label: 'Scroll' },
    { id: 'multiple', label: 'Multiple' },
    { id: 'resizepan', label: 'Resize pane' },
    { id: 'interaction', label: 'Interactive' },
  ] as const;

  // ---------------------------------------------------------
  // Playground state
  // ---------------------------------------------------------
  readonly isRtl = this.direction.isRtl();

  readonly showGrid = signal(true);

  readonly gridSize = signal(20);

  readonly events = signal<DemoEvent[]>([]);

  readonly selectedElement = signal<string | null>(null);

  readonly demoX = signal(120);

  readonly demoY = signal(80);

  readonly demoWidth = signal(280);

  readonly demoHeight = signal(160);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  readonly showCode = signal(true);

  readonly showEvents = signal(true);
  readonly copyStatus = signal('');

  // ---------------------------------------------------------
  // Computed
  // ---------------------------------------------------------

  readonly generatedCode = computed(() => {
    return `<div
  class="demo-item"
  ngxDraggable
  ngxResizable 
  (dragEnd)="onDragEnd($event)"
  (resizeEnd)="onResizeEnd($event)">
  Drag & Resize
</div>`;
  });
  private eventId = 0;

  constructor() {
    this.route.fragment.pipe(takeUntilDestroyed()).subscribe((f) => {
      this.selectedExample.set(f ?? 'overview');
    });
  }

  selectExample(id: string): void {
    this.selectedExample.set(id);
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

  toggleEvents(): void {
    this.showEvents.update((value) => !value);
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedCode());
      this.copyStatus.set('Code copied.');
    } catch {
      this.copyStatus.set('Clipboard access is unavailable.');
    }
  }

  // ---------------------------------------------------------
  // Events
  // ---------------------------------------------------------

  onDragStart(event?: unknown): void {
    this.addEvent({
      type: 'dragStart',
      x: this.readNumber(event, 'x'),
      y: this.readNumber(event, 'y'),
    });
  }

  onDragEnd(event: unknown): void {
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

  onResizeStart(event?: unknown): void {
    this.addEvent({
      type: 'resizeStart',
      width: this.readNumber(event, 'width'),
      height: this.readNumber(event, 'height'),
    });
  }

  onResizeEnd(event: unknown): void {
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
      id: ++this.eventId,
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

  private readNumber(event: unknown, key: 'x' | 'y' | 'width' | 'height'): number | undefined {
    if (typeof event !== 'object' || event === null || !(key in event)) {
      return undefined;
    }

    const value: unknown = Reflect.get(event, key);

    return typeof value === 'number' ? Math.round(value) : undefined;
  }
}
