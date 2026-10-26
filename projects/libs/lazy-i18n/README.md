# ngx-kit/lazy-i18n

Tiny, signal-based, **lazy-scoped** i18n for Angular.
Flat keys, route-level scopes, pipe, directives, fallbacks and a key extractor CLI


- **Route-level scopes, no key prefix.** A module's translations are loaded when its route is created and are used as plain keys (`Request`, not `setting.Request`).
- **Routes wait for their translations.** One guard on the root route makes navigation resolve only after every scope on the path has loaded. No "missing translation" flashes.
- **Signals first.** `t()`, `select()`, `translateSignal()` are reactive in `computed`, `effect` and templates. Works zoneless and with `OnPush`.
- **Fast.** Dictionaries are flattened once into a `Map`, so a lookup is O(1). The pipe is memoised, the structural directive creates its view once, and interpolation skips the regex when a string has no `{{`.
- **Complete.** Pipe, structural and attribute directives, fallback languages, missing-key handling, custom transpiler (ICU, plurals), custom loaders, RTL/`<html lang dir>` handling, and a **key extractor CLI** that generates your JSON files per scope.
- Angular 19+ (standalone APIs, `provideAppInitializer`, `provideEnvironmentInitializer`). ESM only. Zero runtime dependencies besides `tslib`/`rxjs`.

---

## Contents

