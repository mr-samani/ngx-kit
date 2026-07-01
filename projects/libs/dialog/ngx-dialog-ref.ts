import { ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class NgxDialogRef {
  dialog?: ElementRef<HTMLElement>;
  header?: ElementRef<HTMLElement>;
  footer?: ElementRef<HTMLElement>;
  body?: ElementRef<HTMLElement>;
  private readonly _afterClosed = new Subject<any>();

  afterClosed: Observable<any> = this._afterClosed.asObservable();

  id?: string;
  close(result?: any): void {
    this._afterClosed.next(result);
  }
}
