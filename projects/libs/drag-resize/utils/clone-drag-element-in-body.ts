import { copyComputedStyleTree } from './styling';

export interface DragPreviewState {
  element: HTMLElement;
  offsetX: number;
  offsetY: number;
}

export function cloneDragElementInBody(
  dragEl: HTMLElement,
  rect: DOMRect,
  pointerX: number,
  pointerY: number,
): DragPreviewState {
  const clone = dragEl.cloneNode(true) as HTMLElement;

  clone.removeAttribute('id');
  clone.classList.add('ngx-drag-in-body');
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('data-ngx-drag-preview', '');

  copyComputedStyleTree(dragEl, clone);

  // It is now detached from the original containing block.
  clone.style.setProperty('position', 'fixed', 'important');
  clone.style.setProperty('top', `${rect.top}px`, 'important');
  clone.style.setProperty('left', `${rect.left}px`, 'important');
  clone.style.setProperty('width', `${rect.width}px`, 'important');
  clone.style.setProperty('height', `${rect.height}px`, 'important');
  clone.style.setProperty('margin', '0', 'important');
  clone.style.setProperty('pointer-events', 'none', 'important');
  clone.style.setProperty('user-select', 'none', 'important');
  clone.style.setProperty('opacity', '0.88', 'important');
  clone.style.setProperty('z-index', '2147483647', 'important');
  clone.style.setProperty('transition', 'none', 'important');
  clone.style.setProperty('animation', 'none', 'important');
  clone.style.setProperty('transform-origin', '0 0', 'important');
  clone.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
  clone.style.setProperty('box-sizing', 'border-box', 'important');
  clone.style.setProperty('contain', 'layout style paint', 'important');

  document.body.appendChild(clone);

  return {
    element: clone,
    offsetX: pointerX - rect.left,
    offsetY: pointerY - rect.top,
  };
}
