/**
 * The page-builder scenario this library is used for: a palette of blocks in the HOST page and a
 * canvas (drop list) inside a same-origin <iframe); blocks are dragged from one into the other.
 * All of these run in real Chromium with real layout and a real nested document.
 */
import { describe, expect, it } from 'vitest';
import { run, useBrowser, items } from './fixture';

useBrowser();

const PALETTE = `<div id="palette" data-list data-group style="left:10px;top:10px;width:150px">${items('PQ')}</div>`;
const FRAME = (extra = '') =>
  `<iframe id="frame" style="position:absolute;left:200px;top:20px;width:400px;height:300px;border:0;${extra}"></iframe>`;
const HOST = (extra = '') => PALETTE + FRAME(extra);
const css = { css: '.it{width:150px}' };

describe('palette (host document) → canvas (iframe)', () => {
  it('one placeholder in the iframe, the preview in the host, correct drop indexes, nothing left behind', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc, list } = H.setupCanvas(3);
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const into = H.framePoint(frame, 100, 100); // top half of b1 -> insert before it
      H.move(into.x, into.y);
      const mid = {
        placeholdersInFrame: doc.querySelectorAll('.ngx-drag-placeholder').length,
        previewsInHost: document.querySelectorAll('.ngx-drag-preview').length,
        previewsInFrame: doc.querySelectorAll('.ngx-drag-preview').length,
        placeholderIndex: list._ref.getFinalIndex(),
      };
      // The list already contains the placeholder's 40px here, so the last block's centre is at 240.
      const end = H.framePoint(frame, 100, 265); // below it -> append
      H.move(end.x, end.y);
      H.up(end.x, end.y);
      return { mid, drops: H.drops.slice(), hostLeaks: H.leaks(), frameLeaks: H.frameLeaks(doc) };
    }, undefined, css);

    expect(r.mid).toMatchObject({ placeholdersInFrame: 1, previewsInHost: 1, previewsInFrame: 0 });
    expect(r.mid.placeholderIndex).toBe(1);
    expect(r.drops).toEqual([
      { prev: 0, cur: 3, from: 'palette', to: 'canvas', item: 'P', over: true },
    ]);
    expect(r.hostLeaks).toEqual([]);
    expect(r.frameLeaks).toEqual([]);
  });

  it('releasing over the host (outside every list) cancels instead of committing', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc } = H.setupCanvas(5);
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const into = H.framePoint(frame, 100, 100);
      H.move(into.x, into.y);
      H.move(700, 500); // blank host area
      const placeholdersWhileOutside = doc.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(700, 500);
      return { placeholdersWhileOutside, drops: H.drops.length, frameLeaks: H.frameLeaks(doc), hostLeaks: H.leaks() };
    }, undefined, css);
    expect(r).toEqual({ placeholdersWhileOutside: 0, drops: 0, frameLeaks: [], hostLeaks: [] });
  });

  it('a pointer outside the iframe viewport is NOT over the (taller) canvas inside it', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc } = H.setupCanvas(10); // 800px canvas in a 300px high iframe
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const fr = frame.getBoundingClientRect();
      const below = { x: fr.left + 100, y: fr.bottom + 30 }; // under the iframe, host blank area
      H.move(below.x, below.y);
      const placeholders = doc.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(below.x, below.y);
      return { placeholders, drops: H.drops.length, frameLeaks: H.frameLeaks(doc) };
    }, undefined, css);
    expect(r).toEqual({ placeholders: 0, drops: 0, frameLeaks: [] });
  });

  it('scrolling the iframe while dragging re-resolves the insertion point under a still pointer', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc, list } = H.setupCanvas(12); // 960px
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const p = H.framePoint(frame, 100, 100);
      H.move(p.x, p.y);
      const before = list._ref.getFinalIndex();
      frame.contentWindow!.scrollTo(0, 400); // wheel / scrollbar / programmatic: pointer does not move
      await H.raf();
      const after = list._ref.getFinalIndex();
      H.up(p.x, p.y);
      return { before, after, drop: H.drops[0], frameLeaks: H.frameLeaks(doc) };
    }, undefined, css);
    expect(r.before).toBe(1); // y=100 -> top half of b1
    expect(r.after).toBe(6); // (100+400)=500 -> top half of b6 (480..560)
    expect(r.drop).toMatchObject({ from: 'palette', to: 'canvas', cur: 6 });
    expect(r.frameLeaks).toEqual([]);
  });

  it('auto-scrolls the IFRAME when the pointer is near its edge, and not when it is in the middle', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc } = H.setupCanvas(20); // 1600px
      const win = frame.contentWindow!;
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const mid = H.framePoint(frame, 100, 150);
      H.move(mid.x, mid.y);
      await new Promise((res) => setTimeout(res, 250));
      const scrolledInMiddle = win.scrollY;
      const bottom = H.framePoint(frame, 100, 290); // 10px above the iframe's bottom edge
      H.move(bottom.x, bottom.y);
      await new Promise((res) => setTimeout(res, 400));
      const scrolledAtBottomEdge = win.scrollY;
      const top = H.framePoint(frame, 100, 4);
      H.move(top.x, top.y);
      await new Promise((res) => setTimeout(res, 700));
      const afterTopEdge = win.scrollY;
      H.up(top.x, top.y);
      return { scrolledInMiddle, scrolledAtBottomEdge, afterTopEdge, frameLeaks: H.frameLeaks(doc) };
    }, undefined, css);
    expect(r.scrolledInMiddle).toBe(0);
    expect(r.scrolledAtBottomEdge).toBeGreaterThan(50);
    expect(r.afterTopEdge).toBeLessThan(r.scrolledAtBottomEdge); // scrolled back up
    expect(r.frameLeaks).toEqual([]);
  });

  it('does not auto-scroll the iframe while the pointer is over the host palette', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame } = H.setupCanvas(20);
      const win = frame.contentWindow!;
      win.scrollTo(0, 200);
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      H.move(c.x, c.y + 8);
      await new Promise((res) => setTimeout(res, 300));
      const y = win.scrollY;
      H.up(c.x, c.y + 8);
      return { y };
    }, undefined, css);
    expect(r.y).toBe(200);
  });

  it('works through a scaled iframe: pointer mapping AND placeholder size (zoomed-out device preview)', async () => {
    const r = await run(
      HOST('width:800px;height:600px;transform:scale(.5);transform-origin:0 0;'),
      async (H) => {
        await H.auto();
        const { frame, doc, list } = H.setupCanvas(5);
        const P = document.querySelector('#palette [data-id=P]') as HTMLElement; // 150x40 on screen
        const c = H.center(P);
        H.down(P, c.x, c.y);
        H.move(c.x, c.y + 5);
        const p = H.framePoint(frame, 100, 100); // iframe CSS px -> screen px (x0.5)
        H.move(p.x, p.y);
        const ph = doc.querySelector('.ngx-drag-placeholder') as HTMLElement;
        const out = {
          index: list._ref.getFinalIndex(),
          // 40 screen px high item inside a 0.5-scaled iframe = 80 CSS px in the iframe
          phHeight: Math.round(ph.getBoundingClientRect().height),
          phWidth: Math.round(ph.getBoundingClientRect().width),
        };
        H.up(p.x, p.y);
        return { ...out, drop: H.drops[0], frameLeaks: H.frameLeaks(doc) };
      },
      undefined,
      css,
    );
    expect(r.index).toBe(1);
    expect(r.phHeight).toBe(80);
    expect(r.phWidth).toBe(300); // 150 screen px = 300 CSS px
    expect(r.drop).toMatchObject({ cur: 1, to: 'canvas' });
    expect(r.frameLeaks).toEqual([]);
  });

  it("placeholderFit='stretch' fills the canvas width instead of using the palette tile's width", async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { frame, doc, list } = H.setupCanvas(3);
      list._ref.placeholderFit = 'stretch';
      const P = document.querySelector('#palette [data-id=P]') as HTMLElement;
      const c = H.center(P);
      H.down(P, c.x, c.y);
      H.move(c.x, c.y + 5);
      const p = H.framePoint(frame, 100, 100);
      H.move(p.x, p.y);
      const ph = doc.querySelector('.ngx-drag-placeholder') as HTMLElement;
      const w = Math.round(ph.getBoundingClientRect().width);
      const h = Math.round(ph.getBoundingClientRect().height);
      H.up(p.x, p.y);
      return { w, h };
    }, undefined, css);
    expect(r.w).toBe(400); // canvas width, not the 150px tile
    expect(r.h).toBe(40); // main axis still reserves the item's height
  });

  it('reordering blocks INSIDE the iframe keeps preview + placeholder in the iframe and emits the right drop', async () => {
    const r = await run(HOST(), async (H) => {
      await H.auto();
      const { doc } = H.setupCanvas(3);
      // A drag that starts inside the iframe is captured by an element of the iframe document, so
      // its pointer events arrive on THAT document (iframe viewport coordinates).
      const fire = (type: string, x: number, y: number, t: EventTarget = doc) =>
        t.dispatchEvent(
          new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', button: 0 }),
        );
      const b0 = doc.querySelector('[data-id=b0]') as HTMLElement;
      fire('pointerdown', 100, 40, b0);
      fire('pointermove', 100, 45);
      fire('pointermove', 100, 230); // bottom half of b2 -> goes last
      const mid = {
        previewInFrame: doc.querySelectorAll('.ngx-drag-preview').length,
        previewInHost: document.querySelectorAll('.ngx-drag-preview').length,
        placeholders: doc.querySelectorAll('.ngx-drag-placeholder').length,
      };
      fire('pointerup', 100, 230);
      return { mid, drop: H.drops[0], frameLeaks: H.frameLeaks(doc) };
    }, undefined, css);
    expect(r.mid).toEqual({ previewInFrame: 1, previewInHost: 0, placeholders: 1 });
    expect(r.drop).toMatchObject({ prev: 0, cur: 2, from: 'canvas', to: 'canvas' });
    expect(r.frameLeaks).toEqual([]);
  });
});

