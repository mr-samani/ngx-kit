import { describe, expect, it, vi } from 'vitest';
import { NgxWasmDecoderBase } from '../decoders/wasm-decoder.base';
import { NgxMediaSource } from '../contracts/media-source';
import { NgxMediaEngine } from '../engines/media-engine.interface';
import { NgxMediaError } from '../contracts/media-error';

class TestDecoder extends NgxWasmDecoderBase {
  readonly id = 'test';
  readonly formats = ['test'];

  moduleLoadCount = 0;
  resolveModule!: (mod: unknown) => void;
  private pendingModule: Promise<unknown> | null = null;

  protected loadModule(): Promise<unknown> {
    this.moduleLoadCount++;
    this.pendingModule = new Promise((resolve) => {
      this.resolveModule = resolve;
    });
    return this.pendingModule;
  }

  canDecode(): boolean {
    return true;
  }

  buildEngineFn: (module: unknown) => Promise<NgxMediaEngine> = async () => ({}) as NgxMediaEngine;

  protected async buildEngine(_source: NgxMediaSource, module: unknown): Promise<NgxMediaEngine> {
    return this.buildEngineFn(module);
  }
}

const SOURCE: NgxMediaSource = { src: 'clip.test' };

describe('NgxWasmDecoderBase — module lifecycle', () => {
  it('loads the module only once and shares the same promise across concurrent createEngine() calls', async () => {
    const decoder = new TestDecoder();
    const p1 = decoder.createEngine(SOURCE);
    const p2 = decoder.createEngine(SOURCE);
    decoder.resolveModule({});
    await Promise.all([p1, p2]);
    expect(decoder.moduleLoadCount).toBe(1);
  });

  it('destroy() while loadModule() is still pending prevents the eventual resolution from producing an engine', async () => {
    const decoder = new TestDecoder();
    const pending = decoder.createEngine(SOURCE);
    decoder.destroy(); // generation bumped before the module ever resolves
    decoder.resolveModule({}); // late resolution
    await expect(pending).rejects.toThrow(/destroyed/i);
  });

  it('destroy() then a fresh createEngine() call starts a NEW module load, not a stale shared one', async () => {
    const decoder = new TestDecoder();
    const first = decoder.createEngine(SOURCE);
    decoder.destroy();
    decoder.resolveModule({}); // resolves the now-abandoned first load
    await expect(first).rejects.toThrow();

    const second = decoder.createEngine(SOURCE);
    expect(decoder.moduleLoadCount).toBe(2);
    decoder.resolveModule({});
    await expect(second).resolves.toBeDefined();
  });

  it('preserves the original NgxMediaError category instead of relabeling everything as DECODER', async () => {
    const decoder = new TestDecoder();
    decoder.buildEngineFn = async () => {
      throw new NgxMediaError('NETWORK', 'could not fetch the source to transcode');
    };
    const p = decoder.createEngine(SOURCE);
    decoder.resolveModule({});
    await expect(p).rejects.toMatchObject({ category: 'NETWORK' });
  });

  it('wraps a genuinely unknown failure as DECODER', async () => {
    const decoder = new TestDecoder();
    decoder.buildEngineFn = async () => {
      throw new Error('unexpected internal failure');
    };
    const p = decoder.createEngine(SOURCE);
    decoder.resolveModule({});
    await expect(p).rejects.toMatchObject({ category: 'DECODER' });
  });
});
