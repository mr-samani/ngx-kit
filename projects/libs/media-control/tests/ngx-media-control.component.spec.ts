import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxMediaControl } from '../components/ngx-media-control';
import { NgxAudioControl } from '../components/ngx-audio-control';

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

describe('NgxAudioControl (legacy wrapper)', () => {
  it('still creates from the old selector/inputs and delegates to NgxMediaControl', () => {
    TestBed.configureTestingModule({ imports: [NgxAudioControl] });
    const fixture = TestBed.createComponent(NgxAudioControl);
    fixture.componentRef.setInput('fileList', ['a.mp3', 'b.mp3']);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    const inner = (fixture.nativeElement as HTMLElement).querySelector('ngx-media-control');
    expect(inner).toBeTruthy();
  });
});
