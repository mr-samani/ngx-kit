import { describe, expect, it } from 'vitest';
import { run, useBrowser, items } from './fixture';

useBrowser();

const TWO = `<div data-group>
  <div id="a" data-list style="left:20px;top:20px;width:150px">${items('AB')}</div>
  <div id="b" data-list style="left:220px;top:20px;width:150px">${items('CD')}</div>
  <div id="c" data-list style="left:20px;top:200px;width:150px">${items('E')}</div>
</div>`;

describe('keyboard sorting hops between slots and lists', () => {
  it('ArrowRight moves the card into the neighbouring list, Enter commits it there', async () => {
    const r = await run(TWO, async (H) => {
      await H.auto();
      const B = document.querySelector('#a [data-id=B]') as HTMLElement;
      H.key(B, 'ArrowRight');
      const inB = document.querySelectorAll('#b .ngx-drag-placeholder').length;
      H.key(B, 'Enter');
      return { inB, drop: H.drops[0], leaks: H.leaks() };
    });
    expect(r.inB).toBe(1);
    expect(r.drop).toMatchObject({ prev: 1, from: 'a', to: 'b' });
    expect(r.leaks).toEqual([]);
  });

  it('ArrowDown past the last card of a list continues into the list below (sections of a column)', async () => {
    const r = await run(TWO, async (H) => {
      await H.auto();
      const B = document.querySelector('#a [data-id=B]') as HTMLElement; // last card of #a
      H.key(B, 'ArrowDown');
      H.key(B, 'Enter');
      return { drop: H.drops[0], leaks: H.leaks() };
    });
    expect(r.drop).toMatchObject({ prev: 1, cur: 0, from: 'a', to: 'c' });
    expect(r.leaks).toEqual([]);
  });

  it('Escape after hopping lists restores everything', async () => {
    const r = await run(TWO, async (H) => {
      await H.auto();
      const B = document.querySelector('#a [data-id=B]') as HTMLElement;
      H.key(B, 'ArrowRight');
      H.key(B, 'Escape');
      return { drops: H.drops.length, order: H.visual(document.getElementById('a')!).join(''), leaks: H.leaks() };
    });
    expect(r).toEqual({ drops: 0, order: 'AB', leaks: [] });
  });

  it('holding a key down (repeat) does not skip slots', async () => {
    const r = await run(TWO, async (H) => {
      await H.auto();
      const A = document.querySelector('#a [data-id=A]') as HTMLElement;
      H.key(A, 'ArrowDown');
      H.key(A, 'ArrowDown', { repeat: true });
      H.key(A, 'ArrowDown', { repeat: true });
      const order = H.visual(document.getElementById('a')!).join('');
      H.key(A, 'Escape');
      return { order };
    });
    expect(r.order).toBe('B[PH]'); // moved exactly one slot, the repeats were ignored
  });
});
