import { describe, expect, it } from 'vitest';
import { items, run, useBrowser } from './fixture';

useBrowser();

const COLUMN = `<div id="a" data-list style="left:20px;top:20px;width:200px">${items('ABCD')}</div>`;
const TWO = `
  <div data-group style="display:contents">
  <div id="a" data-list data-group style="left:20px;top:20px;width:200px">${items('123').replace(/data-id="(.)"/g, 'data-id="A$1"')}</div>
  <div id="b" data-list data-group style="left:320px;top:20px;width:200px">${items('123').replace(/data-id="(.)"/g, 'data-id="B$1"')}</div>
  </div>`;

describe('basic sorting inside one list (vertical)', () => {
  it('moves every item from every index to every other index, live and on drop', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const ids = ['A', 'B', 'C', 'D'];
      const mids = ids.map((i) => H.rect(a.querySelector(`[data-id=${i}]`)!).cy);
      const failures: string[] = [];
      for (let from = 0; from < 4; from++) {
        for (let to = 0; to < 4; to++) {
          const el = a.querySelector(`[data-id=${ids[from]}]`) as HTMLElement;
          const c = H.center(el);
          H.down(el, c.x, c.y);
          H.move(c.x, c.y + 4 * (to >= from ? 1 : -1));
          const y = mids[to] + (to > from ? 12 : to < from ? -12 : 0);
          H.move(c.x, y);
          const others = ids.filter((_, i) => i !== from);
          others.splice(to, 0, '[PH]');
          const seen = H.visual(a);
          if (JSON.stringify(seen) !== JSON.stringify(others)) failures.push(`live ${from}->${to}: ${seen}`);
          H.up(c.x, y);
          const d = H.drops[H.drops.length - 1];
          if (!d || d.prev !== from || d.cur !== to || d.from !== 'a' || d.to !== 'a') failures.push(`event ${from}->${to}: ${JSON.stringify(d)}`);
          const leaked = H.leaks();
          if (leaked.length) failures.push(`leak ${from}->${to}: ${leaked}`);
          if (JSON.stringify(H.visual(a)) !== JSON.stringify(ids)) failures.push(`visual after ${from}->${to}`);
        }
      }
      return { failures, drops: H.drops.length };
    });
    expect(res.failures).toEqual([]);
    expect(res.drops).toBe(16);
  });
});

