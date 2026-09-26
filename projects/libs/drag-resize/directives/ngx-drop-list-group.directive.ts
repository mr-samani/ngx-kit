import { Directive, ElementRef, InjectionToken, OnDestroy, OnInit, inject } from '@angular/core';
import { DropListGroupRef } from '../drop-list-group-ref';
import { DragDropService } from '../services/drag-drop.service';

export const NGX_DROPLIST_GROUP = new InjectionToken<NgxDropListGroup>('ngx-drop-list-group');

/** Wrap several `ngxDropList`s to let items move freely between them. */
@Directive({
  selector: '[NgxDropListGroup],[ngxDropListGroup]',
  providers: [{ provide: NGX_DROPLIST_GROUP, useExisting: NgxDropListGroup }],
})
export class NgxDropListGroup implements OnInit, OnDestroy {
  readonly _ref = new DropListGroupRef();
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly service = inject(DragDropService);

  ngOnInit(): void {
    // Registered by DOM element (not just provided via DI) so a list nested inside a recursive
    // `ngTemplateOutlet` tree can still find this group by walking its real ancestors — see the
    // comment on `DragDropService`'s registries for why DI alone can't do this.
    this.service.registerGroup(this.el.nativeElement, this._ref);
  }

  ngOnDestroy(): void {
    this._ref.lists.clear();
    this.service.removeGroup(this.el.nativeElement);
  }
}
