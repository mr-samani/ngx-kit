import { describe, expect, it } from 'vitest';
import { items, run, useBrowser } from './fixture';

useBrowser();

describe('scrolling', () => {
  it('page scroll: sorting follows the content under a stationary pointer; the preview stays put', async () => {
    const html = `<div style="height:2600px"></div>
      <div id="a" data-list style="left:20px;top:1000px;width:200px">${items('ABCD')}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      window.scrollTo(0, 900);
      await H.raf();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, c.y + 10); // content y 1070: between B's slot and C's mid (1100)
      const out: any = { start: H.visual(a).join(''), previews: [] as number[] };
      const step = async (dy: number) => {
        window.scrollBy(0, dy);
        await H.raf();
        out.previews.push(Math.round(H.previewRect().cy));
        return H.visual(a).join('');
      };
      out.down80 = await step(80); // pointer now over content y 1150 (past D's mid 1140)
      out.up80 = await step(-80); // and back
      out.down40 = await step(40); // 1110 (past C's mid 1100)
      out.up40 = await step(-40);
      H.up(c.x, c.y + 10);
      out.leaks = H.leaks();
      out.drop = H.drops[0];
      return out;
    });
    expect(res.start).toBe('A[PH]CD');
    expect(res.down80).toBe('ACD[PH]');
    expect(res.up80).toBe('A[PH]CD'); // reversible under scroll too
    expect(res.down40).toBe('AC[PH]D');
    expect(res.up40).toBe('A[PH]CD');
    expect(new Set(res.previews).size).toBe(1); // position:fixed preview never moves with the page
    expect(res.leaks).toEqual([]);
    expect(res.drop).toMatchObject({ prev: 1, cur: 1 });
  });

  it('parent scroll container (overflow:auto), with the list partly clipped', async () => {
    const html = `<div id="wrap" style="position:absolute;left:20px;top:20px;width:220px;height:150px;overflow:auto">
        <div id="a" data-list style="left:0;top:0;width:200px">${items('ABCDEFGH')}</div></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const wrap = document.getElementById('wrap')!;
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, c.y + 10);
      const out: any = { start: H.visual(a).join('') };
      wrap.scrollTop = 80;
      await H.raf();
      out.scrolled = H.visual(a).join('');
      wrap.scrollTop = 0;
      await H.raf();
      out.back = H.visual(a).join('');
      // still hit-tested as "inside" after scrolling although the list moved under the clip window
      wrap.scrollTop = 120;
      await H.raf();
      out.inside = document.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(c.x, c.y + 10);
      out.drop = H.drops[0];
      out.leaks = H.leaks();
      return out;
    });
    expect(res.start).toBe('A[PH]CDEFGH');
    expect(res.scrolled).toBe('ACD[PH]EFGH'); // pointer over content y=150 (past D's mid 140)
    expect(res.back).toBe('A[PH]CDEFGH');
    expect(res.inside).toBe(1);
    expect(res.drop).toBeTruthy();
    expect(res.leaks).toEqual([]);
  });

  it('nested scroll containers: outer and inner scroll offsets add up', async () => {
    const html = `<div id="outer" style="position:absolute;left:20px;top:20px;width:240px;height:200px;overflow:auto">
        <div id="inner" style="position:relative;width:220px;height:150px;overflow:auto">
          <div id="a" data-list style="left:0;top:0;width:200px">${items('ABCDEFGH')}</div></div>
        <div style="height:600px"></div></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const outer = document.getElementById('outer')!;
      const inner = document.getElementById('inner')!;
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, c.y + 10); // content y 70
      const out: any = { start: H.visual(a).join('') };
      outer.scrollTop = 40;
      await H.raf();
      out.outer40 = H.visual(a).join(''); // content 110 -> past C's mid (100)
      inner.scrollTop = 40;
      await H.raf();
      out.both = H.visual(a).join(''); // content 150 -> past D's mid (140)
      outer.scrollTop = 0;
      await H.raf();
      out.innerOnly = H.visual(a).join(''); // content 110 again
      inner.scrollTop = 0;
      await H.raf();
      out.reset = H.visual(a).join('');
      H.up(c.x, c.y + 10);
      out.leaks = H.leaks();
      return out;
    });
    expect(res.start).toBe('A[PH]CDEFGH');
    expect(res.outer40).toBe('AC[PH]DEFGH');
    expect(res.both).toBe('ACD[PH]EFGH');
    expect(res.innerOnly).toBe('AC[PH]DEFGH');
    expect(res.reset).toBe('A[PH]CDEFGH');
    expect(res.leaks).toEqual([]);
  });

  it('a preview is never clipped by overflow:hidden / scrolling / transformed ancestors', async () => {
    const html = `<div id="clip" style="position:absolute;left:20px;top:20px;width:220px;height:100px;overflow:hidden;transform:translate(15px,10px)">
        <div id="a" data-list style="left:0;top:0;width:200px;height:400px;position:absolute">${items('ABCD')}</div></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(500, 300);
      const p = document.querySelector('.ngx-drag-preview') as HTMLElement;
      const r = H.rect(p);
      const out = { parentIsBody: p.parentElement === document.body, cx: Math.round(r.cx), cy: Math.round(r.cy + 4), fixed: getComputedStyle(p).position };
      H.up(500, 300);
      return out;
    });
    expect(res).toEqual({ parentIsBody: true, cx: 500, cy: 300, fixed: 'fixed' });
  });

  it('a list scrolled out of view / clipped by an ancestor is not a drop target', async () => {
    const html = `<div data-group style="display:contents">
      <div id="a" data-list data-group style="left:320px;top:20px;width:200px">${items('12')}</div>
      <div id="clip" style="position:absolute;left:20px;top:20px;width:220px;height:100px;overflow:hidden">
        <div id="b" data-list data-group style="left:0;top:0;width:200px;height:400px">${items('ABCDEFGHIJ')}</div></div></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const b = document.getElementById('b')!;
      const c = H.center(a.children[0]);
      H.down(a.children[0], c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(100, 60); // inside b's visible window
      const inVisible = b.querySelectorAll('.ngx-drag-placeholder').length;
      H.move(100, 200); // inside b's box but below the clip window
      const inClipped = b.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(100, 200);
      return { inVisible, inClipped, drops: H.drops.length, leaks: H.leaks() };
    });
    expect(res).toEqual({ inVisible: 1, inClipped: 0, drops: 0, leaks: [] });
  });
});

describe('performance and DOM stability', () => {
  const many = items('ABCDEFGHIJKLMNOPQRST');

  it('single-axis sorting: ZERO DOM mutations and ZERO layout reads per pointer move', async () => {
    const html = `<div id="a" data-list style="left:20px;top:20px;width:200px">${many}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const before = Array.from(a.children);
      const B = a.querySelector('[data-id=C]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4); // drag start (measures once)

      let rects = 0;
      let styles = 0;
      const gbr = Element.prototype.getBoundingClientRect;
      const gcs = window.getComputedStyle;
      Element.prototype.getBoundingClientRect = function (this: Element) { rects++; return gbr.call(this); };
      (window as any).getComputedStyle = function (...a: any[]) { styles++; return (gcs as any).apply(window, a); };
      const watch = H.watchDom(document);
      let indexChanges = 0;
      let last = '';
      for (let i = 0; i < 300; i++) {
        const y = 40 + ((i * 37) % 700) * 0.9; // sweeps up/down the whole list and beyond
        H.move(c.x, Math.min(y, 800));
        const v = H.visual(a).join('');
        void v;
      }
      const mutations = watch.stop();
      Element.prototype.getBoundingClientRect = gbr;
      (window as any).getComputedStyle = gcs;
      // (the visual() probe above reads rects itself; measure the engine alone in a second pass)
      let rects2 = 0;
      Element.prototype.getBoundingClientRect = function (this: Element) { rects2++; return gbr.call(this); };
      (window as any).getComputedStyle = function (...a: any[]) { styles++; return (gcs as any).apply(window, a); };
      styles = 0;
      const watch2 = H.watchDom(document);
      for (let i = 0; i < 300; i++) H.move(c.x, 40 + ((i * 37) % 700) * 0.9 > 800 ? 800 : 40 + ((i * 37) % 700) * 0.9);
      const mutations2 = watch2.stop();
      Element.prototype.getBoundingClientRect = gbr;
      (window as any).getComputedStyle = gcs;
      H.up(c.x, 300);
      const same = Array.from(a.children).length === before.length && before.every((n, i) => a.children[i] === n);
      return { mutations: mutations.length + mutations2.length, rects: rects2, styles, same, leaks: H.leaks(), indexChanges };
    });
    expect(res.mutations).toBe(0); // the DOM is completely stable while sorting (transform-only)
    expect(res.rects).toBe(0); // geometry is cached: no layout reads on the hot path
    expect(res.styles).toBe(0);
    expect(res.same).toBe(true); // no element was recreated or reordered
    expect(res.leaks).toEqual([]);
  });

  it('2D (grid) sorting only ever moves the single placeholder node; no item is recreated', async () => {
    const cells = Array.from({ length: 12 }, (_, i) => `<div class="it" data-item data-id="${String.fromCharCode(65 + i)}" style="height:40px">${String.fromCharCode(65 + i)}</div>`).join('');
    const html = `<div id="a" data-list style="left:20px;top:20px;width:300px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${cells}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const before = Array.from(a.children);
      const el = a.querySelector('[data-id=E]') as HTMLElement;
      const c = H.center(el);
      H.down(el, c.x, c.y);
      H.move(c.x + 4, c.y);
      const watch = H.watchDom(document);
      for (let i = 0; i < 120; i++) H.move(20 + ((i * 53) % 300), 20 + ((i * 29) % 200));
      H.up(0, 0);
      const log = watch.stop();
      const touched = new Set(log.flatMap((l: any) => [...l.added, ...l.removed]));
      const ids = [...touched].filter((n: any) => !/ngx-drag-(placeholder|preview)/.test(String(n)) && n !== '#text');
      const same = before.every((n, i) => a.children[i] === n);
      return { ids, same, leaks: H.leaks() };
    });
    expect(res.ids).toEqual([]); // only placeholder / preview / whitespace nodes were touched
    expect(res.same).toBe(true);
    expect(res.leaks).toEqual([]);
  });
});
