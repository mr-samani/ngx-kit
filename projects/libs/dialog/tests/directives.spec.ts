import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DIALOG_REF } from '../tokens/dialog.tokens';
import { NgxDialogBody } from '../directives/body.directive';
import { NgxDialogFooter } from '../directives/footer.directive';
import { NgxDialogHeader } from '../directives/header.directive';
import { NgxDialogRef } from '../configs/dialog-ref';
import { installResizeObserverPolyfillIfMissing } from './test-utils';

describe('NgxDialogHeaderDirective', () => {
  let dialogRef: NgxDialogRef;
  let clicks = 0;

  @Component({
    standalone: true,
    imports: [NgxDialogHeader],
    providers: [{ provide: DIALOG_REF, useFactory: () => dialogRef }],
    template: `
      <div ngxDialogHeader>
        <button class="inner-btn" (click)="onInnerClick()">custom title content</button>
      </div>
    `,
  })
  class HostComponent {
    onInnerClick(): void {
      clicks++;
    }
  }

  beforeEach(() => {
    dialogRef = new NgxDialogRef();
    clicks = 0;
    TestBed.configureTestingModule({ imports: [HostComponent] });
  });

  it('preserves Angular-bound content instead of destroying it via innerHTML re-parsing', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const innerBtn = fixture.nativeElement.querySelector('.inner-btn') as HTMLButtonElement;
    expect(innerBtn).toBeTruthy();
    innerBtn.click();

    // If the header directive had rebuilt the DOM via innerHTML (like the
    // original implementation did), Angular's click listener on this button
    // would have been silently destroyed and this would still be 0.
    expect(clicks).toBe(1);
  });

  it('wraps the original content in a .dialog-header-title span', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.dialog-header-title');
    expect(title).toBeTruthy();
    expect(title.querySelector('.inner-btn')).toBeTruthy();
  });

  it('adds a close button that calls dialogRef.close() exactly once per click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.close-btn') as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    expect(closeBtn.type).toBe('button');

    closeBtn.click();
    expect(dialogRef.closing()).toBe(true);
  });

  it('registers itself on the dialog ref', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(dialogRef.headerEl()).toBe(fixture.nativeElement.querySelector('.dialog-header'));
  });
});

describe('NgxDialogFooterDirective', () => {
  let dialogRef: NgxDialogRef;

  @Component({
    standalone: true,
    imports: [NgxDialogFooter],
    providers: [{ provide: DIALOG_REF, useFactory: () => dialogRef }],
    template: `
      <div ngxDialogFooter align="center">footer content</div>
    `,
  })
  class HostComponent {}

  beforeEach(() => {
    dialogRef = new NgxDialogRef();
    TestBed.configureTestingModule({ imports: [HostComponent] });
  });

  it('applies the alignment class from the input', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.dialog-footer');
    expect(footer.classList.contains('align-center')).toBe(true);
  });

  it('registers and unregisters itself on the dialog ref', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(dialogRef.footerEl()).toBeTruthy();

    fixture.destroy();
    expect(dialogRef.footerEl()).toBeNull();
  });
});

describe('NgxDialogBodyDirective', () => {
  let dialogRef: NgxDialogRef;

  @Component({
    standalone: true,
    imports: [NgxDialogBody],
    providers: [{ provide: DIALOG_REF, useFactory: () => dialogRef }],
    template: `
      <div ngxDialogBody>scrollable content</div>
    `,
  })
  class HostComponent {}

  beforeEach(() => {
    installResizeObserverPolyfillIfMissing();
    dialogRef = new NgxDialogRef();
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('registers itself on the dialog ref', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(dialogRef.bodyEl()).toBe(fixture.nativeElement.querySelector('.dialog-body'));
  });

  it('sets a max-height once a panel element is available', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const panel = document.createElement('div');
    Object.defineProperty(panel, 'clientHeight', { value: 400, configurable: true });
    dialogRef._setPanelElement(panel);

    await fixture.whenStable();

    const body = fixture.nativeElement.querySelector('.dialog-body') as HTMLElement;
    expect(body.style.maxHeight).toBe('400px');
  });
});
