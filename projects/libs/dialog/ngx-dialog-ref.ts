import { signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OverlayRef } from 'ngx-kit/core';

let uniqueId = 0;
function nextDialogId(): string {
  uniqueId += 1;
  return `ngx-dialog-${Date.now().toString(36)}-${uniqueId}`;
}

export class NgxDialogRef<R = any> {
  readonly id = nextDialogId();

  /** true from the moment `close()` is called, even before teardown finishes. */
  readonly closing = signal(false);
  /** true once the dialog has been fully removed from the DOM. */
  readonly closed = signal(false);

  private readonly _afterClosed = new Subject<R | undefined>();
  /** Emits the result exactly once, after the dialog has been fully torn down. */
  readonly afterClosed: Observable<R | undefined> = this._afterClosed.asObservable();

  /** @internal set by the layout directives; read by NgxDialogBodyDirective to size itself. */
  readonly headerEl = signal<HTMLElement | null>(null);
  /** @internal */
  readonly footerEl = signal<HTMLElement | null>(null);
  /** @internal */
  readonly bodyEl = signal<HTMLElement | null>(null);
  /** @internal the dialog panel's own host element. */
  readonly panelEl = signal<HTMLElement | null>(null);

  /** Optional synchronous guard - return `false` to prevent Escape/outside-click from closing. */
  beforeClose?: () => boolean;

  private overlayRef?: OverlayRef<unknown>;
  private result: R | undefined;

  /** @internal used by NgxDialogService right after creating the overlay. */
  _attachOverlayRef(ref: OverlayRef<unknown>): void {
    this.overlayRef = ref;
  }

  /** @internal used by the header/footer/body directives and the panel component. */
  _setHeaderElement(el: HTMLElement | null): void {
    this.headerEl.set(el);
  }
  /** @internal */
  _setFooterElement(el: HTMLElement | null): void {
    this.footerEl.set(el);
  }
  /** @internal */
  _setBodyElement(el: HTMLElement | null): void {
    this.bodyEl.set(el);
  }
  /** @internal */
  _setPanelElement(el: HTMLElement | null): void {
    this.panelEl.set(el);
  }

  /** Closes the dialog and emits `result` on `afterClosed` once torn down. Idempotent. */
  close(result?: R): void {
    if (this.closing() || this.closed()) {
      return;
    }
    this.closing.set(true);
    this.result = result;
    this.overlayRef?.close();
  }

  /** @internal called by NgxDialogService's `onClosed` callback once the overlay is fully torn down. */
  _finalizeClose(): void {
    if (this.closed()) {
      return;
    }
    this.closed.set(true);
    this._afterClosed.next(this.result);
    this._afterClosed.complete();
  }
}
