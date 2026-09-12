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
  const preview = dragEl.cloneNode(true) as HTMLElement;

  // Avoid duplicated ids in the document.
  preview.removeAttribute('id');

  preview.classList.add('ngx-drag-preview');

  Object.assign(preview.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  });

  document.body.appendChild(preview);

  return {
    element: preview,
    offsetX: pointerX - rect.left,
    offsetY: pointerY - rect.top,
  };
}
