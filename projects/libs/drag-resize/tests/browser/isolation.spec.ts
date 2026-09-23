import { describe, expect, it } from 'vitest';
import { items, run, useBrowser } from './fixture';

useBrowser();

const COLUMN = `<div id="a" data-list style="left:20px;top:20px;width:200px">${items('ABCD')}</div>`;

describe('free drag stays free', () => {
  it('a free-drag element dragged over a drop list is never captured, cloned or sorted', async () => {
    const html = `${COLUMN}<div id="f" data-item data-id="F" style="position:absolute;left:400px;top:300px;width:80px;height:50px;background:#fcc">F</div>`;
    const res = await run(html, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const f = document.getElementById('f')!;
      const domBefore = a.innerHTML;
      const c = H.center(f);
      H.down(f, c.x, c.y);
      H.move(c.x - 5, c.y);
      const seen: any = { placeholders: 0, previews: 0, bodyKids: document.body.children.length, listMutated: false };
      for (const [x, y] of [[100, 60], [100, 130], [110, 170], [600, 500]] as const) {
        H.move(x, y);
        seen.placeholders += document.querySelectorAll('.ngx-drag-placeholder').length;
        seen.previews += document.querySelectorAll('.ngx-drag-preview').length;
        if (a.innerHTML !== domBefore) seen.listMutated = true;
      }
      const t = f.style.transform;
      H.up(600, 500);
      return { ...seen, movedWithTransform: /translate3d/.test(t), display: f.style.display, visibility: f.style.visibility, drops: H.drops.length, bodyKidsAfter: document.body.children.length };
    });
    expect(res.placeholders).toBe(0);
    expect(res.previews).toBe(0);
    expect(res.listMutated).toBe(false);
    expect(res.movedWithTransform).toBe(true); // moved by transform, in place, exactly like before
    expect(res.display).toBe('');
    expect(res.visibility).toBe('');
    expect(res.drops).toBe(0);
    expect(res.bodyKidsAfter).toBe(res.bodyKids);
  });
});