1. [Install](#install)
2. [Quick start](#quick-start)
3. [Concepts](#concepts)
4. [Using translations](#using-translations)
5. [Scopes and routing](#scopes-and-routing)
6. [Language switching](#language-switching)
7. [Fallbacks and missing keys](#fallbacks-and-missing-keys)
8. [Interpolation, plurals and ICU](#interpolation-plurals-and-icu)
9. [Loaders](#loaders)
10. [Key extractor CLI](#key-extractor-cli)
11. [Configuration reference](#configuration-reference)
12. [API reference](#api-reference)
13. [Testing your app](#testing-your-app)
14. [Performance notes](#performance-notes)
15. [Migrating from Transloco](#migrating-from-transloco)
16. [Limitations](#limitations)
17. [Developing this library](#developing-this-library)

---

## Install

```bash
npm i ngx-kit
```


## Quick start

**1. Provide it** (`app.config.ts`)

```ts
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideI18n } from 'ngx-kit/lazy-i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideI18n({
      langs: ['fa', 'en'],
      defaultLang: 'fa',
      fallbackLangs: ['en'],
      baseUrl: '/i18n',          // GET /i18n/fa   and   GET /i18n/setting/fa
    }),
  ],
};
```

The global file of the initial language is loaded **before** the app bootstraps.

**2. Declare scopes on routes and add the guard once** (`app.routes.ts`)

```ts
import { i18nReadyGuard, provideI18nScope } from 'ngx-kit/lazy-i18n';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [i18nReadyGuard],                 // once, on the root path-less route
    children: [
      {
        path: 'setting',
        providers: [provideI18nScope('setting')],       // loads /i18n/setting/{lang}
        loadChildren: () => import('./setting/setting.routes'),
      },
      {
        path: 'orders',
        providers: [provideI18nScope(['orders', 'shared-grid'])], // several scopes are fine
        loadComponent: () => import('./orders/orders.page'),
      },
    ],
  },
];
```

Child routes of `setting` need **nothing**. Components never mention a scope.

**3. Translate**

```ts
import { Component } from '@angular/core';
import { TR, translateSignal } from 'ngx-kit/lazy-i18n';

@Component({
  selector: 'app-requests',
  imports: [TR],                                   // pipe + both directives
  template: `
    <h1>{{ 'Request' | tr }}</h1>
    <p>{{ 'welcome' | tr: { name: user.name } }}</p>
    <input trKey="Search" trAttr="placeholder" />
    <h2>{{ title() }}</h2>
  `,
})
export class RequestsComponent {
  user = { name: 'Ali' };
  title = translateSignal('Request');
}
```

## Concepts

| Term | Meaning |
|---|---|
| **Global file** | `GET {baseUrl}/{lang}`, loaded at startup. |
| **Scope file** | `GET {baseUrl}/{scope}/{lang}`, loaded when a route registers the scope. |
| **Flat namespace** | All files are merged at the **root** of one language dictionary. Keys never carry the scope name. |
| **Registered scope** | A scope that any route has requested. Registered scopes stay registered, so they are also loaded when the language changes. |
| **Revision** | A counter signal that changes whenever the language or any dictionary changes. Pipe and directives depend on it. |

Because the namespace is flat, **two scopes must not define the same key with different values**. In dev mode a warning is logged when that happens. Put shared words (`Save`, `Cancel`) in the global file.

## Using translations

### Pipe

```html
{{ 'orders.title' | tr }}
{{ 'hello' | tr: { name: user.name } }}
<button [title]="'common.save' | tr">…</button>
```

### Structural directive

The view is created once; `t` is a signal-aware function, so only the bindings that call it update.

```html
<ng-container *tr="let t; prefix: 'orders'">
  <h1>{{ t('title') }}</h1>                 <!-- orders.title -->
  <p>{{ t('count', { n: items.length }) }}</p>
</ng-container>
```

Context: `$implicit` / `t` (the translate function) and `lang` (a `Signal<string>`).

### Attribute directive

```html
<span trKey="orders.title"></span>
<input trKey="form.name" trAttr="placeholder" />
<p trKey="hello" [trParams]="{ name: user.name }"></p>
<span trKey="title" trPrefix="orders"></span>
```

`trAttr` sets an attribute instead of the text content.

### Signals

```ts
import { computed, inject } from '@angular/core';
import { I18nService, injectT, translateSignal } from 'ngx-kit/lazy-i18n';

class Demo {
  private i18n = inject(I18nService);
  title  = translateSignal('orders.title');
  hello  = translateSignal('hello', () => ({ name: this.name() })); // params may read signals
  t      = injectT();
  label  = computed(() => this.t('orders.count', { n: this.n() }));
  lang   = this.i18n.lang;       // Signal<string>
  dir    = this.i18n.dir;        // Signal<'rtl' | 'ltr'>
}
```

### Service

```ts
i18n.t('key', params?)         // reactive when read inside computed/effect/template
i18n.instant('key', params?)   // same lookup, never creates a reactive dependency
i18n.select('key', params?)    // Signal<string>
i18n.has('key')                // true if non-empty in active lang or a fallback
i18n.getObject('orders')       // nested object of everything under "orders."
```

## Scopes and routing

`provideI18nScope('x')` is an environment initializer. Angular creates a route's injector while it recognises the URL, which happens **before guards run**, so loading starts as early as possible. `i18nReadyGuard` then waits until every registered scope has loaded and lets the navigation continue. Lazy-loaded children behave the same way.

Rules of thumb:

- Put `i18nReadyGuard` **once** on the root path-less route as `canActivateChild`.
- Put `provideI18nScope(...)` on the route that owns the module.
- Without the guard, scopes still load, but a component may render before the files arrive. Use `await i18n.whenReady()` if you must translate imperatively at startup.
- For a scope not tied to a route (a dialog library, for example) call `i18n.registerScope('name')` and `await i18n.whenReady()`.
- A failed scope request is retried (`retries`, default 1), then logged. It never blocks navigation forever.

## Language switching

```ts
await i18n.use('en');
```

`use()` downloads the global file, **all registered scopes** and the fallback languages first, and only then switches `lang`. Nothing flashes untranslated. Calling `use()` repeatedly is safe: the last call wins. The choice is stored in `localStorage` (`storageKey`) and `<html lang dir>` is updated.

`i18n.preload('en')` downloads a language without activating it.

## Fallbacks and missing keys

```ts
provideI18n({
  langs: ['fa', 'en'], defaultLang: 'fa',
  fallbackLangs: ['en'],                    // looked up in order
  missing: (key, lang) => `⚠ ${key}`,       // 'key' (default) | 'empty' | function
  warnMissing: true,                        // console.warn once per key (default: dev mode)
});
```

A value of `''` counts as **missing**, so the placeholders written by the extractor fall back to the next language automatically.

## Interpolation, plurals and ICU

Default syntax: `Hello {{ name }}`, nested paths (`{{ user.name }}`) are supported, unknown placeholders are left untouched.

Plug in anything else with `transpile`:

```ts
provideI18n({
  …,
  transpile: (value, params, lang) => {
    // example: tiny plural helper "{n, plural, one {# item} other {# items}}"
    return value.replace(/\{(\w+), plural, one \{([^}]*)\} other \{([^}]*)\}\}/g, (_, k, one, other) => {
      const n = Number(params?.[k] ?? 0);
      const form = new Intl.PluralRules(lang).select(n) === 'one' ? one : other;
      return form.replace('#', String(n));
    });
  },
});
```

Use a real ICU library (for example `intl-messageformat`) inside `transpile` for full ICU support, and cache compiled messages there.

## Loaders

The default `HttpI18nLoader` uses `HttpClient`, so your interceptors (auth, base URL, retry) apply.

```ts
provideI18n({
  …,
  baseUrl: '/api/translations',   // /api/translations/fa, /api/translations/setting/fa
  fileExtension: '.json',         // static files: /assets/i18n/fa.json
  // or full control:
  url: (lang, scope) => `/api/i18n?lang=${lang}${scope ? `&scope=${scope}` : ''}`,
});
```

Custom loader (anything that returns a nested or flat object, as `Observable` or `Promise`):

```ts
@Injectable({ providedIn: 'root' })
export class MyLoader implements I18nLoader {
  load(lang: string, scope?: string) {
    return fetch(`/x/${scope ?? '_global'}/${lang}`).then((r) => r.json());
  }
}
provideI18n({ …, loader: MyLoader });
```

Nested JSON (`{ "a": { "b": "x" } }`) and flat JSON (`{ "a.b": "x" }`) are both accepted.

## Key extractor CLI

Generates and updates your JSON files from the source code, **per scope**.

```bash
npx ngx-lazy-i18n-extract                  # reads ./i18n.config.json
npx ngx-lazy-i18n-extract --check          # CI: exit 1 if a used key is missing from the files
npx ngx-lazy-i18n-extract --remove         # also delete keys no longer used
npx ngx-lazy-i18n-extract --langs fa,en --output src/assets/i18n --input src
```

`i18n.config.json`:

```json
{
  "input": ["src"],
  "output": "src/assets/i18n",
  "langs": ["fa", "en"],
  "scopes": { "setting": "src/app/setting", "orders": "src/app/orders" },
  "extensions": ["html", "ts"],
  "ignore": [],
  "placeholder": "",
  "sort": true,
  "unflat": false,
  "remove": false
}
```

- A source file belongs to the scope whose directory is the **longest match**; everything else is global.
- Output: `{output}/{lang}.json` for global, `{output}/{scope}/{lang}.json` for scopes.
- Existing values are never overwritten. New keys get `placeholder` (empty by default, which makes the runtime fall back).
- `unflat: true` writes nested objects; a key that cannot be nested (leaf/branch conflict) stays dotted.
- A second run is idempotent: unchanged files are not rewritten.

What it recognises:

| Source | Extracted |
|---|---|
| `{{ 'a.b' \| tr }}` and `(c ? 'a' : 'b') \| tr` | `a.b`, `a`, `b` |
| `*tr="let t; prefix: 'orders'"` then `t('title')` | `orders.title` |
| `trKey="a.b"`, `[trKey]="'a.b'"`, with `trPrefix="p"` | `a.b` / `p.a.b` |
| `i18n.t('a')`, `.select('a')`, `.has('a')`, `.getObject('a')`, `.instant('a')` | `a` |
| `translateSignal('a')`, `marker('a')` | `a` |
| `// tr-keys: a, b` or `<!-- tr-keys(prefix): a, b -->` | declares dynamic keys |

Dynamic keys (template strings with `${}`, variables) cannot be known statically. Declare them with a `tr-keys` comment or wrap constants in `marker('key')`:

```ts
import { marker } from 'ngx-kit/lazy-i18n';
const STATUS = { open: marker('status.open'), closed: marker('status.closed') };
// then: i18n.t(STATUS[s])
```

Add to `package.json` scripts: `"i18n": "ngx-lazy-i18n-extract"`, `"i18n:check": "ngx-lazy-i18n-extract --check"`.

## Configuration reference

| Option | Type | Default | Description |
|---|---|---|---|
| `langs` | `string[]` | required | Supported languages. |
| `defaultLang` | `string` | required | Used when nothing is stored or detected. |
| `fallbackLangs` | `string[]` | `[]` | Languages tried, in order, for missing/empty keys. |
| `missing` | `'key' \| 'empty' \| (key, lang) => string` | `'key'` | What to render for a missing key. |
| `warnMissing` | `boolean` | `isDevMode()` | Log each missing key once. |
| `transpile` | `(value, params, lang) => string` | built-in `{{ }}` | Custom message formatter. |
| `loader` | `Type<I18nLoader>` | `HttpI18nLoader` | Custom loader class. |
| `baseUrl` | `string` | `'/i18n'` | HTTP loader base. |
| `fileExtension` | `string` | `''` | HTTP loader extension (e.g. `.json`). |
| `url` | `(lang, scope?) => string` | none | HTTP loader full URL control. |
| `retries` | `number` | `1` | Retries per failed request (250 ms delay). |
| `storageKey` | `string \| null` | `'lazy-i18n.lang'` | Persist language; `null` disables. |
| `detectBrowserLang` | `boolean` | `false` | Use `navigator.languages` when nothing is stored. |
| `manageDocument` | `boolean` | `true` | Keep `<html lang dir>` in sync. |

## API reference

**Providers / guards:** `provideI18n(config)`, `provideI18nScope(scope | scope[])`, `i18nReadyGuard`

**Template:** `TrPipe` (`tr`), `TrDirective` (`*tr`), `TrKeyDirective` (`trKey`), bundle `TR`

**Functions:** `translateSignal(key, params?)`, `injectT()`, `marker(key)`, `interpolate(text, params)`, `flatten(dict)`

**`I18nService`**

| Member | Description |
|---|---|
| `lang: Signal<string>` | Active language. |
| `dir: Signal<'rtl' \| 'ltr'>` | Direction for the active language. |
| `revision: Signal<number>` | Changes on every language/dictionary change. |
| `langs: readonly string[]` | Supported languages. |
| `t(key, params?)` | Translate (reactive). |
| `instant(key, params?)` | Translate (non-reactive). |
| `select(key, params?)` | `Signal<string>`; `params` may be a function. |
| `has(key)` / `getObject(prefix)` | Introspection. |
| `use(lang)` | Load everything, then activate. |
| `preload(lang)` | Download without activating. |
| `registerScope(scope)` | Register and start loading a scope. |
| `whenReady()` | Resolves when all registered scopes are loaded. Never rejects. |
| `setTranslation(lang, dict, merge = true)` | Inject translations manually. |
| `detectInitialLang()` | Stored, browser (opt-in) or default. |

## Testing your app

Skip the network by providing a loader that returns objects:

```ts
@Injectable({ providedIn: 'root' })
class TestLoader implements I18nLoader {
  load(lang: string, scope?: string) {
    return of(DICTS[`${lang}|${scope ?? ''}`] ?? {});
  }
}

TestBed.configureTestingModule({
  providers: [provideI18n({ langs: ['en'], defaultLang: 'en', loader: TestLoader, storageKey: null })],
});
```

Or call `TestBed.inject(I18nService).setTranslation('en', { a: 'A' })` and `await svc.use('en')`.

## Performance notes

- **Lookup:** one `Map.get` on the flattened active-language map, plus one per fallback language only on a miss.
- **Pipe:** impure so it follows signals, but memoised on key, params (shallow compare) and `revision`. Unchanged inputs return the cached string without a lookup.
- **Directive:** creates its view once. Updates happen through signal reads in the bindings, so nothing is re-created on language change.
- **Interpolation:** `indexOf('{{')` fast path; no regex for static strings.
- **Network:** each `(lang, scope)` file is requested at most once (in-flight requests are shared). The language switch loads global + scopes + fallbacks in parallel.
- **Bundle:** no runtime dependency besides Angular, RxJS and `tslib`. The extractor is a separate Node script and is not bundled into apps.

## Migrating from Transloco

| Transloco | ngx-kit/lazy-i18n |
|---|---|
| `provideTransloco(...)` | `provideI18n(...)` |
| `provideTranslocoScope('x')` | `provideI18nScope('x')` (route `providers`) |
| `{{ 'x.key' \| transloco }}` | `{{ 'key' \| tr }}` |
| `*transloco="let t; read: 'x'"` | `*tr="let t; prefix: 'x'"` |
| `translateSignal('x.key')` | `translateSignal('key')` |
| `service.selectTranslate()` | `i18n.select()` / `translateSignal()` |
| `setActiveLang()` | `await i18n.use()` |
| `TranslocoLoader` | `I18nLoader` |
| `transloco-keys-manager` | `ngx-lazy-i18n-extract` |

Server files can stay as they are (`/i18n/{scope}/{lang}`). Keys that used to be written with the scope prefix must be written without it, or the scope name must be moved inside your JSON.

## Limitations

- **Flat namespace.** Cross-scope key collisions are your responsibility (dev-mode warning only).
- **Extractor is a static scanner.** It uses regular expressions and a small call parser, not the Angular compiler. `t()` calls are attributed to the **nearest preceding** `*tr="let t"` with the same variable name in the same file, so nested `*tr` blocks that reuse the same variable name with different prefixes can be mis-attributed. Use distinct variable names (`let t`, `let tOrders`) or `tr-keys` comments.
- **SSR.** `localStorage`/`document` access is guarded, but relative HTTP URLs on the server need an absolute-URL interceptor or a custom loader. Transfer-state is not implemented; use `setTranslation()` if you need it.
- **Pluralisation/ICU** are not built in; plug a formatter into `transpile`.
- Signal `input()` is deliberately not used for the directives, so they work in JIT test environments and older Angular versions.

## Developing this library

```bash
npm install
npm test             # vitest: service, pipe/directives, routing, extractor
npm run build        # ng-packagr -> dist/
cd dist && npm publish
```

Source layout:

```
src/lib/
  i18n.service.ts     state, loading, scopes, fallbacks, language switching
  pipe.ts             `tr` pipe (memoised)
  directives.ts       *tr and trKey
  routing.ts          provideI18nScope, i18nReadyGuard
  provide-i18n.ts     provideI18n
  http-loader.ts      default loader
  signals.ts          translateSignal, injectT
  utils.ts            flatten, interpolate, marker
tools/extractor.mjs   key extraction engine
bin/extract.mjs       CLI wrapper
```

MIT licensed.