describe('editing inside draggable blocks', () => {
  const LIST = `<div id="a" data-list style="left:20px;top:20px;width:200px">
    <div class="it" data-item data-id="A"><input id="inp" value="hello"><span id="ro" data-no-drag>no drag</span></div>
    <div class="it" data-item data-id="B">B</div></div>`;

  it('arrow keys typed inside an <input> of a block neither start a drag nor get swallowed', async () => {
    const r = await run(LIST, async (H) => {
      await H.auto();
      const inp = document.getElementById('inp') as HTMLInputElement;
      const ev = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
      inp.dispatchEvent(ev);
      const A = document.querySelector('[data-id=A]') as HTMLElement;
      return { prevented: ev.defaultPrevented, dragging: H.getItem(A)._ref.isDragging(), leaks: H.leaks() };
    });
    expect(r).toEqual({ prevented: false, dragging: false, leaks: [] });
  });

  it('the draggable itself, when focused, still moves with the arrow keys', async () => {
    const r = await run(LIST, async (H) => {
      await H.auto();
      const A = document.querySelector('[data-id=A]') as HTMLElement;
      const ev = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      A.dispatchEvent(ev);
      const started = H.getItem(A)._ref.isDragging();
      H.esc();
      return { prevented: ev.defaultPrevented, started, after: H.getItem(A)._ref.isDragging(), leaks: H.leaks() };
    });
    expect(r).toEqual({ prevented: true, started: true, after: false, leaks: [] });
  });

  it('a press inside [data-no-drag] never starts a drag (text selection / caret keep working)', async () => {
    const r = await run(LIST, async (H) => {
      await H.auto();
      const ro = document.getElementById('ro')!;
      const c = H.center(ro);
      H.down(ro, c.x, c.y);
      H.move(c.x, c.y + 30);
      const dragging = document.querySelectorAll('.ngx-draggable--dragging').length;
      H.up(c.x, c.y + 30);
      return { dragging, drops: H.drops.length };
    });
    expect(r).toEqual({ dragging: 0, drops: 0 });
  });

  it('ignoreInteractive: a press on an <input> does not start a drag, a press on the block does', async () => {
    const r = await run(LIST, async (H) => {
      await H.auto();
      const A = document.querySelector('[data-id=A]') as HTMLElement;
      (H.getItem(A) as any).ignoreInteractive = () => true;
      const inp = document.getElementById('inp')!;
      const ci = H.center(inp);
      H.down(inp, ci.x, ci.y);
      H.move(ci.x, ci.y + 30);
      const onInput = A.classList.contains('ngx-draggable--dragging') ? 1 : 0;
      H.up(ci.x, ci.y + 30);
      const r2 = A.getBoundingClientRect();
      H.down(A, r2.right - 3, r2.bottom - 3);
      H.move(r2.right - 3, r2.bottom + 20);
      const onBlock = A.classList.contains('ngx-draggable--dragging') ? 1 : 0;
      H.up(r2.right - 3, r2.bottom + 20);
      return { onInput, onBlock };
    });
    expect(r).toEqual({ onInput: 0, onBlock: 1 });
  });

  it('the click the browser fires after a real drag is swallowed, a normal click is not', async () => {
    const r = await run(LIST, async (H) => {
      await H.auto();
      const B = document.querySelector('[data-id=B]') as HTMLElement;
      const clicks: string[] = [];
      document.addEventListener('click', () => clicks.push('click'));
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 10);
      H.move(c.x, c.y + 40);
      H.up(c.x, c.y + 40);
      B.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); // fired right after pointerup
      const afterDrag = clicks.length;
      await new Promise((res) => setTimeout(res, 20));
      B.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); // the user's NEXT click
      const afterNext = clicks.length;
      // a press that never moved is a plain click
      const A = document.querySelector('[data-id=A]') as HTMLElement;
      const ca = H.center(A);
      H.down(A, ca.x, ca.y);
      H.up(ca.x, ca.y);
      A.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return { afterDrag, afterNext, afterPlain: clicks.length };
    });
    expect(r).toEqual({ afterDrag: 0, afterNext: 1, afterPlain: 2 });
  });
});

