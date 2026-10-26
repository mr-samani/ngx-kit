import {
  Directive, ElementRef, Input, Renderer2, Signal, TemplateRef, ViewContainerRef, effect, inject, signal,
} from '@angular/core';
import { I18nService } from '../services/i18n.service';
import type { Params, TranslateFn } from '../types/types';

export interface TrContext {
  $implicit: TranslateFn;
  t: TranslateFn;
  lang: Signal<string>;
}

/**
 * Structural directive. The view is created ONCE; `t` reads signals, so only the bindings that use it update.
 *
 *   <ng-container *tr="let t; prefix: 'orders'">
 *     <h1>{{ t('title') }}</h1>            <!-- orders.title -->
 *   </ng-container>
 */
@Directive({ selector: '[tr],[translate]' })
export class TrDirective {
  private readonly tpl = inject<TemplateRef<TrContext>>(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly svc = inject(I18nService);
  private readonly prefix = signal<string | undefined>(undefined);
  /** `prefix: 'orders'` in the microsyntax. */
  @Input('trPrefix') set trPrefix(v: string | undefined) { this.prefix.set(v); }

  static ngTemplateContextGuard(_dir: TrDirective, _ctx: unknown): _ctx is TrContext {
    return true;
  }

  constructor() {
    const t: TranslateFn = (key, params) => {
      const p = this.prefix();
      return this.svc.t(p ? p + '.' + key : key, params);
    };
    this.vcr.createEmbeddedView(this.tpl, { $implicit: t, t, lang: this.svc.lang });
  }
}

/**
 * Attribute directive.
 *   <span trKey="orders.title"></span>
 *   <input trKey="form.name" trAttr="placeholder" />
 *   <p trKey="hello" [trParams]="{ name: user.name }"></p>
 */
@Directive({ selector: '[trKey]' })
export class TrKeyDirective {
  // @Input setters feeding signals: works with JIT, AOT and every supported Angular version.
  private readonly key = signal<string | undefined>(undefined);
  private readonly params = signal<Params | undefined>(undefined);
  private readonly attr = signal<string | undefined>(undefined);
  private readonly prefix = signal<string | undefined>(undefined);
  @Input('trKey') set trKey(v: string | undefined) { this.key.set(v); }
  @Input('trParams') set trParams(v: Params | undefined) { this.params.set(v); }
  @Input('trAttr') set trAttr(v: string | undefined) { this.attr.set(v); }
  @Input('trPrefix') set trPrefix(v: string | undefined) { this.prefix.set(v); }

  constructor() {
    const svc = inject(I18nService);
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const r = inject(Renderer2);
    effect(() => {
      const k = this.key();
      if (!k) return;
      const p = this.prefix();
      const text = svc.t(p ? p + '.' + k : k, this.params());
      const a = this.attr();
      if (a) r.setAttribute(el, a, text);
      else if (el.textContent !== text) el.textContent = text;
    });
  }
}
