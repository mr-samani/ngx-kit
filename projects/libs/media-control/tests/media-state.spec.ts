import { describe, expect, it } from 'vitest';
import { canTransition, initialMediaState } from '../contracts/media-state';

describe('media state machine', () => {
  it('starts idle', () => {
    expect(initialMediaState().playback).toBe('idle');
  });

  it('allows idle -> loading -> ready -> playing -> paused', () => {
    expect(canTransition('idle', 'loading')).toBe(true);
    expect(canTransition('loading', 'ready')).toBe(true);
    expect(canTransition('ready', 'playing')).toBe(true);
    expect(canTransition('playing', 'paused')).toBe(true);
  });

  it('never allows leaving destroyed', () => {
    expect(canTransition('destroyed', 'playing')).toBe(false);
    expect(canTransition('destroyed', 'idle')).toBe(false);
  });

  it('rejects playing directly from idle (must load first)', () => {
    expect(canTransition('idle', 'playing')).toBe(false);
  });

  it('allows recovering from error back to loading', () => {
    expect(canTransition('error', 'loading')).toBe(true);
  });

  it('is reflexive (same state is always a legal no-op transition)', () => {
    expect(canTransition('playing', 'playing')).toBe(true);
  });
});
