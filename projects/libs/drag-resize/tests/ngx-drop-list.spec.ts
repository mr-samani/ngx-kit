import { ElementRef, DOCUMENT, inject } from '@angular/core';
import { NgxDropList } from './ngx-drop-list.directive';

describe('NgxDropList', () => {
  let el: ElementRef<HTMLDivElement>;
  beforeEach(() => {
    let doc = inject<Document>(DOCUMENT);
    el = new ElementRef<HTMLDivElement>(doc.createElement('div'));
  });

  it('should create an instance', () => {
    const directive = new NgxDropList(el);
    expect(directive).toBeTruthy();
  });
});
