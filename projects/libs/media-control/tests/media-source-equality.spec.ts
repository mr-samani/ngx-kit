import { describe, expect, it } from 'vitest';
import { mediaSourcesEqual } from '../contracts/media-source';

describe('mediaSourcesEqual', () => {
  it('treats two different array references with identical content as equal', () => {
    const a = [{ src: 'a.mp3', title: 'A' }];
    const b = [{ src: 'a.mp3', title: 'A' }];
    expect(a).not.toBe(b);
    expect(mediaSourcesEqual(a, b)).toBe(true);
  });

  it('detects a real content change (different src)', () => {
    const a = [{ src: 'a.mp3' }];
    const b = [{ src: 'b.mp3' }];
    expect(mediaSourcesEqual(a, b)).toBe(false);
  });

  it('detects a length change', () => {
    expect(mediaSourcesEqual([{ src: 'a.mp3' }], [])).toBe(false);
  });

  it('compares Blob/File/MediaStream sources by identity, not content', () => {
    const blob = new Blob(['x']);
    const a = [{ src: blob }];
    const b = [{ src: blob }];
    const c = [{ src: new Blob(['x']) }];
    expect(mediaSourcesEqual(a, b)).toBe(true); // same reference
    expect(mediaSourcesEqual(a, c)).toBe(false); // different Blob instance, even if content matches
  });
});

