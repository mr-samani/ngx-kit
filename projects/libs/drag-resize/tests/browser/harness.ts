/**
 * Browser test harness. Bundled with esbuild and loaded into a real Chromium page.
 *
 * It instantiates the REAL NgxDropList / NgxDraggable directive classes inside an Angular
 * injection context (no template compiler needed) and feeds them REAL PointerEvents, so the
 * engine runs against Chromium's actual layout (flex, grid, RTL, scrolling, transforms).
 */
import '@angular/compiler';
import { ElementRef, Injector, runInInjectionContext, EnvironmentInjector, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { createApplication } from '@angular/platform-browser';
import { NgxDraggable, NGX_DRAGGABLE } from '../../directives/ngx-draggable.directive';
import { NgxDropList, NGX_DROPLIST } from '../../directives/ngx-drop-list.directive';
import { NgxDropListGroup, NGX_DROPLIST_GROUP } from '../../directives/ngx-drop-list-group.directive';
import { DragDropService } from '../../services/drag-drop.service';

class DomRenderer {
  listen(target: any, name: string, cb: (e: any) => void): () => void {
    const t = target === 'window' ? window : target === 'document' ? document : target;
    t.addEventListener(name, cb);
    return () => t.removeEventListener(name, cb);
  }
}

export let root: EnvironmentInjector;
export const ready: Promise<void> = createApplication({ providers: [] }).then((app) => { root = app.injector as EnvironmentInjector; });
const svc = new DragDropService();

const lists = new Map<HTMLElement, NgxDropList>();
const items = new Map<HTMLElement, NgxDraggable>();

/**
 * Mirrors Angular's element-injector hierarchy: the providers live on the *ancestor* element
 * (parent injector) and the directive itself is created in a child, so `inject(..., {skipSelf})`
 * resolves exactly like it does in a real template.
 */
function makeInjector(providers: any[]): Injector {
  const parent = Injector.create({ providers, parent: root });
  return Injector.create({ providers: [], parent });
}

let groupDir: NgxDropListGroup | null = null;

export function group(el?: HTMLElement) {
  groupDir = runInInjectionContext(makeInjector([]), () => new NgxDropListGroup());
  return groupDir;
}

export function registerList(el: HTMLElement, opts: { grouped?: boolean; data?: any; connectedTo?: HTMLElement[]; disableSort?: boolean } = {}) {
  const providers: any[] = [{ provide: DragDropService, useValue: svc }];
  if (opts.grouped && groupDir) providers.push({ provide: NGX_DROPLIST_GROUP, useValue: groupDir });
  const inj = makeInjector(providers);
  const dir = runInInjectionContext(inj, () => new NgxDropList(new ElementRef(el)));
  if (opts.connectedTo) dir.connectedTo = opts.connectedTo;
  if (opts.data) dir.data = opts.data;
  if (opts.disableSort) dir.disableSort = true;
  dir.ngOnInit();
  lists.set(el, dir);
  return dir;
}

export function registerItem(el: HTMLElement, opts: { data?: any; handle?: string } = {}) {
  // Find nearest registered ancestor list (mirrors `inject(NGX_DROPLIST, {skipSelf})`).
  let list: NgxDropList | null = null;
  for (let n = el.parentElement; n; n = n.parentElement) {
    if (lists.has(n)) { list = lists.get(n)!; break; }
  }
  const providers: any[] = [{ provide: DragDropService, useValue: svc }];
  if (list) providers.push({ provide: NGX_DROPLIST, useValue: list });
  if (groupDir) providers.push({ provide: NGX_DROPLIST_GROUP, useValue: groupDir });
  const inj = makeInjector(providers);
  const dir = runInInjectionContext(inj, () => new NgxDraggable(new ElementRef(el), new DomRenderer() as any));
  if (opts.data !== undefined) dir.data = opts.data;
  dir.ngOnInit();
  items.set(el, dir);
  return dir;
}

export function destroyItem(el: HTMLElement) {
  items.get(el)?.ngOnDestroy();
  items.delete(el);
}
export function destroyAll() {
  items.forEach((d) => d.ngOnDestroy());
  items.clear();
  lists.forEach((d) => d.ngOnDestroy());
  lists.clear();
  groupDir = null;
}

export const getService = () => svc;
export const getList = (el: HTMLElement) => lists.get(el)!;
export const getItem = (el: HTMLElement) => items.get(el)!;

// ---- pointer helpers (real DOM events) ----
let pid = 1;
function fire(target: EventTarget, type: string, x: number, y: number, extra: PointerEventInit = {}) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, pointerId: pid, pointerType: 'mouse', button: 0, isPrimary: true, ...extra }));
}
export const down = (el: Element, x: number, y: number) => fire(el, 'pointerdown', x, y);
export const move = (x: number, y: number) => fire(document, 'pointermove', x, y);
export const up = (x: number, y: number) => fire(document, 'pointerup', x, y);
export const cancelPtr = (x: number, y: number) => fire(document, 'pointercancel', x, y);
export const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

