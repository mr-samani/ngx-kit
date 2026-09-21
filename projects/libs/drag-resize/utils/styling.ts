/**
 * Copy the browser-resolved visual state of an element.
 *
 * A drag preview is moved to <body>, so selectors depending on ancestors no
 * longer apply. Copying computed styles (including custom properties) makes
 * the preview visually independent from the original DOM subtree.
 */
export function copyComputedStyle(source: Element, target: Element): void {
  copyStyleValues(source, target);

  // Make the preview deterministic once it is taken out of normal flow (root only:
  // descendants keep their own margins so the internal layout is unchanged).
  (target as HTMLElement).style.setProperty('margin', '0', 'important');
  (target as HTMLElement).style.setProperty('box-sizing', 'border-box', 'important');
}

function copyStyleValues(source: Element, target: Element): void {
  const computed = window.getComputedStyle(source);

  for (let i = 0; i < computed.length; i++) {
    const property = computed.item(i);
    const value = computed.getPropertyValue(property);

    if (value) {
      (target as HTMLElement).style.setProperty(property, value, computed.getPropertyPriority(property));
    }
  }
}

export function copyComputedStyleTree(source: Element, target: Element): void {
  copyComputedStyle(source, target);
  copyDescendants(source, target);
}

function copyDescendants(source: Element, target: Element): void {

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  const count = Math.min(sourceChildren.length, targetChildren.length);

  for (let i = 0; i < count; i++) {
    copyStyleValues(sourceChildren[i], targetChildren[i]);
    copyDescendants(sourceChildren[i], targetChildren[i]);
  }
}

/** Backward-compatible helper retained for consumers of older versions. */
export function copyEssentialStyles(source: HTMLElement, target: HTMLElement): void {
  copyComputedStyle(source, target);
  target.style.setProperty('box-sizing', 'border-box');
}

export function combineTransforms(transform: string, initialTransform?: string): string {
  return initialTransform && initialTransform !== 'none'
    ? transform + ' ' + initialTransform
    : transform;
}
