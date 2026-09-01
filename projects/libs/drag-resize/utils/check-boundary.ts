/**
 * Boundary clamping utilities.
 * All functions work purely in viewport ("client") coordinates so they can be
 * reused identically for translate-based dragging and left/top-based resizing.
 */
const TOLERANCE = 0.5;

/** Clamps a proposed vertical delta so the element's rect stays inside the boundary rect. */
export function checkBoundY(selfRect: DOMRect, boundaryRect: DOMRect | undefined, offsetY: number): number {
  if (!boundaryRect) return offsetY;
  const newTop = selfRect.top + offsetY;
  const newBottom = selfRect.bottom + offsetY;
  if (newTop < boundaryRect.top + TOLERANCE) return offsetY + (boundaryRect.top - newTop);
  if (newBottom > boundaryRect.bottom - TOLERANCE) return offsetY - (newBottom - boundaryRect.bottom);
  return offsetY;
}

/** Clamps a proposed horizontal delta so the element's rect stays inside the boundary rect. */
export function checkBoundX(selfRect: DOMRect, boundaryRect: DOMRect | undefined, offsetX: number): number {
  if (!boundaryRect) return offsetX;
  const newLeft = selfRect.left + offsetX;
  const newRight = selfRect.right + offsetX;
  if (newLeft < boundaryRect.left + TOLERANCE) return offsetX + (boundaryRect.left - newLeft);
  if (newRight > boundaryRect.right - TOLERANCE) return offsetX - (newRight - boundaryRect.right);
  return offsetX;
}

/**
 * Clamps a resize result (width/height/left/top, all relative CSS px deltas from the
 * element's start position) so the element never grows/moves outside `boundaryRect`.
 * `startRect` is the element's `getBoundingClientRect()` captured at resize-start.
 */
export function clampResizeWithinBoundary(
  boundaryRect: DOMRect | undefined,
  startRect: DOMRect,
  width: number,
  height: number,
  left: number,
  top: number,
): { width: number; height: number; left: number; top: number } {
  if (!boundaryRect) return { width, height, left, top };

  // Viewport position implied by the proposed left/top deltas.
  const viewportLeft = startRect.left + left;
  const viewportTop = startRect.top + top;

  let clampedWidth = width;
  let clampedHeight = height;
  let clampedLeft = left;
  let clampedTop = top;

  if (viewportLeft < boundaryRect.left) {
    const overflow = boundaryRect.left - viewportLeft;
    clampedLeft = left + overflow;
    clampedWidth = Math.max(0, clampedWidth - overflow);
  }
  if (viewportTop < boundaryRect.top) {
    const overflow = boundaryRect.top - viewportTop;
    clampedTop = top + overflow;
    clampedHeight = Math.max(0, clampedHeight - overflow);
  }

  const clampedViewportLeft = startRect.left + clampedLeft;
  const rightEdge = clampedViewportLeft + clampedWidth;
  if (rightEdge > boundaryRect.right) {
    clampedWidth = Math.max(0, boundaryRect.right - clampedViewportLeft);
  }

  const clampedViewportTop = startRect.top + clampedTop;
  const bottomEdge = clampedViewportTop + clampedHeight;
  if (bottomEdge > boundaryRect.bottom) {
    clampedHeight = Math.max(0, boundaryRect.bottom - clampedViewportTop);
  }

  return { width: clampedWidth, height: clampedHeight, left: clampedLeft, top: clampedTop };
}

/** Current page zoom level (1 = 100%). Falls back to devicePixelRatio pre visualViewport. */
export function getPageZoom(): number {
  return window.visualViewport?.scale ?? window.devicePixelRatio ?? 1;
}

/** Adjusts a raw pointer-derived value for the current page zoom level. */
export function adjustForZoom(value: number): number {
  const zoom = getPageZoom();
  return zoom ? value / zoom : value;
}
