import { describe, expect, it, vi } from 'vitest';
import { canPlayNatively } from '../utils/capabilities';
import { NgxMediaSource } from '../contracts/media-source';

function fakeMediaElement(canPlayTypeImpl: (mime: string) => string): HTMLMediaElement {
  return { canPlayType: vi.fn(canPlayTypeImpl) } as unknown as HTMLMediaElement;
}

describe('canPlayNatively', () => {
  it('prefers explicit type/codecs over extension guessing', () => {
    const el = fakeMediaElement((mime) => (mime.includes('opus') ? 'probably' : ''));
    const source: NgxMediaSource = { src: 'track.mp3', type: 'audio/ogg', codecs: 'opus' };
    expect(canPlayNatively(el, source)).toBe('probably');
  });

  it('falls back to extension mapping when no type/codecs given', () => {
    const el = fakeMediaElement((mime) => (mime === 'audio/flac' ? 'maybe' : ''));
    const source: NgxMediaSource = { src: 'song.flac' };
    expect(canPlayNatively(el, source)).toBe('maybe');
  });

  it('does not assume .mp4 implies a single fixed codec', () => {
    const el = fakeMediaElement((mime) => (mime.includes('avc1') ? 'probably' : 'maybe'));
    const withCodec: NgxMediaSource = { src: 'clip.mp4', type: 'video/mp4', codecs: 'avc1.4d002a' };
    const withoutCodec: NgxMediaSource = { src: 'clip.mp4' };
    expect(canPlayNatively(el, withCodec)).toBe('probably');
    expect(canPlayNatively(el, withoutCodec)).toBe('maybe');
  });

  it('returns "maybe" (defer to native <source> failure) for a completely unknown extension', () => {
    const el = fakeMediaElement(() => '');
    const source: NgxMediaSource = { src: 'mystery.xyz' };
    expect(canPlayNatively(el, source)).toBe('maybe');
  });
});
