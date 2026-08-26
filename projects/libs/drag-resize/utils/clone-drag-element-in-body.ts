export function cloneDragElementInBody(dragEl: HTMLElement, rect: DOMRect): HTMLElement {
  const clone = dragEl.cloneNode(true) as HTMLElement;
  clone.innerHTML = dragEl.innerHTML;
  clone.className = dragEl.className + ' ngx-drag-in-body';
  clone.style.position = 'fixed';
  clone.style.top = rect.top + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.margin = '0';
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '0.85';
  clone.style.boxShadow = '0 4px 24px rgba(0,0,0,.22)';
  clone.style.zIndex = '99999';
  clone.style.transitionProperty = 'none';
  clone.style.transform = '';
  return clone;
}
