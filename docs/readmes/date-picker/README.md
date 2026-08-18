# ngx-kit/date-picker

A date picker supporting four calendar systems: Gregorian, Jalali (Persian), Hijri (Islamic), and Chinese — built on an adapter-based architecture that also makes it possible to add other calendars. It also ships a standalone calendar component (`ngx-calendar`) usable without any inputs.

## Install

```bash
npm install ngx-kit
```

## Setup

Calendar adapters need to be provided (the default provides all four; if you only need some of them, the bundle stays smaller since each is lazily imported):

```ts
// app.config.ts
import { provideDateAdapters } from 'ngx-kit/date-picker';

export const appConfig: ApplicationConfig = {
  providers: [provideDateAdapters()],
};
```

## Usage

```html
<input type="text" [ngxInputDatePicker]="date" (change)="date = $event" [locale]="'fa'" [displayFormat]="'yyyy/MM/dd'" />
```

```html
<ngx-calendar [locale]="'fa'" [theme]="'auto'"></ngx-calendar>
```

## API

### `[ngxInputDatePicker]`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` (`'en'`, `'fa'`, `'hi'`, `'zh'`, or any custom registered locale) | `'en'` | Which calendar to use |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | |
| `displayFormat` | `string` | `'yyyy/MM/dd'` | Text display format for the date |
| `min` / `max` | `Date` | | Allowed range |
| `config` | `NgxDatePickerConfig` | | Show/hide and text for the "today"/"clear" buttons, custom icon templates |
| `change` *(output)* | `EventEmitter<Date>` | | The selected date (always a standard JavaScript `Date`, regardless of the displayed calendar) |

### `getLocals()`

Returns the list of currently registered locales (e.g. to populate a language `<select>`):

```ts
availableLocals = getLocals(); // ['en', 'fa', 'hi', 'zh']
```

### Adding a custom calendar

```ts
provideDateAdapters({ locale: 'ja', useClass: MyJapaneseAdapter });
```

`MyJapaneseAdapter` must implement the `IDateAdapter` interface.

## Performance note

The Hijri and Chinese calendars (which are table/astronomical-based, unlike the formulaic Gregorian/Jalali ones) cache their computation results internally — since rendering a calendar month calls the date computation separately for every day cell, without caching this could take several hundred milliseconds for years far from today.

## Dark mode and RTL

Supported automatically (the Jalali/Hijri calendars are naturally RTL too).