describe('nested drop lists', () => {
  const NESTED = `<div data-group style="display:contents">
    <div id="o" data-list data-group style="left:20px;top:20px;width:320px;padding:6px">
      <div class="it" data-item data-id="O1" style="height:130px;border:1px solid #333">
        <div id="i1" data-list data-group style="position:relative;left:0;top:0;width:260px">${items('ab').replace(/data-id="(.)"/g, 'data-id="x$1"')}</div></div>
      <div class="it" data-item data-id="O2" style="height:130px;border:1px solid #333">
        <div id="i2" data-list data-group style="position:relative;left:0;top:0;width:260px">${items('cd').replace(/data-id="(.)"/g, 'data-id="y$1"')}</div></div>
    </div></div>`;

  it('the innermost list under the pointer receives the drag; parent and child are never both targets', async () => {
    const res = await run(NESTED, async (H) => {
      await H.auto();
      const i1 = document.getElementById('i1')!;
      const i2 = document.getElementById('i2')!;
      const o = document.getElementById('o')!;
      const src = i1.querySelector('[data-id=xa]') as HTMLElement;
      const c = H.center(src);
      H.down(src, c.x, c.y);
      H.move(c.x, c.y + 4);
      const in1 = i1.querySelectorAll('.ngx-drag-placeholder').length; // source list keeps its slot
      const r2 = H.rect(i2);
      H.move(r2.cx, r2.t + 10); // inside i2 AND inside o
      const snap = {
        i2: i2.querySelectorAll('.ngx-drag-placeholder').length,
        o: o.querySelectorAll(':scope > .ngx-drag-placeholder').length,
      };
      H.move(23, r2.cy); // in o's left padding: inside o, horizontally outside i2
      const snapOuter = { i2: i2.querySelectorAll('.ngx-drag-placeholder').length };
      H.move(r2.cx, r2.t + 10);
      H.up(r2.cx, r2.t + 10);
      return { in1, snap, snapOuter, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.in1).toBe(1);
    expect(res.snap).toEqual({ i2: 1, o: 0 });
    expect(res.snapOuter.i2).toBe(0); // left the inner list -> its placeholder is gone immediately
    expect(res.drop).toMatchObject({ from: 'i1', to: 'i2', prev: 0, cur: 0 });
    expect(res.leaks).toEqual([]);
  });

  it('staying over the inner list keeps sorting in the inner list, not the outer one', async () => {
    const res = await run(NESTED, async (H) => {
      await H.auto();
      const i1 = document.getElementById('i1')!;
      const src = i1.querySelector('[data-id=xa]') as HTMLElement;
      const c = H.center(src);
      H.down(src, c.x, c.y);
      H.move(c.x, c.y + 4);
      const r = H.rect(i1.querySelector('[data-id=xb]')!);
      H.move(r.cx, r.cy + 12);
      const live = H.visual(i1).join('');
      H.up(r.cx, r.cy + 12);
      return { live, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.live).toBe('xb[PH]');
    expect(res.drop).toMatchObject({ from: 'i1', to: 'i1', prev: 0, cur: 1 });
    expect(res.leaks).toEqual([]);
  });

  it('a list inside the dragged element is never a drop target for it', async () => {
    const res = await run(NESTED, async (H) => {
      await H.auto();
      const o = document.getElementById('o')!;
      const i1 = document.getElementById('i1')!;
      const O1 = o.querySelector('[data-id=O1]') as HTMLElement;
      const c = H.center(O1);
      const r = H.rect(i1); // measured BEFORE O1 is hidden for the drag
      H.down(O1, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(r.cx, r.cy); // over O1's own inner list (which lives inside the dragged element)
      const inChild = i1.querySelectorAll('.ngx-drag-placeholder').length;
      H.up(r.cx, r.cy);
      return { inChild, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.inChild).toBe(0);
    expect(res.drop).toMatchObject({ from: 'o', to: 'o' });
    expect(res.leaks).toEqual([]);
  });
});

describe('keyboard, destruction and preview fidelity', () => {
  it('keyboard sorting resolves against real geometry; Enter commits, Escape rolls back', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      H.key(B, 'ArrowDown', { shiftKey: true });
      H.key(B, 'ArrowDown', { shiftKey: true }); // 2 x 32px from B's centre (80) -> 144
      const live = H.visual(a).join('');
      H.key(B, 'Enter');
      const committed = { drop: H.drops[0], leaks: H.leaks() };

      H.key(B, 'ArrowDown', { shiftKey: true });
      H.key(B, 'ArrowDown', { shiftKey: true });
      const live2 = H.visual(a).join('');
      H.key(B, 'Escape'); // keyboard mode handles Escape on the host element
      return { live, committed, live2, after: H.visual(a).join(''), drops: H.drops.length, leaks: H.leaks() };
    });
    expect(res.live).toBe('AC[PH]D');
    expect(res.committed.drop).toMatchObject({ prev: 1, cur: 2 });
    expect(res.committed.leaks).toEqual([]);
    expect(res.live2).toBe('AC[PH]D');
    expect(res.after).toBe('ABCD');
    expect(res.drops).toBe(1);
    expect(res.leaks).toEqual([]);
  });

  it('destroying the draggable mid-drag leaves no clone, placeholder, transform or listener behind', async () => {
    const res = await run(COLUMN, async (H) => {
      await H.auto();
      const a = document.getElementById('a')!;
      const B = a.querySelector('[data-id=B]') as HTMLElement;
      const c = H.center(B);
      H.down(B, c.x, c.y);
      H.move(c.x, c.y + 4);
      H.move(c.x, 140);
      H.destroyItem(B);
      const leaks = H.leaks();
      H.move(c.x, 60); // stray events after destruction must be harmless
      H.up(c.x, 60);
      return { leaks, previews: document.querySelectorAll('.ngx-drag-preview').length, drops: H.drops.length, visual: H.visual(a).join('') };
    });
    expect(res.leaks).toEqual([]);
    expect(res.previews).toBe(0);
    expect(res.drops).toBe(0);
    expect(res.visual).toBe('ABCD');
  });

  it('the body preview keeps ancestor-dependent styling, inherited text styles and direction', async () => {
    const css = `.board .it{background:rgb(10,20,30);color:rgb(200,0,0)} .board{font-size:19px;font-family:monospace}`;
    const html = `<div id="a" class="board" data-list style="left:20px;top:20px;width:200px;direction:rtl">${items('ABC')}</div>`;
    const res = await run(
      html,
      async (H) => {
        await H.auto();
        const a = document.getElementById('a')!;
        const B = a.querySelector('[data-id=B]') as HTMLElement;
        const c = H.center(B);
        H.down(B, c.x, c.y);
        H.move(c.x, c.y + 4);
        const p = document.querySelector('.ngx-drag-preview') as HTMLElement;
        const cs = getComputedStyle(p);
        const out = {
          bg: cs.backgroundColor,
          color: cs.color,
          font: cs.fontSize + ' ' + cs.fontFamily,
          direction: cs.direction,
          pe: cs.pointerEvents,
          hasId: p.hasAttribute('id'),
          text: p.textContent,
          w: Math.round(p.getBoundingClientRect().width),
        };
        H.up(c.x, c.y + 4);
        return out;
      },
      undefined,
      { css },
    );
    expect(res).toMatchObject({ bg: 'rgb(10, 20, 30)', color: 'rgb(200, 0, 0)', direction: 'rtl', pe: 'none', hasId: false, text: 'B', w: 200 });
    expect(res.font).toContain('19px');
    expect(res.font).toContain('monospace');
  });

  it('does not leave inline transform/transition on items (stylesheet transforms survive a drag)', async () => {
    const css = `.it:hover,.it{transform:rotate(1deg)}`;
    const res = await run(
      COLUMN,
      async (H) => {
        await H.auto();
        const a = document.getElementById('a')!;
        const B = a.querySelector('[data-id=B]') as HTMLElement;
        const c = H.center(B);
        H.down(B, c.x, c.y);
        H.move(c.x, c.y + 4);
        H.move(c.x, 130);
        const during = a.querySelector('[data-id=C]')!.getAttribute('style');
        H.up(c.x, 130);
        return { during, after: ['A', 'B', 'C', 'D'].map((i) => a.querySelector(`[data-id=${i}]`)!.getAttribute('style')), leaks: H.leaks() };
      },
      undefined,
      { css },
    );
    expect(res.during).toContain('translate3d'); // displaced sibling keeps its own rotation appended
    expect(res.during).toContain('matrix');
    expect(res.after.every((s: string | null) => !s || s === '')).toBe(true);
    expect(res.leaks).toEqual([]);
  });
});