describe('resizing blocks', () => {
  const BOX = `<div id="box" style="position:absolute;left:100px;top:100px;width:200px;height:100px;background:#fcc"></div>`;

  it('numeric grid snapping works (it used to produce NaN and silently disable resizing)', async () => {
    const r = await run(BOX, async (H) => {
      await H.auto();
      const box = document.getElementById('box')!;
      const dir = H.registerResizable(box, { grid: 20, minWidth: 20, minHeight: 20, directions: ['se'] });
      const rect = box.getBoundingClientRect();
      const sx = rect.right - 2;
      const sy = rect.bottom - 2;
      dir.onPointerDown(new PointerEvent('pointerdown', { clientX: sx, clientY: sy, pointerId: 1, button: 0 }));
      H.move(sx + 47, sy + 33);
      H.up(sx + 47, sy + 33);
      return { w: box.style.width, h: box.style.height };
    });
    expect(r).toEqual({ w: '240px', h: '140px' }); // 247 -> 240, 133 -> 140 (nearest multiple of 20)
  });

  it('a padded/bordered content-box block does not jump when a resize starts', async () => {
    const r = await run(
      `<div id="box" style="position:absolute;left:100px;top:100px;width:200px;height:100px;padding:15px;border:5px solid #333;background:#fcc"></div>`,
      async (H) => {
        await H.auto();
        const box = document.getElementById('box')!;
        const dir = H.registerResizable(box, { directions: ['se'], minWidth: 20, minHeight: 20 });
        const before = box.getBoundingClientRect();
        dir.onPointerDown(new PointerEvent('pointerdown', { clientX: before.right - 2, clientY: before.bottom - 2, pointerId: 1, button: 0 }));
        const atStart = box.getBoundingClientRect();
        H.move(before.right - 2 + 50, before.bottom - 2 + 20);
        const moved = box.getBoundingClientRect();
        H.up(before.right - 2 + 50, before.bottom - 2 + 20);
        return {
          jumpW: atStart.width - before.width,
          jumpH: atStart.height - before.height,
          growW: moved.width - before.width,
          growH: moved.height - before.height,
        };
      },
    );
    expect(r.jumpW).toBeCloseTo(0, 1);
    expect(r.jumpH).toBeCloseTo(0, 1);
    expect(r.growW).toBeCloseTo(50, 1);
    expect(r.growH).toBeCloseTo(20, 1);
  });

  it('arrow keys typed in an <input> inside a resizable block do not resize it', async () => {
    const r = await run(
      `<div id="box" style="position:absolute;left:100px;top:100px;width:200px;height:100px"><input id="i"></div>`,
      async (H) => {
        await H.auto();
        const box = document.getElementById('box')!;
        const dir = H.registerResizable(box);
        const ev = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
        Object.defineProperty(ev, 'target', { value: document.getElementById('i') });
        dir.onHandleKeyDown(ev);
        return { prevented: ev.defaultPrevented, w: box.style.width };
      },
    );
    expect(r).toEqual({ prevented: false, w: '200px' });
  });
});

describe('export cleanup', () => {
  it('removes every editor artefact from a canvas clone and leaves real attributes alone', async () => {
    const r = await run(
      `<div id="c"><section class="hero ngx-draggable ngx-drop-list ngx-draggable--dragging disable-drag" tabindex="0" aria-grabbed="false" style="touch-action: none; color: red"><a href="#" tabindex="0" class="btn">x</a></section>` +
        `<div class="ngx-drag-placeholder">ph</div><p class="ngx-draggable" tabindex="0" style="touch-action: none"></p></div>`,
      async (H) => {
        const c = document.getElementById('c')!;
        return { html: H.getCleanHtml(c), liveUntouched: c.querySelectorAll('.ngx-draggable').length };
      },
    );
    expect(r.html).toBe(
      '<section class="hero" style="color: red;"><a href="#" tabindex="0" class="btn">x</a></section><p></p>',
    );
    expect(r.liveUntouched).toBe(2);
  });
});
