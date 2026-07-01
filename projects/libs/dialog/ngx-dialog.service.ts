import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  Provider,
  runInInjectionContext,
  Type,
} from '@angular/core';
import { NgxDialogConfig } from './ngx-dialog-config';
import { NgxDialogRef } from './ngx-dialog-ref';
import { NgxDialogComponent } from './ngx-dialog.component';
import { DIALOG_DATA, DIALOG_REF } from './dialog.tokens';
import { randomStrnig } from 'ngx-kit/shared';

@Injectable()
export class NgxDialogService {
  dialogComponentRefs: ComponentRef<NgxDialogComponent>[] = [];
  _defaultOptions: NgxDialogConfig | undefined;
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector,
  ) {}

  public open(component: Type<any>, config?: NgxDialogConfig): NgxDialogRef {
    const dialogRef = this._open(component, config);
    return dialogRef;
  }

  private _open(component: Type<any>, config?: NgxDialogConfig): NgxDialogRef {
    config = { ...(this._defaultOptions || new NgxDialogConfig()), ...config };
    const map = new WeakMap();
    map.set(NgxDialogConfig, config);

    const dialogRef = new NgxDialogRef();
    dialogRef.id = this.getDialogId;
    map.set(NgxDialogRef, dialogRef);

    const sub = dialogRef.afterClosed.subscribe(() => {
      // close the dialog
      this.removeDialogComponentFromBody(dialogRef.id);
      sub.unsubscribe();
    });

    // ✅ ساخت Injector اختصاصی با DestroyRef
    const componentInjector = Injector.create({
      providers: [
        NgxDialogRef,
        { provide: DIALOG_DATA, useValue: config.data },
        { provide: DIALOG_REF, useValue: dialogRef, multi: false },
      ],
      parent: config?.injector ? config.injector : this.envInjector,
    });

    const componentRef: ComponentRef<NgxDialogComponent> = runInInjectionContext(
      componentInjector,
      () =>
        createComponent(NgxDialogComponent, {
          elementInjector: componentInjector,
          environmentInjector: this.envInjector,
        }),
    );

    this.appRef.attachView(componentRef.hostView);
    this.appendDialogComponentToBody(componentRef, config);
    componentRef.instance.config = config;
    componentRef.instance.component = component;
    //componentRef.instance._dialogRef = dialogRef;
    this.dialogComponentRefs.push(componentRef);
    return dialogRef;
  }

  private removeDialogComponentFromBody(id?: string): void {
    if (!id) {
      return;
    }
    const index = this.dialogComponentRefs.findIndex((x) => x.instance._dialogRef.id == id);
    if (index > -1 && this.dialogComponentRefs[index]) {
      this.appRef.detachView(this.dialogComponentRefs[index].hostView);
      this.dialogComponentRefs[index].destroy();
      this.dialogComponentRefs.splice(index, 1);
    }
  }

  private appendDialogComponentToBody(
    componentRef: ComponentRef<NgxDialogComponent>,
    config: NgxDialogConfig,
  ) {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    if (config.containerClass) {
      for (let c of config.containerClass.split(' ')) {
        if (c.trim()) domElem.classList.add(c);
      }
    }
    document.body.appendChild(domElem);
  }

  closeAll() {
    for (let index = 0; index < this.dialogComponentRefs.length; index++) {
      if (this.dialogComponentRefs[index]) {
        this.appRef.detachView(this.dialogComponentRefs[index].hostView);
        this.dialogComponentRefs[index].destroy();
      }
    }
    this.dialogComponentRefs = [];
  }

  private get getDialogId() {
    return randomStrnig(10, true);
  }
}
