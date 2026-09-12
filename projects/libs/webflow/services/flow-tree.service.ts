import { Injectable, signal, computed } from '@angular/core';
import { DropResult } from '../models/types';

export interface FlowNode {
  id: string;
  type: string;
  axis: 'row' | 'column';
  isContainer: boolean;
  props?: Record<string, unknown>;
  children: FlowNode[];
}

/**
 * FlowTreeService
 * -------------------------------------------------------------
 * مدل درختیِ صفحه (دقیقاً همان چیزی که Webflow "Element Panel" اسمش
 * می‌گذارد). تغییر مدل فقط در لحظهٔ drop رخ می‌دهد (نه در هر
 * pointermove) — به همین دلیل حتی با هزاران بلاک، re-render فقط
 * یک‌بار در پایان درگ اتفاق می‌افتد.
 *
 * پیاده‌سازی immutable-ish: فقط مسیر تغییر‌یافته کپی می‌شود، نه کل
 * درخت (structural sharing) تا با درخت‌های بزرگ هم CPU/GC اذیت نشود.
 */
@Injectable({ providedIn: 'root' })
export class FlowTreeService {
  private readonly _root = signal<FlowNode>({
    id: 'root', type: 'root', axis: 'column', isContainer: true, children: [],
  });

  readonly root = computed(() => this._root());

  setRoot(node: FlowNode): void {
    this._root.set(node);
  }

  applyDrop(draggedId: string, drop: DropResult): void {
    const currentRoot = this._root();
    const dragged = findAndRemove(currentRoot, draggedId);
    if (!dragged.node) return;

    const afterRemoval = dragged.tree;
    const inserted = insertRelativeTo(afterRemoval, drop.targetId, drop.zone, dragged.node);
    if (inserted) this._root.set(inserted);
  }
}

function findAndRemove(node: FlowNode, id: string): { tree: FlowNode; node: FlowNode | null } {
  let removed: FlowNode | null = null;
  const idx = node.children.findIndex((c) => c.id === id);

  if (idx !== -1) {
    removed = node.children[idx];
    const children = [...node.children.slice(0, idx), ...node.children.slice(idx + 1)];
    return { tree: { ...node, children }, node: removed };
  }

  let changed = false;
  const newChildren = node.children.map((c) => {
    if (removed) return c;
    const res = findAndRemove(c, id);
    if (res.node) { removed = res.node; changed = true; return res.tree; }
    return c;
  });

  return { tree: changed ? { ...node, children: newChildren } : node, node: removed };
}

function insertRelativeTo(
  node: FlowNode, targetId: string, zone: DropResult['zone'], toInsert: FlowNode
): FlowNode | null {
  const idx = node.children.findIndex((c) => c.id === targetId);

  if (idx !== -1) {
    if (zone === 'inside') {
      const target = node.children[idx];
      const updatedTarget = { ...target, children: [...target.children, toInsert] };
      const children = [...node.children];
      children[idx] = updatedTarget;
      return { ...node, children };
    }
    const insertAt = zone === 'before' || zone === 'above' ? idx : idx + 1;
    const children = [...node.children.slice(0, insertAt), toInsert, ...node.children.slice(insertAt)];
    return { ...node, children };
  }

  for (let i = 0; i < node.children.length; i++) {
    const res = insertRelativeTo(node.children[i], targetId, zone, toInsert);
    if (res) {
      const children = [...node.children];
      children[i] = res;
      return { ...node, children };
    }
  }
  return null;
}
