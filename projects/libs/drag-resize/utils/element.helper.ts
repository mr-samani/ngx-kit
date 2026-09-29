export abstract class ElementHelper {
  private static collectionHas(a: NodeListOf<Element>, b: ParentNode) {
    //helper function (see below)
    for (var i = 0, len = a.length; i < len; i++) {
      if (a[i] == b) return true;
    }
    return false;
  }
  public static findParentBySelector(elm: HTMLElement, selector: string): HTMLElement | null {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode as HTMLElement;
    while (cur && !ElementHelper.collectionHas(all, cur)) {
      //keep going up until you find a match
      cur = cur.parentNode as HTMLElement; //go up
    }
    return cur; //will return null if not found
  }
}

export function getFirstLevelDraggables(container: HTMLElement): HTMLElement[] {
  const all = Array.from(container.querySelectorAll<HTMLElement>('.ngx-draggable:not(.dragging)'));
  const firstLevel: HTMLElement[] = [];

  for (const el of all) {
    let parent = el.parentElement;
    let isNested = false;

    while (parent && parent !== container) {
      if (parent.classList.contains('ngx-draggable')) {
        isNested = true;
        break;
      }
      parent = parent.parentElement;
    }

    if (!isNested) {
      firstLevel.push(el);
    }
  }

  return firstLevel;
}

export function isElementNode(node: Node): node is Element {
  return node?.nodeType === Node.ELEMENT_NODE;
}

export function isDocumentNode(node: Node | null): node is Document {
  return node?.nodeType === Node.DOCUMENT_NODE;
}

export function isShadowRootNode(node: Node | null): node is ShadowRoot {
  return node?.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in node;
}

export function getOwnerWindow(node: Node): Window | null {
  return node?.ownerDocument?.defaultView ?? null;
}
export function isWindow(value: unknown): value is Window {
  return (
    value != null &&
    typeof value === 'object' &&
    'window' in value &&
    (value as Window).window === value
  );
}
