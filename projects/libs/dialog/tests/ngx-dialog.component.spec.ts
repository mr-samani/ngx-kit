import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DIALOG_CONFIG, DIALOG_CONTENT, DIALOG_REF } from '../tokens/dialog.tokens';
import { NgxDialogConfig } from '../configs/dialog-config';
import { NgxDialogComponent } from '../components/ngx-dialog.component';
import { NgxDialogRef } from '../configs/dialog-ref';

@Component({
  standalone: true,
  selector: 'test-content',
  template: `
    <p class="content-marker">content</p>
  `,
})
class TestContentComponent {}

describe('NgxDialogComponent', () => {
  function createPanel(config: Partial<NgxDialogConfig>) {
    const dialogRef = new NgxDialogRef();
    TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_REF, useValue: dialogRef },
        { provide: DIALOG_CONFIG, useValue: new NgxDialogConfig(config) },
        { provide: DIALOG_CONTENT, useValue: TestContentComponent },
      ],
    });
    const fixture = TestBed.createComponent(NgxDialogComponent);
    fixture.detectChanges();
    return { fixture, dialogRef };
  }

  it('always renders the projected content component', () => {
    const { fixture } = createPanel({});
    expect(fixture.nativeElement.querySelector('.content-marker')).toBeTruthy();
  });

  it('does not render a header/footer by default', () => {
    const { fixture } = createPanel({});
    expect(fixture.nativeElement.querySelector('.dialog-header')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.dialog-footer')).toBeFalsy();
  });

  it('renders an auto header with the configured title when header.enable is true', () => {
    const { fixture } = createPanel({ header: { enable: true, title: 'My Dialog' } });
    const header = fixture.nativeElement.querySelector('.dialog-header');
    expect(header?.textContent).toContain('My Dialog');
  });

  it('renders an auto footer with a default close button when footer.enable is true', () => {
    const { fixture, dialogRef } = createPanel({ footer: { enable: true } });
    const closeBtn = fixture.nativeElement.querySelector(
      '.dialog-footer .ngx-dialog-default-close-btn',
    ) as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    closeBtn.click();
    expect(dialogRef.closing()).toBe(true);
  });

  it('sets a size class on the host based on config.size', () => {
    const { fixture } = createPanel({ size: 'lg' });
    expect(fixture.nativeElement.classList.contains('ngx-dialog-size-lg')).toBe(true);
  });

  it('registers its own host element as the panel element on the dialog ref', () => {
    const { fixture, dialogRef } = createPanel({});
    expect(dialogRef.panelEl()).toBe(fixture.nativeElement);
  });
});
