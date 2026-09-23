import { copyComputedStyleTree } from './styling';

export interface DragPreviewState {
  element: HTMLElement;
  offsetX: number;
  offsetY: number;
}

/** Above any app chrome (modals, sticky headers) but below the browser's own UI. */
const PREVIEW_Z_INDEX = '2147483000';

/**
 * Creates the visual that follows the pointer while an item of a drop list is dragged.
 *
 * It is appended to `<body>` with `position: fixed`, so no ancestor of the original item
 * (`overflow: hidden`, scroll containers, clipping, transformed/positioned parents) can clip
 * or offset it. Computed styles are copied recursively first, because once the clone leaves
 * its list every selector that depended on an ancestor (`.column .card {}`) and every
 * inherited property (font, colour, `direction`) would otherwise be lost.
 *
 * Only used for drop-list drags. Free drag never calls this.
 */
export function cloneDragElementInBody(
  dragEl: HTMLElement,
  rect: DOMRect,
  pointerX: number,
  pointerY: number,
): DragPreviewState {
  const doc = dragEl.ownerDocument;
  const preview = dragEl.cloneNode(true) as HTMLElement;

  // Avoid duplicated ids in the document.
  preview.removeAttribute('id');
  preview.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  preview.classList.add('ngx-drag-preview');
  preview.setAttribute('aria-hidden', 'true');
  preview.setAttribute('inert', '');

  copyComputedStyleTree(dragEl, preview);

  Object.assign(preview.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    right: 'auto',
    bottom: 'auto',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    transition: 'none',
    animation: 'none',
    transform: 'none',
    visibility: 'visible',
    display: preview.style.display === 'none' ? '' : preview.style.display,
    willChange: 'transform',
    zIndex: PREVIEW_Z_INDEX,
  });

  doc.body.appendChild(preview);

  return {
    element: preview,
    offsetX: pointerX - rect.left,
    offsetY: pointerY - rect.top,
  };
}
