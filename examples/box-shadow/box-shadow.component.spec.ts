/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoxShadowComponent } from './box-shadow.component';
import { FormsModule } from '@angular/forms';
import { NgxShadowBox } from 'ngx-kit/box-shadow';
import { ExampleShowcaseComponent } from '@demo/shared/showcase/example-showcase.component';

describe('BoxShadowComponent', () => {
  let component: BoxShadowComponent;
  let fixture: ComponentFixture<BoxShadowComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BoxShadowComponent,ExampleShowcaseComponent, FormsModule, NgxShadowBox],
    }).compileComponents();
    fixture = TestBed.createComponent(BoxShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
