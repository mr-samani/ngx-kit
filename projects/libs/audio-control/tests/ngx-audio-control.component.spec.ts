import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAudioControl } from '../componenets/ngx-audio-control';

describe('NgxAudioControl', () => {
  let component: NgxAudioControl;
  let fixture: ComponentFixture<NgxAudioControl>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxAudioControl]
    });
    fixture = TestBed.createComponent(NgxAudioControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
