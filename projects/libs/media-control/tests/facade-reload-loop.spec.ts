import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxMediaFacade } from '../facade/ngx-media-facade';
import { NgxMediaEngineFactory } from '../engines/media-engine-factory';

describe('NgxMediaFacade.setPlaylist — reload-loop regression', () => {
  it('does not reload media when a content-equal (but reference-different) playlist is set again', () => {
    const createSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [NgxMediaFacade, { provide: NgxMediaEngineFactory, useValue: { create: createSpy } }],
    });
    const facade = TestBed.inject(NgxMediaFacade);
    const loadSpy = vi.spyOn(facade, 'loadCurrent');

    const tick1 = [{ src: 'song.mp3', title: 'Song' }];
    const tick2 = [{ src: 'song.mp3', title: 'Song' }]; // new array reference, identical content —
    // exactly what a re-running Angular effect produces when a parent
    // rebinds an equivalent `sources` array every change-detection tick.

    facade.setPlaylist(tick1, 0, true);
    facade.setPlaylist(tick2, 0, true);
    facade.setPlaylist(tick2, 0, true);

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });

  it('does reload when the content genuinely changes', () => {
    const createSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [NgxMediaFacade, { provide: NgxMediaEngineFactory, useValue: { create: createSpy } }],
    });
    const facade = TestBed.inject(NgxMediaFacade);
    const loadSpy = vi.spyOn(facade, 'loadCurrent');

    facade.setPlaylist([{ src: 'a.mp3' }], 0, true);
    facade.setPlaylist([{ src: 'b.mp3' }], 0, true);

    expect(loadSpy).toHaveBeenCalledTimes(2);
  });
});