describe('reversibility (placeholder state is a pure function of the pointer)', () => {
  it('always shows the state that matches the current pointer, however you got there', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const mids = { A: 40, C: 120, D: 160 } as Record<string, number>; // mid-lines of the ORIGINAL slots
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      const expected = (y: number) => {
        const others = ['A', 'C', 'D'];
        const t = others.filter((k) => mids[k] < y).length;
        others.splice(t, 0, '[PH]');
        return others;
      };
      const bad: string[] = [];
      // down, up, down, up ... and a long random-looking walk. Every y is >7px from a mid-line.
      const walk = [172, 100, 172, 60, 172, 140, 100, 20, 140, 172, 20, 172, 100, 60, 100, 140];
      for (const y of walk) {
        H.move(c.x, y);
        const seen = H.visual(a);
        if (JSON.stringify(seen) !== JSON.stringify(expected(y))) bad.push(`y=${y}: ${seen} expected ${expected(y)}`);
      }
      H.up(c.x, 20);
      return { bad, leaks: H.leaks() };
    });
    expect(res.bad).toEqual([]);
    expect(res.leaks).toEqual([]);
  });

  it('does not flicker when the pointer jitters across a mid-line (hysteresis)', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, 100); // clearly before C (mid 120)
      const before = JSON.stringify(H.visual(a));
      const states = new Set<string>();
      for (const y of [118, 122, 119, 121, 120, 123, 117]) {
        H.move(c.x, y);
        states.add(JSON.stringify(H.visual(a)));
      }
      H.move(c.x, 140);
      const past = JSON.stringify(H.visual(a));
      const back = new Set<string>();
      for (const y of [122, 118, 121, 119, 120]) {
        H.move(c.x, y);
        back.add(JSON.stringify(H.visual(a)));
      }
      H.up(c.x, 120);
      return { before, states: [...states], past, back: [...back] };
    });
    expect(res.states).toEqual([res.before]); // jitter of +-3px never flips it
    expect(res.back).toEqual([res.past]); // ...and neither does it on the way back
    expect(res.before).not.toEqual(res.past);
  });

  it('is exact for variable sizes and gaps: displaced layout equals the real reordered layout', async () => {
    const html = (order: string) => `<div id="a" data-list style="left:20px;top:20px;width:200px;display:flex;flex-direction:column;gap:10px">${order
      .split('')
      .map((c, i) => `<div class="it" data-item data-id="${c}" style="height:${{ A: 30, B: 70, C: 50, D: 40 }[c as 'A']}px">${c}</div>`)
      .join('')}</div>
      <div id="ref" style="position:absolute;left:400px;top:20px;width:200px;display:flex;flex-direction:column;gap:10px">${'ACDB'
      .split('')
      .map((c) => `<div class="it" data-id="${c}" style="height:${{ A: 30, B: 70, C: 50, D: 40 }[c as 'A']}px"></div>`)
      .join('')}</div>`;
    const res = await run(html('ABCD'), async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, 235); // inside the list, past D's mid-line -> end
      const live: Record<string, number> = {};
      a.querySelectorAll<HTMLElement>('[data-id]').forEach((n) => {
        live[n.dataset['id']!] = Math.round(H.rect(n).t);
      });
      const ph = a.querySelector('.ngx-drag-placeholder')!;
      const phTop = Math.round(H.rect(ph).t);
      const ref: Record<string, number> = {};
      document.querySelectorAll<HTMLElement>('#ref [data-id]').forEach((n) => (ref[n.dataset['id']!] = Math.round(H.rect(n).t - 0)));
      H.up(c.x, 235);
      return { live, phTop, ref };
    });
    // ref list is ACDB with the same styles; only compare relative to each list's own top (both at top:20)
    expect(res.live['A']).toBe(res.ref['A']);
    expect(res.live['C']).toBe(res.ref['C']);
    expect(res.live['D']).toBe(res.ref['D']);
    expect(res.phTop).toBe(res.ref['B']);
  });
});

describe('leaving and re-entering the same list', () => {
  it('keeps the original slot while outside, recalculates on every re-entry, and is stable', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      const log: any = { outside: [], reentry: [], preview: [] };
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      for (let cycle = 0; cycle < 5; cycle++) {
        H.move(650 + cycle, 300 + cycle * 10);
        log.outside.push(H.visual(a).join(''));
        const p = H.previewRect();
        // the drag starts 4px after mouse-down (drag threshold), so the grab offset is (0,-4)
        log.preview.push(Math.round(Math.abs(p.cx - (650 + cycle))) + Math.round(Math.abs(p.cy + 4 - (300 + cycle * 10))));
        // re-enter at three different places
        const targets = [140, 25, 172];
        H.move(c.x, targets[cycle % 3]);
        log.reentry.push(H.visual(a).join(''));
      }
      H.move(c.x, 140);
      const before = H.visual(a).join('');
      H.up(c.x, 140);
      log.drop = H.drops[H.drops.length - 1];
      log.before = before;
      log.leaks = H.leaks();
      return log;
    });
    expect(res.outside).toEqual(Array(5).fill('A[PH]CD')); // original slot retained, nothing displaced
    expect(res.reentry).toEqual(['AC[PH]D', '[PH]ACD', 'ACD[PH]', 'AC[PH]D', '[PH]ACD']);
    expect(res.preview.every((n: number) => n <= 1)).toBe(true); // preview follows pointer OUTSIDE the list
    expect(res.before).toBe('AC[PH]D');
    expect(res.drop).toMatchObject({ prev: 1, cur: 2, from: 'a', to: 'a' });
    expect(res.leaks).toEqual([]);
  });

  it('is not clamped to the list: the preview can travel anywhere, including outside the viewport', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      const seen: any[] = [];
      for (const [x, y] of [[850, 650], [-60, -40], [5000, 5000], [c.x, c.y]] as const) {
        H.move(x, y);
        const p = H.previewRect();
        seen.push([Math.round(p.cx - x), Math.round(p.cy - y)]); // (0,-4): grab offset from the 4px drag threshold
      }
      H.up(-60, -40);
      return { seen, leaks: H.leaks(), drops: H.drops.length };
    });
    expect(res.seen).toEqual([[0, -4], [0, -4], [0, -4], [0, -4]]);
    expect(res.leaks).toEqual([]);
    expect(res.drops).toBe(0);
  });
});

