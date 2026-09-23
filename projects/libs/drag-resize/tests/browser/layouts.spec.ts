import { describe, expect, it } from 'vitest';
import { run, useBrowser } from './fixture';

useBrowser();

interface Fixture {
  name: string;
  /** inline style of the drop list */
  list: string;
  /** inline style of item i */
  item: (i: number) => string;
  n: number;
  axis: 'x' | 'y' | 'grid';
  rtl?: boolean;
  /** DOM order runs against the visual reading order (row-reverse / column-reverse). */
  revX?: boolean;
  revY?: boolean;
  sep?: string;
  cls?: string;
}

const W = [120, 60, 90, 150, 70, 100, 80];
const F: Fixture[] = [
  { name: 'block (vertical)', list: 'width:200px', item: () => '', n: 5, axis: 'y', cls: 'it' },
  { name: 'flex row', list: 'display:flex', item: () => 'flex:none;width:80px;height:40px', n: 5, axis: 'x' },
  { name: 'flex row with gap and variable widths', list: 'display:flex;gap:12px', item: (i) => `flex:none;width:${W[i]}px;height:40px`, n: 6, axis: 'x' },
  { name: 'flex column with gap and variable heights', list: 'display:flex;flex-direction:column;gap:9px;width:150px', item: (i) => `height:${[30, 70, 50, 40, 60][i]}px`, n: 5, axis: 'y' },
  { name: 'flex row-reverse', list: 'display:flex;flex-direction:row-reverse;width:500px', item: () => 'flex:none;width:80px;height:40px', n: 4, axis: 'x', revX: true },
  { name: 'flex column-reverse', list: 'display:flex;flex-direction:column-reverse;width:150px', item: () => 'height:40px', n: 4, axis: 'y', revY: true },
  { name: 'flex wrap (uniform)', list: 'display:flex;flex-wrap:wrap;gap:10px;width:270px', item: () => 'flex:none;width:80px;height:40px', n: 7, axis: 'grid' },
  { name: 'flex wrap (variable widths)', list: 'display:flex;flex-wrap:wrap;gap:8px;width:300px', item: (i) => `flex:none;width:${W[i]}px;height:40px`, n: 7, axis: 'grid' },
  { name: 'grid 3 columns x 3 rows', list: 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:300px', item: () => 'height:40px', n: 8, axis: 'grid' },
  { name: 'grid with spanning items and different heights', list: 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:360px;align-items:start', item: (i) => `height:${[40, 60, 40, 40, 50, 40, 40][i]}px;${i === 1 || i === 4 ? 'grid-column:span 2' : ''}`, n: 7, axis: 'grid' },
  { name: 'inline-block, one row', list: 'width:600px', item: () => 'display:inline-block;width:80px;height:40px;vertical-align:top', n: 5, axis: 'x', sep: '\n' },
  { name: 'inline-block, wrapping', list: 'width:270px', item: () => 'display:inline-block;width:80px;height:40px;vertical-align:top', n: 7, axis: 'grid', sep: '\n' },
  { name: 'floats', list: 'width:270px;overflow:hidden', item: () => 'float:left;width:80px;height:40px', n: 7, axis: 'grid' },
  { name: 'RTL flex row', list: 'display:flex;direction:rtl;gap:8px;width:500px', item: () => 'flex:none;width:80px;height:40px', n: 5, axis: 'x', rtl: true },
  { name: 'RTL flex row, variable widths', list: 'display:flex;direction:rtl;width:600px', item: (i) => `flex:none;width:${W[i]}px;height:40px`, n: 6, axis: 'x', rtl: true },
  { name: 'RTL flex wrap', list: 'display:flex;direction:rtl;flex-wrap:wrap;gap:10px;width:270px', item: () => 'flex:none;width:80px;height:40px', n: 7, axis: 'grid', rtl: true },
  { name: 'RTL grid', list: 'display:grid;direction:rtl;grid-template-columns:repeat(3,1fr);gap:8px;width:300px', item: () => 'height:40px', n: 8, axis: 'grid', rtl: true },
  { name: 'RTL inline-block', list: 'direction:rtl;width:600px', item: () => 'display:inline-block;width:80px;height:40px;vertical-align:top', n: 5, axis: 'x', rtl: true, sep: '\n' },
  { name: 'RTL block (vertical)', list: 'direction:rtl;width:200px', item: () => '', n: 5, axis: 'y', rtl: true, cls: 'it' },
];

function html(f: Fixture): string {
  const kids = Array.from({ length: f.n }, (_, i) => {
    const id = String.fromCharCode(65 + i);
    return `<div class="${f.cls ?? 'it'}" data-item data-id="${id}" style="box-sizing:border-box;${f.item(i)}">${id}</div>`;
  }).join(f.sep ?? '');
  return `<div id="a" data-list style="left:30px;top:30px;${f.list}">${kids}</div>`;
}

const CASES = (n: number): [number, number][] => {
  const last = n - 1;
  const mid = Math.floor(n / 2);
  return [[0, 1], [1, 0], [0, last], [last, 0], [1, mid], [mid, 1], [mid, last - 1], [last - 1, mid]].filter(
    ([a, b]) => a !== b && a <= last && b <= last,
  ) as [number, number][];
};

describe('sorting across layouts (real Chromium layout)', () => {
  for (const f of F) {
    it(`${f.name}: every move shows the right placeholder, the exact reordered layout, and emits the right indexes`, async () => {
      const res = await run(
        html(f),
        async (H, arg: { f: any; cases: [number, number][] }) => {
          const { f, cases } = arg;
          await H.auto();
          const a = document.getElementById('a')!;
          const ids = Array.from(a.querySelectorAll<HTMLElement>('[data-id]')).map((e) => e.dataset['id']!);
          const failures: string[] = [];
          const axesSeen = new Set<string>();
          const norm = (arr: string[]) => (f.revX || f.revY ? [...arr].reverse() : arr);

          for (const [from, to] of cases) {
            // pristine reference list, re-ordered the way the drop would leave it
            const origin = H.rect(a);
            const ref = a.cloneNode(true) as HTMLElement;
            ref.removeAttribute('data-list');
            ref.id = 'ref';
            ref.style.position = 'absolute';
            ref.style.left = '480px';
            ref.style.top = a.style.top;
            ref.style.visibility = 'hidden';
            const kids = Array.from(ref.children) as HTMLElement[];
            const moved = kids.splice(from, 1)[0];
            kids.splice(to, 0, moved);
            ref.replaceChildren(...kids.flatMap((k, i) => (f.sep && i ? [document.createTextNode(f.sep), k] : [k])));
            document.body.appendChild(ref);

            const rects = ids.map((i) => H.rect(a.querySelector(`[data-id=${i}]`)!));
            const el = a.querySelector(`[data-id=${ids[from]}]`) as HTMLElement;
            const c = H.center(el);
            const m = rects[to];
            const forward = to > from ? 1 : -1;
            const dirX = f.rtl || f.revX ? -1 : 1;
            const dirY = f.revY ? -1 : 1;
            const pointer =
              f.axis === 'y'
                ? { x: m.cx, y: m.cy + forward * dirY * 12 }
                : { x: m.cx + forward * dirX * 12, y: m.cy };

            H.down(el, c.x, c.y);
            H.move(c.x + 4, c.y);
            H.move(pointer.x, pointer.y);

            const expected = ids.filter((_, i) => i !== from);
            expected.splice(to, 0, '[PH]');
            const seen = norm(H.visual(a) as string[]);
            if (JSON.stringify(seen) !== JSON.stringify(expected)) failures.push(`${from}->${to} visual ${seen} expected ${expected}`);

            // exact geometry: displaced siblings + placeholder == a real re-ordered layout
            const refRects = Array.from(ref.children).map((k) => H.rect(k));
            const refIds = Array.from(ref.children).map((k) => (k as HTMLElement).dataset['id']!);
            const live: Record<string, any> = {};
            a.querySelectorAll<HTMLElement>('[data-id]').forEach((n) => {
              if (n.style.display !== 'none') live[n.dataset['id']!] = H.rect(n);
            });
            const ph = a.querySelector('.ngx-drag-placeholder');
            if (ph) live[ids[from]] = H.rect(ph);
            refIds.forEach((id, i) => {
              const l = live[id];
              const r = refRects[i];
              const refBox = H.rect(ref);
              const dx = Math.abs(l.l - origin.l - (r.l - refBox.l));
              const dy = Math.abs(l.t - origin.t - (r.t - refBox.t));
              if (dx > 1 || dy > 1) failures.push(`${from}->${to} geometry of ${id}: off by (${dx.toFixed(1)}, ${dy.toFixed(1)})`);
            });

            const session = H.getList(a)._ref.session;
            axesSeen.add(session?.mode + ':' + session?.axis);
            H.up(pointer.x, pointer.y);
            ref.remove();

            const d = H.drops[H.drops.length - 1];
            if (!d || d.prev !== from || d.cur !== to) failures.push(`${from}->${to} event ${JSON.stringify(d)}`);
            const leaked = H.leaks();
            if (leaked.length) failures.push(`${from}->${to} leaks ${leaked}`);
            if (JSON.stringify(norm(H.visual(a))) !== JSON.stringify(ids)) failures.push(`${from}->${to} not restored`);
          }
          return { failures, axes: [...axesSeen] };
        },
        { f: { axis: f.axis, rtl: f.rtl, revX: f.revX, revY: f.revY, sep: f.sep }, cases: CASES(f.n) },
      );
      expect(res.failures).toEqual([]);
      const expectedAxis = f.axis === 'grid' ? 'flow:grid' : `transform:${f.axis}`;
      expect(res.axes).toEqual([expectedAxis]); // orientation was detected from geometry, never configured
    });
  }
});

describe('reversibility in 2D layouts', () => {
  for (const name of ['flex wrap (variable widths)', 'grid 3 columns x 3 rows', 'RTL grid']) {
    it(`${name}: walking the pointer around and back reproduces the same states`, async () => {
      const f = F.find((x) => x.name === name)!;
      const res = await run(html(f), async (H, rtl: boolean) => {
        await H.auto();
        const a = document.getElementById('a')!;
        const ids = Array.from(a.querySelectorAll<HTMLElement>('[data-id]')).map((e) => e.dataset['id']!);
        const rects = ids.map((i) => H.rect(a.querySelector(`[data-id=${i}]`)!));
        const el = a.querySelector(`[data-id=${ids[0]}]`) as HTMLElement;
        const c = H.center(el);
        H.down(el, c.x, c.y);
        H.move(c.x + 4, c.y);
        // sample 12px past each mid-line, i.e. outside the (deliberate) +-6px hysteresis band
        const points = rects.map((r) => ({ x: r.cx + (rtl ? -12 : 12), y: r.cy }));
        const stateAt = (p: { x: number; y: number }) => {
          H.move(p.x, p.y);
          return H.visual(a).join('');
        };
        const first = points.map(stateAt);
        const back = [...points].reverse().map(stateAt).reverse();
        const again = points.map(stateAt);
        H.up(0, 0);
        return { first, back, again, leaks: H.leaks() };
      }, !!f.rtl);
      expect(res.back).toEqual(res.first); // same pointer -> same state, regardless of approach direction
      expect(res.again).toEqual(res.first);
      expect(res.leaks).toEqual([]);
    });
  }
});
