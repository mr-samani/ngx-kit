import {
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  type AfterContentInit,
} from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { DragDropService } from '../services/drag-drop.service';
import { IDropEvent } from '../contracts/IDropEvent';
import { NGX_PLACEHOLDER, NgxPlaceholder } from './ngx-place-holder.directive';

export const NGX_DROPLIST = new InjectionToken<NgxDropList>('ngx-drop-list');

@Directive({
  selector: '[NgxDropList],[ngxDropList]',
  providers: [{ provide: NGX_DROPLIST, useExisting: NgxDropList }],
  host: { class: 'ngx-drop-list' },
})
export class NgxDropList<T = any> implements OnInit, OnDestroy, AfterContentInit {
  readonly _ref = new DropListRef<T>();
  @Input('data') set data(value: T) {
    this._ref.data = value;
  }
  @Input() set connectedTo(value: HTMLElement[] | null | undefined) {
    this._ref.connectedTo = value ?? [];
  }
  @Input() set disableSort(value: boolean) {
    this._ref.disableSort = value === true;
  }
  @Output() readonly drop = new EventEmitter<IDropEvent<T>>();
  @ContentChild(NgxPlaceholder, {
    descendants: true,
  })
  private readonly customPlaceholder?: NgxPlaceholder;
  private sub?: { unsubscribe(): void };
  private readonly service = inject(DragDropService);

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this._ref.el = this.el.nativeElement;

    // Found by walking the real DOM (not Angular's element-injector tree): a list rendered by a
    // recursively-invoked `ngTemplateOutlet` (a tree/outliner UI, where every level re-uses the
    // SAME `<ng-template>`) gets a fresh injector context per invocation, so `inject(TOKEN,
    // {skipSelf})` can never see a provider from another recursion level — the DOM position is
    // what actually determines nesting/grouping for this library's purposes anyway.
    const parentEl = this.el.nativeElement.parentElement;
    const group = this.service.findAncestorGroup(parentEl);
    const parent = this.service.findAncestorDropList(parentEl);

    this._ref.dropListGroup = group ?? null;
    group?.add(this._ref);
    parent?._registerChild(this._ref);
    this.sub = this._ref.onDrop.subscribe((e) => this.drop.emit(e));
    this.service.registerDropList(this._ref);
  }
  ngAfterContentInit(): void {
    if (this.customPlaceholder) {
      this._ref.customPlaceholder = this.customPlaceholder._ref;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this._ref._release();
    this._ref.parentList?._unregisterChild(this._ref);
    this._ref.dropListGroup?.remove(this._ref);
    this.service.removeDropList(this._ref);
  }
}
