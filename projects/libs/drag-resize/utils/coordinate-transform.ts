/**
 * Coordinate conversion helpers for transformed drag surfaces.
 *
 * PointerEvent.clientX/clientY and getBoundingClientRect() are always expressed in
 * viewport CSS pixels. CSS translate values, on the other hand, are expressed in the
 * element's local coordinate system. These helpers bridge the two spaces.
 *
 * The composed matrix includes CSS transforms (including nested scale/translate/rotate)
 * from the element itself through its ancestors. Translation components are deliberately
 * ignored because this API converts vectors, not points. CSS `zoom` is included as well.
 */
export interface ICoordinatePoint {
  x: number;
  y: number;
}

export function viewportDeltaToLocal(
  element: HTMLElement,
  delta: ICoordinatePoint,
  includeElementTransform = true,
): ICoordinatePoint {
  const inverse = invertLinear(getLocalToViewportMatrix(element, includeElementTransform));
  return applyLinear(inverse, delta);
}

/**
 * Inverse of a 2D linear transform, or `null` when it is not invertible (zero-scale ancestor).
 * Exposed so hot paths (every pointer move) can compute the matrix ONCE per drag instead of
 * walking the ancestor chain with `getComputedStyle` on every event.
 */
export function invertLinear(matrix: ILinearTransform): ILinearTransform | null {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-8) return null;
  return {
    a: matrix.d / determinant,
    b: -matrix.b / determinant,
    c: -matrix.c / determinant,
    d: matrix.a / determinant,
  };
}

/** Applies a linear transform to a vector. A `null` matrix (see `invertLinear`) yields `{0,0}`. */
export function applyLinear(matrix: ILinearTransform | null, delta: ICoordinatePoint): ICoordinatePoint {
  if (!matrix) return { x: 0, y: 0 };
  return {
    x: matrix.a * delta.x + matrix.c * delta.y,
    y: matrix.b * delta.x + matrix.d * delta.y,
  };
}

/**
 * Converts a SIZE measured in the viewport pixels of `fromDocument` into the viewport pixels of
 * `toDocument` (they differ when the iframe element is scaled, e.g. a zoomed-out device preview).
 * Returns `null` when the documents are unrelated / cross-origin.
 */
export function convertSizeBetweenDocuments(
  size: ICoordinatePoint,
  fromDocument: Document,
  toDocument: Document,
): ICoordinatePoint | null {
  if (fromDocument === toDocument) return { ...size };
  const a = convertPointBetweenDocuments({ x: 0, y: 0 }, fromDocument, toDocument);
  const b = convertPointBetweenDocuments({ x: size.x, y: size.y }, fromDocument, toDocument);
  if (!a || !b) return null;
  return { x: b.x - a.x, y: b.y - a.y };
}

/**
 * Axis scale (always positive) between `element`'s local CSS pixels and viewport pixels,
 * i.e. how many screen pixels one CSS pixel inside `element` occupies. Rotation is ignored.
 */
export function getLocalScale(element: HTMLElement): ICoordinatePoint {
  const m = getLocalToViewportMatrix(element);
  return { x: Math.hypot(m.a, m.b) || 1, y: Math.hypot(m.c, m.d) || 1 };
}

export function localDeltaToViewport(
  element: HTMLElement,
  delta: ICoordinatePoint,
): ICoordinatePoint {
  const matrix = getLocalToViewportMatrix(element);
  return {
    x: matrix.a * delta.x + matrix.c * delta.y,
    y: matrix.b * delta.x + matrix.d * delta.y,
  };
}

/** Returns the composed 2D linear transform from element-local to viewport space. */
export interface ILinearTransform {
  a: number;
  b: number;
  c: number;
  d: number;
}

/** Returns the composed 2D linear transform from element-local to viewport space. */
export function getLocalToViewportMatrix(
  element: HTMLElement,
  includeElementTransform = true,
): ILinearTransform {
  const win = element.ownerDocument.defaultView;
  if (!win || typeof win.DOMMatrix !== 'function') {
    return { a: 1, b: 0, c: 0, d: 1 };
  }

  let result: ILinearTransform = { a: 1, b: 0, c: 0, d: 1 };
  let current: HTMLElement | null = includeElementTransform ? element : element.parentElement;

  while (current) {
    const style = win.getComputedStyle(current);
    const transform = style.transform;

    if (transform && transform !== 'none') {
      try {
        const matrix = new win.DOMMatrix(transform);
        result = multiplyLinear({ a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d }, result);
      } catch {
        // Ignore unsupported/malformed transforms and continue with remaining ancestors.
      }
    }

    // CSS `zoom` is not represented consistently in computed `transform` across browsers.
    const zoom = Number.parseFloat(style.getPropertyValue('zoom'));
    if (Number.isFinite(zoom) && zoom > 0 && zoom !== 1) {
      result = multiplyLinear({ a: zoom, b: 0, c: 0, d: zoom }, result);
    }

    current = current.parentElement;
  }

  return result;
}

function multiplyLinear(left: ILinearTransform, right: ILinearTransform): ILinearTransform {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
  };
}

/**
 * Converts a client-space point from one same-origin Document viewport to another.
 * The conversion walks both frameElement chains through their common top-level document.
 * Cross-origin frame boundaries cannot be inspected and return null.
 */
export function convertPointBetweenDocuments(
  point: ICoordinatePoint,
  fromDocument: Document,
  toDocument: Document,
): ICoordinatePoint | null {
  if (fromDocument === toDocument) return { ...point };

  const toTop = (doc: Document, value: ICoordinatePoint) => {
    let current = doc;
    let result = { ...value };
    const visited = new Set<Document>();

    while (current.defaultView?.frameElement) {
      if (visited.has(current)) return null;
      visited.add(current);

      let frame: Element;
      try {
        frame = current.defaultView.frameElement;
      } catch {
        return null;
      }

      const iframe = frame as HTMLElement;
      const rect = iframe.getBoundingClientRect();
      const scaleX = iframe.offsetWidth ? rect.width / iframe.offsetWidth : 1;
      const scaleY = iframe.offsetHeight ? rect.height / iframe.offsetHeight : 1;

      result = {
        x: rect.left + iframe.clientLeft * scaleX + result.x * scaleX,
        y: rect.top + iframe.clientTop * scaleY + result.y * scaleY,
      };
      current = iframe.ownerDocument;
    }

    return { document: current, point: result };
  };

  const from = toTop(fromDocument, point);
  if (!from) return null;

  const targetFrames: HTMLIFrameElement[] = [];
  let current: Document | null = toDocument;
  const visited = new Set<Document>();

  while (current && current !== from.document) {
    if (visited.has(current)) return null;
    visited.add(current);

    let frame: Element | null;
    try {
      frame = current.defaultView?.frameElement ?? null;
    } catch {
      return null;
    }
    if (!frame) return null;

    targetFrames.push(frame as HTMLIFrameElement);
    current = frame.ownerDocument;
  }

  if (current !== from.document) return null;

  let result = from.point;
  for (let i = targetFrames.length - 1; i >= 0; i--) {
    const iframe = targetFrames[i];
    const rect = iframe.getBoundingClientRect();
    const scaleX = iframe.offsetWidth ? rect.width / iframe.offsetWidth : 1;
    const scaleY = iframe.offsetHeight ? rect.height / iframe.offsetHeight : 1;

    result = {
      x: (result.x - rect.left) / scaleX - iframe.clientLeft,
      y: (result.y - rect.top) / scaleY - iframe.clientTop,
    };
  }

  return result;
}
