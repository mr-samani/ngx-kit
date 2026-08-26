const TOLERANCE = 1;

export function checkBoundY(selfRec: DOMRect, boundaryDomRec: DOMRect | undefined, offsetY: number): number {
  if (!boundaryDomRec) return offsetY;
  const newTop = selfRec.top + offsetY;
  const newBottom = selfRec.bottom + offsetY;
  // Check top boundary
  if (newTop < boundaryDomRec.top + TOLERANCE) return offsetY + (boundaryDomRec.top - newTop);
  // Check bottom boundary
  if (newBottom > boundaryDomRec.bottom - TOLERANCE) return offsetY - (newBottom - boundaryDomRec.bottom);
  return offsetY;
}

export function checkBoundX(selfRec: DOMRect, boundaryDomRec: DOMRect | undefined, offsetX: number): number {
  if (!boundaryDomRec) return offsetX;
  const newLeft = selfRec.left + offsetX;
  const newRight = selfRec.right + offsetX;
  // Check left boundary
  if (newLeft < boundaryDomRec.left + TOLERANCE) return offsetX + (boundaryDomRec.left - newLeft);
  // Check right boundary
  if (newRight > boundaryDomRec.right - TOLERANCE) return offsetX - (newRight - boundaryDomRec.right);
  return offsetX;
}

/**
 * ✅ Clamp resize within boundary
 * @param boundaryDomRec - Boundary element rectangle (viewport coordinates)
 * @param el - Element being resized
 * @param newWidth - Proposed new width
 * @param newHeight - Proposed new height
 * @param newLeft - Proposed new left position (relative to current position)
 * @param newTop - Proposed new top position (relative to current position)
 * @returns Clamped dimensions and position
 */
export function clampWithinBoundary(
  boundaryDomRec: DOMRect | undefined,
  el: HTMLElement,
  newWidth: number,
  newHeight: number,
  newLeft: number,
  newTop: number
): { width: number; height: number; left: number; top: number } {
  if (!boundaryDomRec) {
    return { width: newWidth, height: newHeight, left: newLeft, top: newTop };
  }

  // ✅ Get element's CURRENT position in viewport
  const currentRect = el.getBoundingClientRect();

  // ✅ Calculate where element WOULD BE after applying new values
  // currentRect gives us viewport position, newLeft/newTop are CSS left/top values
  const computed = getComputedStyle(el);
  const currentCSSLeft = parseFloat(computed.left || '0');
  const currentCSSTop = parseFloat(computed.top || '0');

  // Calculate the offset between current CSS values and new values
  const leftDelta = newLeft - currentCSSLeft;
  const topDelta = newTop - currentCSSTop;

  // Calculate new viewport position
  const newViewportLeft = currentRect.left + leftDelta;
  const newViewportTop = currentRect.top + topDelta;
  // const newViewportRight = newViewportLeft + newWidth;
  //const newViewportBottom = newViewportTop + newHeight;

  let clampedWidth = newWidth;
  let clampedHeight = newHeight;
  let clampedLeft = newLeft;
  let clampedTop = newTop;

  // ✅ Clamp left edge
  if (newViewportLeft < boundaryDomRec.left) {
    const overflow = boundaryDomRec.left - newViewportLeft;
    clampedLeft = newLeft + overflow;
    clampedWidth = Math.max(0, clampedWidth - overflow);
  }

  // ✅ Clamp top edge
  if (newViewportTop < boundaryDomRec.top) {
    const overflow = boundaryDomRec.top - newViewportTop;
    clampedTop = newTop + overflow;
    clampedHeight = Math.max(0, clampedHeight - overflow);
  }

  // ✅ Clamp right edge
  const clampedViewportLeft = newViewportLeft + (clampedLeft - newLeft);
  const clampedRightEdge = clampedViewportLeft + clampedWidth;
  if (clampedRightEdge > boundaryDomRec.right) {
    clampedWidth = Math.max(0, boundaryDomRec.right - clampedViewportLeft);
  }

  // ✅ Clamp bottom edge
  const clampedViewportTop = newViewportTop + (clampedTop - newTop);
  const clampedBottomEdge = clampedViewportTop + clampedHeight;
  if (clampedBottomEdge > boundaryDomRec.bottom) {
    clampedHeight = Math.max(0, boundaryDomRec.bottom - clampedViewportTop);
  }

  return {
    width: clampedWidth,
    height: clampedHeight,
    left: clampedLeft,
    top: clampedTop,
  };
}

/**
 * Get zoom level of the page
 * @returns Current zoom level (1.0 = 100%, 1.5 = 150%, etc.)
 */
export function getPageZoom(): number {
  // Modern browsers
  if (window.visualViewport) {
    return window.visualViewport.scale;
  }

  // Fallback
  return window.devicePixelRatio || 1;
}

/**
 * Adjust coordinates for page zoom
 * @param value - Value to adjust
 * @returns Adjusted value accounting for zoom
 */
export function adjustForZoom(value: number): number {
  const zoom = getPageZoom();
  return value / zoom;
}
