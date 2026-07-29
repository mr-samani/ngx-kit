import { Directive, inject, input, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[ngxTableCell]',
})
export class TableCellDirective {
  readonly column = input.required<string>({
    alias: 'ngxTableCell',
  });

  readonly template = inject(TemplateRef);
}
