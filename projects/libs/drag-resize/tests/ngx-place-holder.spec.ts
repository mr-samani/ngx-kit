import { TemplateRef } from '@angular/core';
import { NgxPlaceholder } from './ngx-place-holder.directive';

describe('NgxPlaceholderDirective', () => {
  let tpl: TemplateRef<any>;
  beforeEach(() => {
    tpl = new TemplateRef();
  });

  it('should create an instance', () => {
    const directive = new NgxPlaceholder(tpl);
    expect(directive).toBeTruthy();
  });
});
