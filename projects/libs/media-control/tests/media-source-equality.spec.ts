import { describe, expect, it } from 'vitest';
import { mediaSourcesEqual, extractMediaFileName } from '../contracts/media-source';

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

  it('detects a downloadUrl-only change (previously ignored)', () => {
    const a = [{ src: 'a.mp3', downloadUrl: 'a1.mp3' }];
    const b = [{ src: 'a.mp3', downloadUrl: 'a2.mp3' }];
    expect(mediaSourcesEqual(a, b)).toBe(false);
  });

  it('detects an artist/album-only change (previously ignored)', () => {
    expect(mediaSourcesEqual([{ src: 'a.mp3', artist: 'X' }], [{ src: 'a.mp3', artist: 'Y' }])).toBe(false);
    expect(mediaSourcesEqual([{ src: 'a.mp3', album: 'X' }], [{ src: 'a.mp3', album: 'Y' }])).toBe(false);
  });

  it('detects a requestHeaders change, ignoring key order/case (previously ignored entirely)', () => {
    const a = [{ src: 'a.mp3', requestHeaders: { Authorization: 'Bearer 1', 'X-Trace': 't' } }];
    const bDifferent = [{ src: 'a.mp3', requestHeaders: { Authorization: 'Bearer 2', 'X-Trace': 't' } }];
    const bReordered = [{ src: 'a.mp3', requestHeaders: { 'X-Trace': 't', Authorization: 'Bearer 1' } }];
    expect(mediaSourcesEqual(a, bDifferent)).toBe(false);
    expect(mediaSourcesEqual(a, bReordered)).toBe(true);
  });
});

describe('extractMediaFileName', () => {
  it('prefers an explicit title', () => {
    expect(extractMediaFileName({ src: 'https://x.com/a.mp3', title: 'My Track' })).toBe('My Track');
  });

  it('derives a name from the last URL segment, stripping query and hash', () => {
    expect(extractMediaFileName({ src: 'https://x.com/dir/song.mp3?x=1#t=10' })).toBe('song.mp3');
  });

  it('never throws on a malformed percent-encoded URL — falls back to the raw segment', () => {
    expect(() => extractMediaFileName({ src: 'https://x.com/song%zz.mp3' })).not.toThrow();
    expect(extractMediaFileName({ src: 'https://x.com/song%zz.mp3' })).toBe('song%zz.mp3');
  });

  it('falls back to a File object\'s name', () => {
    const file = new File(['x'], 'my-file.mp3');
    expect(extractMediaFileName({ src: file })).toBe('my-file.mp3');
  });

  it('falls back to "no name" for a Blob/MediaStream with nothing else to go on', () => {
    expect(extractMediaFileName({ src: new Blob(['x']) })).toBe('no name');
  });
});

