import { getAudioContextCtor } from '../utils/capabilities';
import { NgxMediaError } from '../contracts/media-error';

/**
 * Optional processing graph: `<audio>/<video>` → MediaElementAudioSourceNode
 * → gain → (optional analyser) → destination.
 *
 * Never constructed unless a consumer asks for gain/analyser/effects — plain
 * playback never creates an `AudioContext`, respecting autoplay policy and
 * avoiding the "one AudioContext per instance whether needed or not" issue
 * in the original component.
 *
 * Autoplay note: this class never calls `resume()` on its own outside a
 * user-triggered `play()`/`connect()` call — bypassing the suspended-state
 * policy is explicitly out of scope.
 */
export class NgxWebAudioGraph {
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  constructor(private readonly element: HTMLMediaElement) {}

  /** Idempotent — safe to call multiple times; only the first call does any work. */
  ensureConnected(): { context: AudioContext; gain: GainNode } {
    if (this.ctx && this.gainNode) return { context: this.ctx, gain: this.gainNode };

    const Ctor = getAudioContextCtor();
    if (!Ctor) throw NgxMediaError.unsupported('Web Audio API is not available in this browser.');

    this.ctx = new Ctor();
    this.sourceNode = this.ctx.createMediaElementSource(this.element);
    this.gainNode = this.ctx.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    return { context: this.ctx, gain: this.gainNode };
  }

  setGain(value: number): void {
    if (this.gainNode) this.gainNode.gain.value = value;
  }

  getAnalyser(fftSize = 2048): AnalyserNode {
    if (!this.ctx || !this.gainNode) this.ensureConnected();
    if (!this.analyserNode) {
      this.analyserNode = this.ctx!.createAnalyser();
      this.analyserNode.fftSize = fftSize;
      this.gainNode!.connect(this.analyserNode);
    }
    return this.analyserNode;
  }

  async resumeOnUserGesture(): Promise<void> {
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
  }

  destroy(): void {
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.analyserNode?.disconnect();
    // Do not call ctx.close() synchronously in destroy paths that might race a
    // pending resume(); schedule it and swallow errors from an already-closed context.
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.analyserNode = null;
  }
}
