import { TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DIALOG_DATA, DIALOG_REF } from '../tokens/dialog.tokens';
import { NgxDialogRef } from '../configs/dialog-ref';
import { NgxDialogService } from '../services/ngx-dialog.service';
import {
  installPopoverPolyfillIfMissing,
  installResizeObserverPolyfillIfMissing,
} from './test-utils';

interface GreetingData {
  name: string;
}

@Component({
  standalone: true,
  selector: 'test-greeting',
  template: `
    <span class="greeting">Hello {{ data.name }}</span>
    <button type="button" class="save-btn" (click)="save()">Save</button>
  `,
})
class GreetingContentComponent {
  protected readonly data = inject<GreetingData>(DIALOG_DATA);
  private readonly dialogRef = inject<NgxDialogRef<string>>(DIALOG_REF);

  save(): void {
    this.dialogRef.close(`saved:${this.data.name}`);
  }
}

describe('NgxDialogService', () => {
  let service: NgxDialogService;

  beforeEach(() => {
    installPopoverPolyfillIfMissing();
    installResizeObserverPolyfillIfMissing();
    if (!document.body) {
      document.body = document.createElement('body');
    }

    TestBed.configureTestingModule({ providers: [NgxDialogService] });
    service = TestBed.inject(NgxDialogService);
  });

  afterEach(() => {
    service.closeAll();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('opens a dialog and injects data into the content component', async () => {
    service.open(GreetingContentComponent, { data: { name: 'Sara' } as GreetingData });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const greeting = document.querySelector('.greeting');
    expect(greeting?.textContent).toContain('Hello Sara');
  });

  it('emits the result on afterClosed when the content component closes itself', async () => {
    const ref = service.open<string, GreetingData>(GreetingContentComponent, {
      data: { name: 'Sara' },
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const resultPromise = firstValueFrom(ref.afterClosed);
    (document.querySelector('.save-btn') as HTMLButtonElement).click();

    await expect(resultPromise).resolves.toBe('saved:Sara');
    expect(ref.closed()).toBe(true);
  });

  it('tracks open dialogs and removes them from the registry once closed', () => {
    const ref1 = service.open(GreetingContentComponent, { data: { name: 'A' } });
    const ref2 = service.open(GreetingContentComponent, { data: { name: 'B' } });

    expect(service.openCount()).toBe(2);

    ref1.close();

    expect(service.openCount()).toBe(1);
    expect(service.openDialogs()).toEqual([ref2]);

    ref2.close();
    expect(service.openCount()).toBe(0);
  });

  it('does not close on outside click by default (modal by default)', async () => {
    service.open(GreetingContentComponent, { data: { name: 'Sara' } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.body.click();

    expect(document.querySelector('.greeting')).toBeTruthy();
  });

  it('closes on outside click when explicitly enabled', () => {
    service.open(GreetingContentComponent, {
      data: { name: 'Sara' },
      closeOnOutsideClick: true,
    });
    document.body.click();

    expect(document.querySelector('.greeting')).toBeFalsy();
  });

  it('disableClose blocks both Escape and outside click', async () => {
    service.open(GreetingContentComponent, {
      data: { name: 'Sara' },
      disableClose: true,
      closeOnOutsideClick: true, // should still be overridden to false
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.body.click();

    expect(document.querySelector('.greeting')).toBeTruthy();
  });

  it('respects the beforeClose guard on Escape', async () => {
    let canClose = false;
    service.open(GreetingContentComponent, {
      data: { name: 'Sara' },
      beforeClose: () => canClose,
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.greeting')).toBeTruthy();

    canClose = true;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.greeting')).toBeFalsy();
  });

  it('locks body scroll by default and unlocks on close', () => {
    const ref = service.open(GreetingContentComponent, { data: { name: 'Sara' } });
    expect(document.body.style.overflow).toBe('hidden');

    ref.close();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('does not lock body scroll when lockBodyScroll is false', () => {
    service.open(GreetingContentComponent, { data: { name: 'Sara' }, lockBodyScroll: false });
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('close() is idempotent', () => {
    const ref = service.open(GreetingContentComponent, { data: { name: 'Sara' } });
    expect(() => {
      ref.close('first');
      ref.close('second');
    }).not.toThrow();
  });
});
