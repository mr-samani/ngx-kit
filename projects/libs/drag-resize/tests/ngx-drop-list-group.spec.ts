import { DOCUMENT, ElementRef, inject } from '@angular/core';
import { NgxDropListGroup } from './ngx-drop-list-group.directive';

describe('NgxDropListGroup', () => {
  let el: ElementRef<HTMLDivElement>;
  beforeEach(() => {
    let doc = inject<Document>(DOCUMENT);
    el = new ElementRef<HTMLDivElement>(doc.createElement('div'));
  });
  it('should create an instance', () => {
    const directive = new NgxDropListGroup(el);
    expect(directive).toBeTruthy();
  });
});
