import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DropListRef } from '../drop-list-ref';
import { NGX_DROPLIST_GROUP } from './ngx-drop-list-group.directive';
import { DragDropService } from '../services/drag-drop.service';
import { IDropEvent } from '../contracts/IDropEvent';

export const NGX_DROPLIST = new InjectionToken<NgxDropList>('ngx-drop-list');

@Directive({
  selector: '[NgxDropList]',
  providers: [{ provide: NGX_DROPLIST, useExisting: NgxDropList }],
})
export class NgxDropList<T = any> implements OnInit, OnDestroy {
  _ref = new DropListRef();

  @Input('data') set setData(val: T) {
    this._ref.data = val;
  }
  @Input('connectedTo') set connections(list: HTMLElement[]) {
    this._ref.connectedTo = Array.isArray(list) ? list : [];
  }
  @Input('disableSort') set setDisableSort(val: boolean) {
    this._ref.disableSort = val === true;
  }

  @Output() drop = new EventEmitter<IDropEvent>();

  private dropListGroup = inject(NGX_DROPLIST_GROUP, { skipSelf: true, optional: true });
  private dragDropService = inject(DragDropService);

  constructor(elRef: ElementRef) {
    this._ref.el = elRef.nativeElement;
    this._ref.dropListGroup = this.dropListGroup;
    this._ref.onDrop = this.drop;
  }

  ngOnInit(): void {
    this.dragDropService.registerDropList(this._ref);
  }
  ngOnDestroy(): void {
    this.dragDropService.removeDropList(this._ref);
  }
}
