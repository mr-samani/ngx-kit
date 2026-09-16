import { describe, expect, it, vi } from 'vitest';
import { NgxMediaDecoderRegistry } from '../decoders/decoder-registry';
import { NgxMediaDecoder } from '../decoders/decoder.interface';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine } from '../engines/media-engine.interface';

function makeDecoder(id: string, opts: Partial<NgxMediaDecoder> = {}): NgxMediaDecoder {
  return {
    id,
    formats: [],
    priority: 0,
    canDecode: () => false,
    createEngine: vi.fn(async () => ({}) as NgxMediaEngine),
    destroy: vi.fn(),
    ...opts,
  };
}

const source: NgxMediaSource = { src: 'clip.3gp', type: 'video/3gpp' };

describe('NgxMediaDecoderRegistry', () => {
  it('returns undefined when no decoder is registered', async () => {
    const registry = new NgxMediaDecoderRegistry(null);
    await expect(registry.findDecoder(source)).resolves.toBeUndefined();
  });

  it('picks the only decoder that can decode the source', async () => {
    const flac = makeDecoder('flac', { canDecode: () => false });
    const threeGp = makeDecoder('3gp', { canDecode: (s) => s.type === 'video/3gpp' });
    const registry = new NgxMediaDecoderRegistry([flac, threeGp]);
    const found = await registry.findDecoder(source);
    expect(found?.id).toBe('3gp');
  });

  it('respects priority when multiple decoders can decode the same source', async () => {
    const low = makeDecoder('low-priority', { canDecode: () => true, priority: 1 });
    const high = makeDecoder('high-priority', { canDecode: () => true, priority: 10 });
    const registry = new NgxMediaDecoderRegistry([low, high]);
    const found = await registry.findDecoder(source);
    expect(found?.id).toBe('high-priority');
  });

  it('skips a decoder whose canDecode throws and still finds a working one', async () => {
    const broken = makeDecoder('broken', {
      canDecode: () => {
        throw new Error('boom');
      },
    });
    const working = makeDecoder('working', { canDecode: () => true });
    const registry = new NgxMediaDecoderRegistry([broken, working]);
    await expect(registry.findDecoder(source)).resolves.toMatchObject({ id: 'working' });
  });

  it('a consumer-supplied custom decoder (e.g. 3GP) is discovered automatically', async () => {
    class My3gpDecoder implements NgxMediaDecoder {
      readonly id = '3gp';
      readonly formats = ['3gp'];
      canDecode(s: NgxMediaSource) {
        return s.type === 'video/3gpp';
      }
      async createEngine(): Promise<NgxMediaEngine> {
        return {} as NgxMediaEngine;
      }
      destroy() {}
    }
    const registry = new NgxMediaDecoderRegistry([new My3gpDecoder()]);
    const found = await registry.findDecoder(source);
    expect(found).toBeInstanceOf(My3gpDecoder);
  });

  it('createEngine throws NgxMediaError when nothing can decode the source', async () => {
    const registry = new NgxMediaDecoderRegistry([makeDecoder('never', { canDecode: () => false })]);
    await expect(registry.createEngine(source)).rejects.toThrow(/No native support/);
  });
});