describe('dropping outside any list / cancelling', () => {
  const dropOutsideCase = async (H: any, how: string) => {
    await H.auto();
    const a = document.getElementById('a')!;
    const B = a.querySelector('[data-id=B]') as HTMLElement;
    const size = H.getList(a)._ref._draggables.size;
    const domBefore = H.dom(a).join(',');
    const c = H.center(B);
    H.down(B, c.x, c.y);
    H.move(c.x, c.y + 4);
    H.move(600, 400);
    H.move(140, 172);
    H.move(600, 420);
    const mid = { previews: document.querySelectorAll('.ngx-drag-preview').length, placeholders: document.querySelectorAll('.ngx-drag-placeholder').length };
    if (how === 'up') H.up(600, 420);
    else if (how === 'esc') H.esc();
    else if (how === 'pointercancel') H.cancelPtr(600, 420);
    return {
      mid,
      leaks: H.leaks(),
      drops: H.drops.length,
      domSame: H.dom(a).join(',') === domBefore,
      visual: H.visual(a).join(''),
      members: H.getList(a)._ref._draggables.size === size,
      bShown: getComputedStyle(B).display !== 'none' && getComputedStyle(B).visibility !== 'hidden',
      // The item must still be draggable afterwards (it was never unregistered from its list).
      again: (() => {
        H.down(B, c.x, c.y);
        H.move(c.x, c.y + 4);
        const ok = document.querySelectorAll('.ngx-drag-preview').length === 1 && H.visual(a).join('') === 'A[PH]CD';
        H.up(c.x, c.y + 4);
        return ok && H.drops.length === 1;
      })(),
    };
  };

  for (const how of ['up', 'esc', 'pointercancel']) {
    it(`restores the exact pre-drag state (${how})`, async () => {
      const res = await run(COLUMN, dropOutsideCase, how);
      expect(res.mid).toEqual({ previews: 1, placeholders: 1 });
      expect(res.leaks).toEqual([]);
      expect(res.domSame).toBe(true);
      expect(res.visual).toBe('ABCD');
      expect(res.members).toBe(true);
      expect(res.bShown).toBe(true);
      expect(res.drops).toBe(0);
      expect(res.again).toBe(true); // the follow-up drag ended inside the list -> exactly one drop
    });
  }
});

