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
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
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
  private readonly group = inject(NGX_DROPLIST_GROUP, { optional: true, skipSelf: true });

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this._ref.el = this.el.nativeElement;
    this._ref.dropListGroup = this.group?._ref ?? null;
    // console.log('list:', this._ref.el, 'group:', this._ref.dropListGroup?.el);
    // Previously the group directive never actually tracked its lists — fixed here.
    this.group?._ref.add(this._ref);
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
    this.group?._ref.remove(this._ref);
    this.service.removeDropList(this._ref);
  }
}
