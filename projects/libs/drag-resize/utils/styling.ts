/**
 * Copy the browser-resolved visual state of an element.
 *
 * A drag preview is moved to <body>, so selectors depending on ancestors no
 * longer apply. Copying computed styles (including custom properties) makes
 * the preview visually independent from the original DOM subtree.
 */
export function copyComputedStyle(source: HTMLElement, target: HTMLElement): void {
  const computed = window.getComputedStyle(source);

  for (let i = 0; i < computed.length; i++) {
    const property = computed.item(i);
    const value = computed.getPropertyValue(property);

    if (value) {
      target.style.setProperty(property, value, computed.getPropertyPriority(property));
    }
  }

  // Make the preview deterministic once it is taken out of normal flow.
  target.style.setProperty('margin', '0', 'important');
  target.style.setProperty('box-sizing', 'border-box', 'important');
}

export function copyComputedStyleTree(source: HTMLElement, target: HTMLElement): void {
  copyComputedStyle(source, target);

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  const count = Math.min(sourceChildren.length, targetChildren.length);

  for (let i = 0; i < count; i++) {
    if (
      sourceChildren[i] instanceof HTMLElement &&
      targetChildren[i] instanceof HTMLElement
    ) {
      copyComputedStyleTree(
        sourceChildren[i] as HTMLElement,
        targetChildren[i] as HTMLElement,
      );
    }
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