describe('cross-list dragging', () => {
  it('A -> B and B -> A with correct indexes, displacement and cleanup', async () => {
    const res = await run(TWO, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const b = document.getElementById('b')!;
      const q = (l: HTMLElement, id: string) => l.querySelector(`[data-id=${id}]`) as HTMLElement;
      const out: any = {};

      // A2 -> between B1 and B2
      let c = H.center(q(a, 'A2'));
      H.down(q(a, 'A2'), c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(420, 40 + 12); // just past B1's mid-line
      out.live1 = { a: H.visual(a).join(''), b: H.visual(b).join(''), phInB: b.querySelectorAll('.ngx-drag-placeholder').length };
      H.move(420, 172); // below B3
      out.live2 = H.visual(b).join('');
      H.move(420, 30); // top of B
      out.live3 = H.visual(b).join('');
      H.move(420, 40 + 12);
      H.up(420, 52);
      out.drop1 = H.drops[H.drops.length - 1];
      out.leaks1 = H.leaks();
      out.bAfter = H.visual(b).join('');
      out.aAfter = H.visual(a).join('');

      // B3 -> top of A
      c = H.center(q(b, 'B3'));
      H.down(q(b, 'B3'), c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(120, 22);
      out.live4 = { a: H.visual(a).join(''), b: H.visual(b).join('') };
      H.up(120, 22);
      out.drop2 = H.drops[H.drops.length - 1];
      out.leaks2 = H.leaks();
      out.total = H.drops.length;
      return out;
    });
    expect(res.live1).toEqual({ a: 'A1[PH]A3', b: 'B1[PH]B2B3', phInB: 1 }); // source keeps its hole
    expect(res.live2).toBe('B1B2B3[PH]');
    expect(res.live3).toBe('[PH]B1B2B3');
    expect(res.drop1).toMatchObject({ prev: 1, cur: 1, from: 'a', to: 'b', item: 'A2' });
    expect(res.leaks1).toEqual([]);
    expect(res.aAfter).toBe('A1A2A3'); // DOM is only ever changed by the consumer's model update
    expect(res.live4).toEqual({ a: '[PH]A1A2A3', b: 'B1B2[PH]' }); // B3's source list shows its hole
    expect(res.drop2).toMatchObject({ prev: 2, cur: 0, from: 'b', to: 'a', item: 'B3' });
    expect(res.leaks2).toEqual([]);
    expect(res.total).toBe(2);
  });

  it('does not let an item into lists it is not connected to', async () => {
    const html = `<div id="a" data-list style="left:20px;top:20px;width:200px">${items('123')}</div>
                  <div id="b" data-list style="left:320px;top:20px;width:200px">${items('456')}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const b = document.getElementById('b')!;
      const c = H.center(a.children[0]);
      H.down(a.children[0], c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(420, 60);
      const ph = b.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(420, 60);
      return { ph, drops: H.drops.length, leaks: H.leaks() };
    });
    expect(res).toEqual({ ph: 0, drops: 0, leaks: [] });
  });

  it('supports explicit connectedTo and never chains A->B->C transitively', async () => {
    const html = `<div id="a" data-list data-connect="b" style="left:20px;top:20px;width:150px">${items('1')}</div>
                  <div id="b" data-list data-connect="c" style="left:200px;top:20px;width:150px">${items('2')}</div>
                  <div id="c" data-list style="left:380px;top:20px;width:150px">${items('3')}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const [a, b, c] = ['a', 'b', 'c'].map((i) => document.getElementById(i)!);
      const p = H.center(a.children[0]);
      H.down(a.children[0], p.x, p.y);
      H.move(p.x, p.y + 4);
      H.move(260, 40);
      const inB = b.querySelectorAll('.ngx-drag-placeholder').length;
      H.move(440, 40);
      const inC = c.querySelectorAll('.ngx-drag-placeholder').length;
      const leftB = b.querySelectorAll('.ngx-drag-placeholder').length;
      H.move(260, 52);
      H.up(260, 52);
      return { inB, inC, leftB, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.inB).toBe(1);
    expect(res.inC).toBe(0);
    expect(res.leftB).toBe(0); // leaving B removed its placeholder immediately
    expect(res.drop).toMatchObject({ from: 'a', to: 'b', prev: 0, cur: 1 });
    expect(res.leaks).toEqual([]);
  });

  it('survives rapid in/out/switching between lists with at most one placeholder per list', async () => {
    const html = `${TWO}<div id="c" data-list data-group style="left:620px;top:20px;width:200px">${items('xyz').replace(/data-id="(.)"/g, 'data-id="C$1"')}</div>`.replace(
      '</div>\n  </div>',
      '</div>\n  </div>',
    );
    const res = await run(html, async (H) => {
      await H.auto();
      const lists = ['a', 'b', 'c'].map((i) => document.getElementById(i)!);
      const src = lists[0].querySelector('[data-id=A2]') as HTMLElement;
      const c0 = H.center(src);
      H.down(src, c0.x, c0.y);
      H.move(c0.x, c0.y + 4);
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const bad: string[] = [];
      for (let i = 0; i < 400; i++) {
        const x = rnd() * 880, y = rnd() * 260;
        H.move(x, y);
        const over = lists.filter((l) => { const r = l.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
        const phs = document.querySelectorAll('.ngx-drag-placeholder').length;
        const foreign = over.length && over[0] !== lists[0] ? 1 : 0;
        if (phs !== 1 + foreign) bad.push(`i=${i} (${x | 0},${y | 0}) placeholders=${phs} expected ${1 + foreign}`);
        if (document.querySelectorAll('.ngx-drag-preview').length !== 1) bad.push(`i=${i} preview count`);
      }
      H.move(-100, -100);
      H.up(-100, -100);
      return { bad: bad.slice(0, 5), leaks: H.leaks(), drops: H.drops.length };
    });
    expect(res).toEqual({ bad: [], leaks: [], drops: 0 });
  });
});

describe('edge cases', () => {
  it('drops into an empty list', async () => {
    const html = `<div id="a" data-list data-group style="left:20px;top:20px;width:200px">${items('12')}</div>
                  <div id="b" data-list data-group style="left:320px;top:20px;width:200px;min-height:60px;border:1px dashed"></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const b = document.getElementById('b')!;
      const c = H.center(a.children[0]);
      H.down(a.children[0], c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(400, 50);
      const live = H.visual(b).join('');
      H.up(400, 50);
      return { live, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.live).toBe('[PH]');
    expect(res.drop).toMatchObject({ from: 'a', to: 'b', prev: 0, cur: 0 });
    expect(res.leaks).toEqual([]);
  });

  it('single-item list: sorts (no-op) and can leave / come back / drop', async () => {
    const html = `<div id="a" data-list style="left:20px;top:20px;width:200px;min-height:80px">${items('A')}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const c = H.center(a.children[0]);
      H.down(a.children[0], c.x, c.y);
      H.move(c.x, c.y + 4);
      const seen = new Set<string>();
      for (const y of [25, 60, 70, 30]) { H.move(c.x, y); seen.add(H.visual(a).join('')); }
      H.move(600, 400);
      H.move(c.x, 50);
      H.up(c.x, 50);
      return { seen: [...seen], drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.seen).toEqual(['[PH]']);
    expect(res.drop).toMatchObject({ prev: 0, cur: 0 });
    expect(res.leaks).toEqual([]);
  });

  it('dropping in place emits previousIndex === currentIndex; first and last items work', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const out: any[] = [];
      for (const id of ['A', 'D']) {
        const el = a.querySelector(`[data-id=${id}]`) as HTMLElement;
        const c = H.center(el);
        H.down(el, c.x, c.y);
        H.move(c.x, c.y + 4);
        H.move(c.x, c.y - 3);
        H.up(c.x, c.y);
        out.push(H.drops[H.drops.length - 1]);
      }
      return { out, leaks: H.leaks() };
    });
    expect(res.out[0]).toMatchObject({ prev: 0, cur: 0 });
    expect(res.out[1]).toMatchObject({ prev: 3, cur: 3 });
    expect(res.leaks).toEqual([]);
  });

  it('disableSort keeps the slot fixed but still allows leaving/dropping', async () => {
    const html = `<div id="a" data-list data-disable-sort style="left:20px;top:20px;width:200px">${items('ABCD')}</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      const seen = new Set<string>();
      for (const y of [30, 172, 130]) { H.move(c.x, y); seen.add(H.visual(a).join('')); }
      H.up(c.x, 130);
      return { seen: [...seen], drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.seen).toEqual(['A[PH]CD']);
    expect(res.drop).toMatchObject({ prev: 1, cur: 1 });
    expect(res.leaks).toEqual([]);
  });

  it('maps indexes correctly when some draggables are hidden', async () => {
    const html = `<div id="a" data-list style="left:20px;top:20px;width:200px">
      <div class="it" data-item data-id="A">A</div><div class="it" data-item data-id="X" style="display:none">X</div>
      <div class="it" data-item data-id="B">B</div><div class="it" data-item data-id="C">C</div></div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const A = a.querySelector('[data-id=A]') as HTMLElement;
      const c = H.center(A);
      H.down(A, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, 90); // between B(mid 60) and C(mid 100)
      const live = H.visual(a).join('');
      H.up(c.x, 90);
      return { live, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.live).toBe('B[PH]C');
    expect(res.drop).toMatchObject({ prev: 0, cur: 2 }); // [X,B,A,C] -> A is at model index 2
    expect(res.leaks).toEqual([]);
  });
});
