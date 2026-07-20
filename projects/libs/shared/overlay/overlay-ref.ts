import { ComponentRef, TemplateRef } from '@angular/core';

export class OverlayRef<T> {
  constructor(
    private readonly dialogEl: HTMLDialogElement,
    private readonly teardownFn: () => void,
    public readonly componentRef?: ComponentRef<T>,
    public readonly templateRef?: TemplateRef<T>,
  ) {}

  close(): void {
    this.teardownFn();
  }

  get nativeElement(): HTMLElement {
    return this.dialogEl;
  }
}