export function center(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// ---------------------------------------------------------------------------------------
// scenario helpers
// ---------------------------------------------------------------------------------------

const initialStyle = new Map<HTMLElement, string>();
export const drops: any[] = [];
const label = (n: Element) => (n as HTMLElement).dataset['id'] || n.id || (n.textContent || '').trim();

/** Registers every [data-list] / [data-item] in the document (outer lists first). */
export async function auto(opts: { animation?: number } = {}) {
  await ready;
  destroyAll();
  drops.length = 0;
  initialStyle.clear();
  if (document.querySelector('[data-group]')) group();
  document.querySelectorAll<HTMLElement>('[data-list]').forEach((el) => {
    const d = registerList(el, {
      grouped: el.hasAttribute('data-group'),
      disableSort: el.hasAttribute('data-disable-sort'),
      connectedTo: (el.dataset['connect'] || '')
        .split(',')
        .filter(Boolean)
        .map((id) => document.getElementById(id)!),
    });
    d._ref.sortAnimationDuration = opts.animation ?? 0;
    d.drop.subscribe((e: any) =>
      drops.push({
        prev: e.previousIndex,
        cur: e.currentIndex,
        from: e.previousContainer.el.id,
        to: e.container.el.id,
        item: label(e.item.el),
        over: e.isPointerOverContainer,
      }),
    );
  });
  document.querySelectorAll<HTMLElement>('[data-item]').forEach((el) => {
    registerItem(el);
    initialStyle.set(el, el.style.cssText);
  });
}

/** What the user SEES, in reading order, including the placeholder. */
export function visual(list: HTMLElement): string[] {
  const rtl = getComputedStyle(list).direction === 'rtl';
  const kids = Array.from(list.children).filter(
    (n): n is HTMLElement =>
      n instanceof HTMLElement && n.style.display !== 'none' && !n.classList.contains('ngx-drag-preview'),
  );
  const rows: { top: number; items: { x: number; l: string }[] }[] = [];
  for (const k of kids.map((n) => ({ r: n.getBoundingClientRect(), l: n.classList.contains('ngx-drag-placeholder') ? '[PH]' : label(n) }))) {
    const row = rows.find((r) => Math.abs(r.top - k.r.top) < 5) ?? (rows.push({ top: k.r.top, items: [] }), rows[rows.length - 1]);
    row.items.push({ x: k.r.left + k.r.width / 2, l: k.l });
  }
  rows.sort((a, b) => a.top - b.top);
  return rows.flatMap((r) => r.items.sort((a, b) => (rtl ? b.x - a.x : a.x - b.x)).map((i) => i.l));
}

export const dom = (list: HTMLElement) => Array.from(list.children).map((n) => n.id || label(n));

/** Anything a finished (or cancelled) drag must not leave behind. Empty array = clean. */
export function leaks(): string[] {
  const out: string[] = [];
  const n = (sel: string) => document.querySelectorAll(sel).length;
  if (n('.ngx-drag-preview')) out.push(`preview nodes in DOM: ${n('.ngx-drag-preview')}`);
  if (n('.ngx-drag-placeholder')) out.push(`placeholder nodes in DOM: ${n('.ngx-drag-placeholder')}`);
  if (Array.from(document.body.children).some((c) => c.classList.contains('ngx-drag-preview'))) out.push('body clone');
  initialStyle.forEach((css, el) => {
    if (el.style.cssText !== css) out.push(`style of ${label(el)}: "${el.style.cssText}" (was "${css}")`);
    if (el.classList.contains('ngx-draggable--dragging')) out.push(`dragging class left on ${label(el)}`);
  });
  lists.forEach((d, el) => {
    const r: any = d._ref;
    if (r.session) out.push(`list ${el.id} still has a sort session`);
    if (r.placeholder) out.push(`list ${el.id} still holds a placeholder`);
    if (r.activeDrag) out.push(`list ${el.id} still has an active drag`);
    if (el.classList.contains('ngx-drop-list--active')) out.push(`list ${el.id} still active class`);
    if (Array.from(el.children).some((c) => (c as HTMLElement).style.transform)) out.push(`list ${el.id} child has transform`);
  });
  items.forEach((d, el) => {
    const r = d._ref;
    if (r.isDragging() && r.isListDrag) out.push(`${label(el)} still dragging`);
    if (r.isListDrag) out.push(`${label(el)} isListDrag`);
    if (r.activeDropList) out.push(`${label(el)} activeDropList`);
  });
  if (svc.activeDrag()) out.push('service.activeDrag not cleared');
  return out;
}

/** Layout-thrash / DOM-stability probe: records every childList mutation until stopped. */
export function watchDom(target: Node) {
  const log: { added: string[]; removed: string[] }[] = [];
  const mo = new MutationObserver((recs) => {
    for (const r of recs) if (r.type === 'childList') log.push({
      added: Array.from(r.addedNodes).map((x) => (x as HTMLElement).className || x.nodeName),
      removed: Array.from(r.removedNodes).map((x) => (x as HTMLElement).className || x.nodeName),
    });
  });
  mo.observe(target, { childList: true, subtree: true });
  return { stop: () => { const rest = mo.takeRecords(); rest.forEach((r) => log.push({ added: Array.from(r.addedNodes).map((x) => (x as HTMLElement).className || x.nodeName), removed: Array.from(r.removedNodes).map((x) => (x as HTMLElement).className || x.nodeName) })); mo.disconnect(); return log; } };
}

export const raf = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
export const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; };
export const previewRect = () => { const p = document.querySelector('.ngx-drag-preview'); return p ? rect(p) : null; };
export const key = (el: Element, k: string, extra: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...extra }));

export { NGX_DRAGGABLE, NGX_DROPLIST };
