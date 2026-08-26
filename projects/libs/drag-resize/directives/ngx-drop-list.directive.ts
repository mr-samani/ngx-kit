import {
  Directive,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { DragDropService } from '../services/drag-drop.service';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
import { IDropEvent } from '../contracts/IDropEvent';
export const NGX_DROPLIST = new InjectionToken<NgxDropList>('ngx-drop-list');
@Directive({
  selector: '[NgxDropList],[ngxDropList]',
  providers: [{ provide: NGX_DROPLIST, useExisting: NgxDropList }],
})
export class NgxDropList<T = any> implements OnInit, OnDestroy {
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
  private readonly service = inject(DragDropService);
  private readonly group = inject(NGX_DROPLIST_GROUP, { optional: true, skipSelf: true });
  constructor(private readonly el: ElementRef<HTMLElement>) {}
  ngOnInit(): void {
    this._ref.el = this.el.nativeElement;
    this._ref.dropListGroup = this.group?._ref;
    this._ref.onDrop.subscribe((e) => this.drop.emit(e));
    this.service.registerDropList(this._ref);
  }
  ngOnDestroy(): void {
    this.service.removeDropList(this._ref);
  }
}
