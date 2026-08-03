import { InputSignal, TemplateRef, Type } from '@angular/core';

// ----------------------------------------------------------------------------
// قرارداد پایه‌ای که هر کامپوننت رندرر باید پیاده‌سازی کند.
// value/row/field همیشه توسط جدول پر می‌شوند؛ هر ورودی دیگری که renderer
// اضافه کند (مثل nameField در AvatarCellRenderer) به‌صورت خودکار استخراج و
// در rendererInputs همان ستون در دسترس/چک می‌شود.
// ----------------------------------------------------------------------------
export interface CellRendererComponent<TValue = unknown, TRow extends object = object> {
  value: InputSignal<TValue>;
  row: InputSignal<TRow>;
  field: InputSignal<TableFieldBase<TRow>>;
}

export type RendererRegistry = Readonly<Record<string, Type<CellRendererComponent<any, any>>>>;

/**
 * Identity helper: یک رجیستری رندرر را با inference کامل تعریف می‌کند.
 * همین آبجکت باید هم در provideTable({ renderers }) و هم در defineFields(renderers, ...)
 * استفاده شود تا کلیدها (و ورودی‌های اضافه‌ی هر رندرر) در کل پروژه type-check شوند.
 */
export function defineRenderers<R extends RendererRegistry>(registry: R): R {
  return registry;
}

// ----------------------------------------------------------------------------
// استخراج ورودی‌های اضافه‌ی هر رندرر مستقیماً از روی خودِ کلاس کامپوننت، بدون
// این‌که کاربر مجبور باشد آن‌ها را جای دیگری دوباره تایپ کند.
// نکته: فقط اعضای «public» و «قابل فراخوانی بدون آرگومان» (شکل InputSignal/Signal)
// در نظر گرفته می‌شوند؛ اعضای protected/private به‌طور خودکار (توسط خودِ
// TypeScript) از keyof حذف می‌شوند. توصیه: هر computed/derived داخلی در
// کامپوننت‌های رندرر را protected تعریف کنید تا اشتباهاً به‌عنوان ورودی قابل
// تنظیم دیده نشود. متدهای عمومی بدون آرگومان (نادر) هم می‌توانند اشتباهاً در
// این استخراج ظاهر شوند؛ چنین متدهایی را protected/private کنید.
// ----------------------------------------------------------------------------
type InstanceOf<C> = C extends Type<infer I> ? I : never;
type UnwrapSignal<S> = S extends () => infer V ? V : never;

export type RendererExtraInputs<C extends Type<any>> = {
  [K in keyof InstanceOf<C> as K extends 'value' | 'row' | 'field'
    ? never
    : InstanceOf<C>[K] extends () => any
      ? K
      : never]?: UnwrapSignal<InstanceOf<C>[K]>;
};

// ----------------------------------------------------------------------------
// تعریف ستون‌ها
// ----------------------------------------------------------------------------
export type ColumnAlign = 'start' | 'center' | 'end';

export type TableCellFormatter<T extends object = object> = (
  value: unknown,
  row: T,
  field: TableFieldBase<T>,
) => unknown;

export interface CellTemplateContext<T extends object> {
  $implicit: T;
  row: T;
  value: unknown;
  rowIndex: number;
  field: TableFieldBase<T>;
}

/** شکل پایه‌ای مشترک بین همه‌ی ستون‌ها، صرف‌نظر از این‌که renderer دارند یا نه. */
export interface TableFieldBase<T extends object> {
  column: Extract<keyof T, string>;
  title: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  wrap?: boolean;
  align?: ColumnAlign;
  prefix?: string;
  formatter?: string | TableCellFormatter<T>;
}

/** ستون بدون renderer (متن ساده / formatter / cellTemplate دستی). */
export interface PlainTableField<T extends object> extends TableFieldBase<T> {
  renderer?: undefined;
  rendererInputs?: undefined;
  cellTemplate?: TemplateRef<CellTemplateContext<T>>;
}

/** ستونی که یک renderer از رجیستری R انتخاب کرده؛ rendererInputs دقیقاً همان
 *  ورودی‌های اضافه‌ی همان renderer است — نه یک Record<string, unknown> آزاد. */
export type RenderedTableField<T extends object, R extends RendererRegistry> = {
  [K in keyof R]: TableFieldBase<T> & {
    renderer: K;
    rendererInputs?: RendererExtraInputs<R[K]>;
    cellTemplate?: undefined;
  };
}[keyof R];

export type TableField<T extends object, R extends RendererRegistry = {}> =
  | PlainTableField<T>
  | RenderedTableField<T, R>;

/**
 * Identity helper برای تعریف ستون‌های یک جدول با inference و type-check کامل
 * نسبت به هم مدل داده (T) و هم رجیستری رندررها (R).
 *
 * @example
 * const renderers = defineRenderers({ avatar: AvatarCellRenderer, boolean: BooleanCellRenderer });
 *
 * const fields = defineFields<Tenant, typeof renderers>(renderers, [
 *   { column: 'avatarUrl', title: 'کاربر', renderer: 'avatar', rendererInputs: { showName: true } }, // ✅
 *   { column: 'avatarUrl', title: 'کاربر', renderer: 'avatar', rendererInputs: { showName: 'x' } },  // ❌ باید boolean باشد
 *   { column: 'isActive',  title: 'فعال', renderer: 'bool' },                                        // ❌ کلید رجیستری نیست
 *   { column: 'ageXYZ',    title: '...' },                                                            // ❌ فیلد Tenant نیست
 * ]);
 */
export function defineFields<T extends object, R extends RendererRegistry = {}>(
  _renderers: R,
  fields: TableField<T, R>[],
): TableField<T, R>[] {
  return fields;
}
