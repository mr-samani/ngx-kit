/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemoAudioControlComponent } from './audio-control.component';
import { ExampleShowcaseComponent } from '@demo/shared/showcase/example-showcase.component';

describe('DemoAudioControlComponent', () => {
  let component: DemoAudioControlComponent;
  let fixture: ComponentFixture<DemoAudioControlComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ DemoAudioControlComponent,ExampleShowcaseComponent ]
    })
    .compileComponents(); 
    fixture = TestBed.createComponent(DemoAudioControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
