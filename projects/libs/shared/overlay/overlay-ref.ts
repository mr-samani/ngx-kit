import { ComponentRef, TemplateRef } from '@angular/core';

export class OverlayRef<T> {
  constructor(
    private readonly element: HTMLElement | null,
    private readonly closeFn: () => void,
    readonly componentRef?: ComponentRef<T>,
    readonly template?: TemplateRef<unknown>,
  ) {}

  close(): void {
    this.closeFn();
  }

  get nativeElement(): HTMLElement | null {
    return this.element;
  }

  static noop<T>(): OverlayRef<T> {
    return new OverlayRef<T>(null, () => {});
  }
}
