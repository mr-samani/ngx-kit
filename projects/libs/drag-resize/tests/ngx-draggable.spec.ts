import { NgxDraggable } from './ngx-draggable.directive';
import { DOCUMENT, ElementRef, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('NgxDraggable', () => {
  let el: ElementRef<HTMLDivElement>;
  beforeEach(() => {
    let doc = inject<Document>(DOCUMENT);
    el = new ElementRef<HTMLDivElement>(doc.createElement('div'));
  });
  it('should create an instance', () => {
    const directive = new NgxDraggable(el);
    expect(directive).toBeTruthy();
  });
});
