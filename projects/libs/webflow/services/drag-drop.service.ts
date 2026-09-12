import { Injectable, signal } from '@angular/core';
import { DropResult } from '../models/types';

/**
 * DragDropService
 * -------------------------------------------------------------
 * وضعیت سراسریِ «چه چیزی الان در حال درگ است» را نگه می‌دارد.
 * فقط signal، بدون هیچ Subject/Observable اضافه — سبک و قابل‌پیش‌بینی.
 */
@Injectable({ providedIn: 'root' })
export class DragDropService {
  /** id آیتمی که هم‌اکنون درگ می‌شود، یا null */
  readonly activeId = signal<string | null>(null);

  /** آخرین نتیجهٔ محاسبه‌شدهٔ drop توسط DropPositionService */
  readonly pendingDrop = signal<DropResult | null>(null);

  startDrag(id: string): void {
    this.activeId.set(id);
    this.pendingDrop.set(null);
  }

  setPendingDrop(result: DropResult | null): void {
    this.pendingDrop.set(result);
  }

  endDrag(): DropResult | null {
    const result = this.pendingDrop();
    this.activeId.set(null);
    this.pendingDrop.set(null);
    return result;
  }

  get isDragging(): boolean {
    return this.activeId() !== null;
  }
}
