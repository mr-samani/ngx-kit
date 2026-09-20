import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxMediaControl } from '../components/ngx-media-control';

describe('NgxMediaControl', () => {
  let fixture: ComponentFixture<NgxMediaControl>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NgxMediaControl] });
    fixture = TestBed.createComponent(NgxMediaControl);
    fixture.componentRef.setInput('fileList', []);
    fixture.detectChanges();
  });

  it('creates with an empty playlist and no crash', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults to audio type', () => {
    expect(fixture.componentInstance.type()).toBe('audio');
  });

  it('shows the empty-playlist message when the panel is toggled with no sources', () => {
    fixture.componentInstance.togglePlaylistPanel();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No any record');
  });
});

describe('NgxMediaControl — malformed source URLs never crash filename extraction', () => {
  it('tolerates a malformed percent-encoded URL instead of throwing', () => {
    TestBed.configureTestingModule({ imports: [NgxMediaControl] });
    const fixture = TestBed.createComponent(NgxMediaControl);
    fixture.componentRef.setInput('sources', [{ src: 'https://example.com/song%zz.mp3' }]);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

describe('NgxMediaControl — seek slider preview does not jitter against live playback', () => {
  it('while isSeeking is true, displaySeekTime tracks the local preview, not state().currentTime', () => {
    TestBed.configureTestingModule({ imports: [NgxMediaControl] });
    const fixture = TestBed.createComponent(NgxMediaControl);
    fixture.componentRef.setInput('fileList', []);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.onSeekInput({ target: { value: '42' } } as unknown as Event);
    expect(component.isSeeking()).toBe(true);
    expect(component.displaySeekTime()).toBe(42);

    component.onSeekCommit({ target: { value: '42' } } as unknown as Event);
    expect(component.isSeeking()).toBe(false);
  });
});

