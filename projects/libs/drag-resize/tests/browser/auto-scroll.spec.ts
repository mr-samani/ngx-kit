import { describe, expect, it } from 'vitest';
import { run, useBrowser } from './fixture';

useBrowser();

const CSS = `<style>body{margin:0}.it{box-sizing:border-box;height:40px;width:100px;background:#eef;flex:none}[data-list]{position:absolute;box-sizing:border-box}</style>`;
const ITEMS = Array.from({ length: 20 }, (_, i) => `<div class="it" data-item data-id="i${i}">${i}</div>`).join('');
const scroller = (extra = '', dir = '') =>
  `${CSS}<div id="s" ${dir} style="position:absolute;left:50px;top:50px;width:400px;height:60px;overflow-x:auto;overflow-y:hidden;${extra}">` +
  `<div data-list style="position:static;display:flex;width:max-content">${ITEMS}</div></div>`;

/** Drag the first item to the right edge, then the left edge of #s; report scrollLeft after each. */
const edges = async (H: any) => {
  await H.auto();
  const s = document.getElementById('s')!;
  const first = s.querySelector('[data-item]') as HTMLElement;
  const c = H.center(first);
  H.down(first, c.x, c.y);
  H.move(c.x + 5, c.y);
  const r = s.getBoundingClientRect();
  H.move(r.right - 8, c.y);
  await new Promise((res) => setTimeout(res, 600));
  const atRightEdge = s.scrollLeft;
  H.move(r.left + 8, c.y);
  await new Promise((res) => setTimeout(res, 900));
  const atLeftEdge = s.scrollLeft;
  H.up(r.left + 8, c.y);
  return { atRightEdge, atLeftEdge, leaks: H.leaks() };
};

describe('horizontal auto-scroll', () => {
  it('scrolls a horizontal-only scroller right, then back left', async () => {
    const r = await run(scroller(), edges);
    expect(r.atRightEdge).toBeGreaterThan(100);
    expect(r.atLeftEdge).toBeLessThan(r.atRightEdge);
    expect(r.leaks).toEqual([]);
  });

  it('still scrolls with CSS `scroll-behavior: smooth` (each frame used to cancel the previous one)', async () => {
    const r = await run(scroller('scroll-behavior:smooth;'), edges);
    expect(r.atRightEdge).toBeGreaterThan(100);
    expect(r.atLeftEdge).toBeLessThan(r.atRightEdge);
  });

  it('works in an RTL scroller (physical, negative scrollLeft)', async () => {
    const r = await run(scroller('', 'dir="rtl"'), async (H: any) => {
      await H.auto();
      const s = document.getElementById('s')!;
      const first = s.querySelector('[data-item]') as HTMLElement;
      const c = H.center(first);
      H.down(first, c.x, c.y);
      H.move(c.x - 5, c.y);
      const rect = s.getBoundingClientRect();
      H.move(rect.left + 8, c.y); // the end of an RTL list is on the left
      await new Promise((res) => setTimeout(res, 600));
      const x = s.scrollLeft;
      H.up(rect.left + 8, c.y);
      return { x };
    });
    expect(r.x).toBeLessThan(-100);
  });

  it('scrolls the window horizontally, including with `html { scroll-behavior: smooth }`', async () => {
    const html = `${CSS.replace('body{margin:0}', 'html{scroll-behavior:smooth}body{margin:0;width:3000px}')}<div data-list style="left:0;top:50px;width:3000px;display:flex">${ITEMS}</div>`;
    const r = await run(html, async (H: any) => {
      await H.auto();
      const first = document.querySelector('[data-item]') as HTMLElement;
      const c = H.center(first);
      H.down(first, c.x, c.y);
      H.move(c.x + 5, c.y);
      H.move(window.innerWidth - 8, c.y);
      await new Promise((res) => setTimeout(res, 600));
      const x = window.scrollX;
      H.up(window.innerWidth - 8, c.y);
      return { x };
    });
    expect(r.x).toBeGreaterThan(100);
  });

  it('kanban: a vertically scrolling column inside a horizontally scrolling board scrolls BOTH axes', async () => {
    const card = (i: number) => `<div class="it" data-item data-id="c${i}" style="width:auto;height:40px;margin:4px">${i}</div>`;
    const col = (id: string, n: number) =>
      `<div id="${id}" data-list style="position:static;flex:none;width:300px;height:200px;overflow-y:auto">` +
      Array.from({ length: n }, (_, i) => card(i)).join('') +
      `</div>`;
    const html =
      `${CSS}<div id="board" data-group style="position:absolute;left:20px;top:20px;width:400px;height:240px;overflow-x:auto;overflow-y:hidden;display:flex;gap:10px">` +
      col('c1', 20) + col('c2', 20) + col('c3', 3) +
      `</div>`;
    const r = await run(html, async (H: any) => {
      await H.auto();
      const board = document.getElementById('board')!;
      const c1 = document.getElementById('c1')!;
      const first = c1.querySelector('[data-item]') as HTMLElement;
      const p = H.center(first);
      H.down(first, p.x, p.y);
      H.move(p.x + 5, p.y + 5);
      const br = board.getBoundingClientRect();
      // bottom edge of the column (vertical scroller) ...
      const cr = c1.getBoundingClientRect();
      H.move(cr.left + 100, cr.bottom - 8);
      await new Promise((res) => setTimeout(res, 500));
      const colScrollTop = c1.scrollTop;
      // ... then the right edge of the board (horizontal scroller), still over a column
      H.move(br.right - 8, cr.top + 100);
      await new Promise((res) => setTimeout(res, 700));
      const boardScrollLeft = board.scrollLeft;
      H.up(br.right - 8, cr.top + 100);
      return { colScrollTop, boardScrollLeft };
    });
    expect(r.colScrollTop).toBeGreaterThan(50);
    expect(r.boardScrollLeft).toBeGreaterThan(50);
  });
});
