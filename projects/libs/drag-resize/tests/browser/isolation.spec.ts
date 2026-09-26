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
      // o's own placeholder insertion just pushed O2 (and i2 inside it) down for real: aim for
      // i2's CURRENT position, not the stale pre-push one, exactly like a real pointer would.
      const r2now = H.rect(i2);
      H.move(r2now.cx, r2now.t + 10);
      H.up(r2now.cx, r2now.t + 10);
      return { in1, snap, snapOuter, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.in1).toBe(1);
    expect(res.snap).toEqual({ i2: 1, o: 0 });
    expect(res.snapOuter.i2).toBe(0); // left the inner list -> its placeholder is gone immediately
    expect(res.drop).toMatchObject({ from: 'i1', to: 'i2', prev: 0, cur: 1 });
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

describe('nested lists inside a displaced sibling (tree UI)', () => {
  // A recursive-tree shape: root list has items A, B, C, D; B also contains its OWN nested
  // list ("children"), matching e.g. a file/folder or outliner tree where each node can have
  // a nested drop list of its own children.
  const TREE = `<div data-group style="display:contents">
    <div id="root" data-list data-group style="left:20px;top:20px;width:260px">
      <div class="it" data-item data-id="A" style="height:40px">A</div>
      <div class="it" data-item data-id="B" style="height:90px">
        <div>B</div>
        <div id="nested" data-list data-group style="position:relative;left:0;top:0;width:240px">
          <div class="it" data-item data-id="X" style="height:30px">X</div>
        </div>
      </div>
      <div class="it" data-item data-id="C" style="height:40px">C</div>
      <div class="it" data-item data-id="D" style="height:200px">D</div>
    </div></div>`;

  it('a nested list stays hit-testable at its true (transform-displaced) position while a sibling is being sorted', async () => {
    const res = await run(TREE, async (H) => {
      await H.auto({ animation: 0 });
      const root = document.getElementById('root')!;
      const nested = document.getElementById('nested')!;
      const A = root.querySelector('[data-id=A]') as HTMLElement;
      const D = root.querySelector('[data-id=D]') as HTMLElement;
      const c = H.center(D);
      H.down(D, c.x, c.y);
      H.move(c.x, c.y - 4);
      H.move(c.x, H.rect(A).t + 5); // resolve D to index 0: A, B (+nested), C shift down by D's height

      const liveBox = H.rect(nested);
      const bTransform = (root.querySelector('[data-id=B]') as HTMLElement).style.transform;

      // The pointer at nested's REAL, current on-screen position must be detected...
      H.move(liveBox.cx, liveBox.cy);
      const atLive = nested.querySelectorAll('.ngx-drag-placeholder').length;
      const rootStillDisplaced = (root.querySelector('[data-id=B]') as HTMLElement).style.transform;

      // ...moving back out of nested and further up (clearly outside root's displaced item B)
      // must correctly leave nested and NOT falsely detect nested at its stale pre-drag spot.
      H.move(liveBox.cx, 22); // near the very top, over A
      const backInRoot = root.querySelectorAll(':scope > .ngx-drag-placeholder').length;
      const nestedAfterLeaving = nested.querySelectorAll('.ngx-drag-placeholder').length;

      H.move(c.x, H.rect(A).t + 5);
      H.up(c.x, H.rect(A).t + 5);
      return { bTransform, atLive, rootStillDisplaced, backInRoot, nestedAfterLeaving, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.bTransform).toContain('translate3d');
    expect(res.atLive).toBe(1);
    expect(res.rootStillDisplaced).toBe(res.bTransform); // unchanged: root's displacement froze, not reset, while diving into nested
    expect(res.backInRoot).toBe(1);
    expect(res.nestedAfterLeaving).toBe(0);
    expect(res.drop).toMatchObject({ from: 'root', to: 'root', prev: 3, cur: 0 });
    expect(res.leaks).toEqual([]);
  });

  it('dropping into a nested list that lives inside a currently-displaced sibling transfers correctly and cleans up every frozen ancestor', async () => {
    const res = await run(TREE, async (H) => {
      await H.auto({ animation: 0 });
      const root = document.getElementById('root')!;
      const nested = document.getElementById('nested')!;
      const A = root.querySelector('[data-id=A]') as HTMLElement;
      const D = root.querySelector('[data-id=D]') as HTMLElement;
      const c = H.center(D);
      H.down(D, c.x, c.y);
      H.move(c.x, c.y - 4);
      H.move(c.x, H.rect(A).t + 5); // displaces A, B(+nested), C down by D's height
      const liveBox = H.rect(nested);
      H.move(liveBox.cx, liveBox.b - 3); // dive into nested, near its bottom edge (clearly past X's midpoint)
      const live = H.visual(nested).join('');
      H.up(liveBox.cx, liveBox.b - 3);
      return { live, drop: H.drops[0], leaks: H.leaks(), rootChildren: H.dom(root).length };
    });
    expect(res.live).toBe('X[PH]');
    expect(res.drop).toMatchObject({ from: 'root', to: 'nested', prev: 3, cur: 1 });
    expect(res.leaks).toEqual([]); // root's frozen (never fully released mid-drag) session is still cleaned up
    expect(res.rootChildren).toBe(4); // A, B, C, D — D was only ever a placeholder in root, never duplicated
  });

  it('moving back up out of nested and further out of root entirely still restores everything', async () => {
    const res = await run(TREE, async (H) => {
      await H.auto({ animation: 0 });
      const root = document.getElementById('root')!;
      const nested = document.getElementById('nested')!;
      const A = root.querySelector('[data-id=A]') as HTMLElement;
      const D = root.querySelector('[data-id=D]') as HTMLElement;
      const c = H.center(D);
      H.down(D, c.x, c.y);
      H.move(c.x, c.y - 4);
      H.move(c.x, H.rect(A).t + 5);
      const liveBox = H.rect(nested);
      H.move(liveBox.cx, liveBox.cy); // dive into nested
      H.move(900, 900); // now leave EVERYTHING
      const rootDisplacedAfterFullExit = (root.querySelector('[data-id=A]') as HTMLElement).style.transform;
      const visual = H.visual(root).join('');
      H.up(900, 900);
      return { rootDisplacedAfterFullExit, visual, drops: H.drops.length, leaks: H.leaks() };
    });
    expect(res.rootDisplacedAfterFullExit).toBe(''); // fully outside now: root's sibling displacement resets...
    expect(res.visual).toBe('ABC[PH]'); // ...back to D's ORIGINAL slot (the origin always keeps its hole)
    expect(res.drops).toBe(0);
    expect(res.leaks).toEqual([]);
  });
});

describe('three levels of nesting (root -> mid -> leaf)', () => {
  const DEEP = `<div data-group style="display:contents">
    <div id="root" data-list data-group style="left:20px;top:20px;width:300px">
      <div class="it" data-item data-id="A" style="height:40px">A</div>
      <div class="it" data-item data-id="B" style="height:170px">
        <div>B</div>
        <div id="mid" data-list data-group style="position:relative;left:0;top:0;width:280px">
          <div class="it" data-item data-id="M1" style="height:30px">M1</div>
          <div class="it" data-item data-id="M2" style="height:100px">
            <div>M2</div>
            <div id="leaf" data-list data-group style="position:relative;left:0;top:0;width:260px">
              <div class="it" data-item data-id="L1" style="height:30px">L1</div>
            </div>
          </div>
        </div>
      </div>
      <div class="it" data-item data-id="D" style="height:150px">D</div>
    </div></div>`;

  it('dives root -> mid -> leaf, comes back up leaf -> mid -> root, then leaves entirely, all cleanly', async () => {
    const res = await run(DEEP, async (H) => {
      await H.auto({ animation: 0 });
      const root = document.getElementById('root')!;
      const mid = document.getElementById('mid')!;
      const leaf = document.getElementById('leaf')!;
      const A = root.querySelector('[data-id=A]') as HTMLElement;
      const D = root.querySelector('[data-id=D]') as HTMLElement;
      const c = H.center(D);
      const out: any = {};

      H.down(D, c.x, c.y);
      H.move(c.x, c.y - 4);
      H.move(c.x, H.rect(A).t + 5); // displace A, B (mid, leaf inside it), down by D's height

      const bT1 = (root.querySelector('[data-id=B]') as HTMLElement).style.transform;
      const midLive = H.rect(mid);
      H.move(midLive.cx, midLive.t + 5); // dive into mid (near its top, over M1)
      out.midPh = mid.querySelectorAll(':scope > .ngx-drag-placeholder').length;
      // the ORIGIN (root) stays frozen — its displacement of B is left exactly as it is
      out.rootStillDisplaced1 = (root.querySelector('[data-id=B]') as HTMLElement).style.transform === bT1;

      const leafLive = H.rect(leaf);
      H.move(leafLive.cx, leafLive.b - 3); // dive further into leaf (nested inside mid's own item)
      out.leafPh = leaf.querySelectorAll('.ngx-drag-placeholder').length;
      // mid (a FOREIGN, non-origin list) is not the special case: it fully releases like any
      // other list the pointer has left, same as it always did before this fix
      out.midReleasedAfterDivingDeeper = mid.querySelectorAll(':scope > .ngx-drag-placeholder').length === 0;
      out.rootStillDisplaced2 = (root.querySelector('[data-id=B]') as HTMLElement).style.transform === bT1;

      // come back up: leaf -> mid (leaf releases, mid gets a fresh entry, root still frozen)
      // mid's own placeholder insertion may have shifted its content for real: aim for mid's
      // CURRENT position, not the stale pre-dive one.
      const midNow = H.rect(mid);
      H.move(midNow.cx, midNow.t + 5);
      out.leafPhAfterUp = leaf.querySelectorAll('.ngx-drag-placeholder').length;
      out.midPhAfterUp = mid.querySelectorAll(':scope > .ngx-drag-placeholder').length;
      out.rootStillDisplaced3 = (root.querySelector('[data-id=B]') as HTMLElement).style.transform === bT1;

      // leave everything
      H.move(900, 900);
      out.midPhAfterFullExit = mid.querySelectorAll(':scope > .ngx-drag-placeholder').length;
      out.rootVisualAfterFullExit = H.visual(root).join('');
      out.rootDisplacedAfterFullExit = (root.querySelector('[data-id=A]') as HTMLElement).style.transform;

      H.up(900, 900);
      out.leaks = H.leaks();
      out.drops = H.drops.length;
      return out;
    });
    expect(res.midPh).toBe(1);
    expect(res.rootStillDisplaced1).toBe(true);
    expect(res.leafPh).toBe(1);
    expect(res.midReleasedAfterDivingDeeper).toBe(true);
    expect(res.rootStillDisplaced2).toBe(true);
    expect(res.leafPhAfterUp).toBe(0);
    expect(res.midPhAfterUp).toBe(1);
    expect(res.rootStillDisplaced3).toBe(true);
    expect(res.midPhAfterFullExit).toBe(0);
    expect(res.rootVisualAfterFullExit).toBe('AB[PH]'); // hole back at D's original (last) slot (D itself stays hidden)
    expect(res.rootDisplacedAfterFullExit).toBe('');
    expect(res.drops).toBe(0);
    expect(res.leaks).toEqual([]);
  });

  it('jumping straight from root to leaf in one big pointer move enters every intermediate level correctly', async () => {
    const res = await run(DEEP, async (H) => {
      await H.auto({ animation: 0 });
      const root = document.getElementById('root')!;
      const mid = document.getElementById('mid')!;
      const leaf = document.getElementById('leaf')!;
      const A = root.querySelector('[data-id=A]') as HTMLElement;
      const D = root.querySelector('[data-id=D]') as HTMLElement;
      const c = H.center(D);
      H.down(D, c.x, c.y);
      H.move(c.x, c.y - 4);
      H.move(c.x, H.rect(A).t + 5);
      const leafLive = H.rect(leaf);
      H.move(leafLive.cx, leafLive.b - 3); // one single jump straight to the deepest list
      const leafPh = leaf.querySelectorAll('.ngx-drag-placeholder').length;
      const midPh = mid.querySelectorAll(':scope > .ngx-drag-placeholder').length;
      const rootDisplaced = (root.querySelector('[data-id=B]') as HTMLElement).style.transform !== '';
      H.up(leafLive.cx, leafLive.b - 3);
      return { leafPh, midPh, rootDisplaced, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.leafPh).toBe(1);
    expect(res.midPh).toBe(0); // mid is a foreign list: it was entered on the way through, then released, not frozen
    expect(res.rootDisplaced).toBe(true); // the origin (root) stays frozen the whole way down
    expect(res.drop).toMatchObject({ from: 'root', to: 'leaf' });
    expect(res.leaks).toEqual([]);
  });
});

describe('works without any shared Angular injector between levels (ngTemplateOutlet-style trees)', () => {
  // Real apps render a recursive tree via ONE <ng-template> re-invoked through ngTemplateOutlet
  // for each level's children. Angular gives every invocation a FRESH injector context (the
  // outer component's, not "wherever this ended up in the DOM"), so `inject(TOKEN, {skipSelf})`
  // can never see a parent list or group from another recursion level unless the app explicitly
  // threads `ngTemplateOutletInjector` through every level. This registers each list and the
  // group through completely separate, root-parented injectors — nothing shared between them,
  // and no explicit link passed anywhere — to prove parent/group discovery instead relies on
  // real DOM position, not the (broken, for this pattern) Angular injector tree.
  it('finds the parent list and the group across unrelated, unlinked injectors, purely from DOM position', async () => {
    const html = `
      <div id="root" data-list style="left:20px;top:20px;width:260px">
        <div class="it" data-item data-id="A" style="height:40px">A</div>
        <div class="it" data-item data-id="B" style="height:70px">
          <div>B</div>
          <div id="children" data-list style="position:relative;left:0;top:0;width:240px">
            <div class="it" data-item data-id="X" style="height:30px">X</div>
            <div class="it" data-item data-id="Y" style="height:30px">Y</div>
          </div>
        </div>
      </div>
      <div id="other" data-list style="left:320px;top:20px;width:240px">
        <div class="it" data-item data-id="Z" style="height:30px">Z</div>
      </div>`;
    const res = await run(html, async (H) => {
      await H.ready;
      // group() and each registerList() call build their OWN fresh, root-parented injector
      // internally — none is ever passed into another, exactly like ngTemplateOutlet without
      // ngTemplateOutletInjector.
      H.group(document.body);
      const root = H.registerList(document.getElementById('root'), { grouped: true });
      const children = H.registerList(document.getElementById('children'), { grouped: true });
      const other = H.registerList(document.getElementById('other'), { grouped: true });
      [root, children, other].forEach((d) =>
        d.drop.subscribe((e: any) =>
          H.drops.push({ prev: e.previousIndex, cur: e.currentIndex, from: e.previousContainer.el.id, to: e.container.el.id }),
        ),
      );
      ['A', 'B', 'X', 'Y', 'Z'].forEach((id) => H.registerItem(document.querySelector(`[data-id=${id}]`)));

      const structural = {
        childrenParentIsRoot: children._ref.parentList === root._ref,
        sameGroupAllThree:
          !!root._ref.dropListGroup &&
          root._ref.dropListGroup === children._ref.dropListGroup &&
          root._ref.dropListGroup === other._ref.dropListGroup,
        rootConnectedToOther: root._ref.isConnectedTo(other._ref),
        childrenConnectedToOther: children._ref.isConnectedTo(other._ref),
      };

      // An actual cross-branch drag: Z (in the unrelated `other` list) into `children` (nested
      // two structural hops away, discovered with no injector ever shared between any of them).
      const Z = document.querySelector('[data-id=Z]');
      const c = H.center(Z);
      H.down(Z, c.x, c.y);
      H.move(c.x, c.y + 4);
      const cr = H.rect(document.getElementById('children'));
      H.move(cr.cx, cr.t + 5);
      const live = H.visual(document.getElementById('children')).join('');
      H.up(cr.cx, cr.t + 5);
      return { structural, live, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(res.structural).toEqual({
      childrenParentIsRoot: true,
      sameGroupAllThree: true,
      rootConnectedToOther: true,
      childrenConnectedToOther: true,
    });
    expect(res.live).toBe('[PH]XY');
    expect(res.drop).toMatchObject({ from: 'other', to: 'children', prev: 0, cur: 0 });
    expect(res.leaks).toEqual([]);
  });
});
