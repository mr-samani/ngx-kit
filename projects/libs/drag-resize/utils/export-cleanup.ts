/**
 * Helpers for a page builder's "export HTML" step.
 *
 * While you edit, the directives decorate the canvas DOM: `ngx-*` classes, `tabindex="0"`,
 * `aria-grabbed`, `touch-action: none`, and — if an export happens mid-drag — a placeholder or a
 * preview clone. None of that belongs in the page a visitor receives. Run the canvas through
 * `getCleanHtml()` (or `stripEditorArtifacts()` on a clone you already have) before saving.
 */

export interface StripOptions {
  /** Class-name prefix treated as editor-only. Default `ngx-`. */
  classPrefix?: string;
  /** Extra class names to drop (besides the prefix match and `disable-drag`). */
  extraClasses?: string[];
  /** Extra attributes to drop from every element. */
  extraAttributes?: string[];
}

const TRANSIENT_NODES = '.ngx-drag-placeholder, .ngx-drag-preview';

/** Mutates `root` (and its subtree) in place. Pass a CLONE of live DOM, never the live canvas. */
export function stripEditorArtifacts(root: Element, options: StripOptions = {}): void {
  const prefix = options.classPrefix ?? 'ngx-';
  const dropClasses = new Set(['disable-drag', ...(options.extraClasses ?? [])]);
  const dropAttrs = ['aria-grabbed', ...(options.extraAttributes ?? [])];

  root.querySelectorAll(TRANSIENT_NODES).forEach((n) => n.remove());

  const all: Element[] = [root, ...Array.from(root.querySelectorAll('*'))];
  for (const el of all) {
    // `tabindex="0"` is only ours on draggables (a real focusable of the page keeps its own).
    if (el.classList.contains('ngx-draggable') && el.getAttribute('tabindex') === '0') {
      el.removeAttribute('tabindex');
    }
    for (const attr of dropAttrs) el.removeAttribute(attr);

    for (const cls of Array.from(el.classList)) {
      if (cls.startsWith(prefix) || dropClasses.has(cls)) el.classList.remove(cls);
    }
    if (!el.classList.length) el.removeAttribute('class');

    const style = (el as HTMLElement).style;
    if (style) {
      if (style.touchAction === 'none') style.removeProperty('touch-action');
      if (!el.getAttribute('style')?.trim()) el.removeAttribute('style');
    }
  }
}

/** Serialised, editor-free HTML of `el`'s children (the canvas content). */
export function getCleanHtml(el: Element, options?: StripOptions): string {
  const clone = el.cloneNode(true) as Element;
  stripEditorArtifacts(clone, options);
  return clone.innerHTML;
}
