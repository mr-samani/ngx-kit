/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NgxSideNav } from './side-nav';

describe('NgxSideNav', () => {
  let component: NgxSideNav;
  let fixture: ComponentFixture<NgxSideNav>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NgxSideNav],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSideNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
