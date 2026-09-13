/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DropListComponent } from './drop-list.component';
import { NgxDraggable, NgxDropList } from 'ngx-kit/drag-resize';
import { provideRouter } from '@angular/router';

describe('DropListComponent', () => {
  let component: DropListComponent;
  let fixture: ComponentFixture<DropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropListComponent, NgxDropList, NgxDraggable],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
