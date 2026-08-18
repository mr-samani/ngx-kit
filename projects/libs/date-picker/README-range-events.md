# ngx-kit Date Picker — Range & Calendar Events

## Date range picker

Use the new directive on an input:

```html
<input ngxInputDateRangePicker [(ngModel)]="range" locale="en" displayFormat="yyyy/MM/dd" />
```

```ts
range: NgxDateRange<Date> = {
  start: new Date(2026, 7, 10),
  end: new Date(2026, 7, 20),
};
```

It also accepts a tuple:

```ts
[startDate, endDate];
```

The picker provides:

- start/end selection
- automatic range ordering
- continuous in-range highlighting
- start/end circular markers
- hover preview before the second date is selected
- min/max validation
- ControlValueAccessor / reactive forms / ngModel
- light/dark theme using CSS `light-dark()`
- RTL support

## Calendar events

```html
<ngx-calendar locale="en" [events]="events" (selectEvent)="onEventClick($event)"></ngx-calendar>
```

```ts
events: MsEvents[] = [
  {
    id: 1,
    title: 'Release',
    start: new Date(2026, 7, 18),
    end: new Date(2026, 7, 20),
    color: '#6750A4',
  },
  {
    id: 2,
    title: 'Meeting',
    start: new Date(2026, 7, 22),
    backgroundColor: '#0F766E',
    textColor: '#fff',
  },
];
```

Multi-day events are rendered on every covered date with continuation edges. Event input is reactive, so replacing/loading the events array after the calendar has initialized re-renders the calendar.

The calendar's Event view also lists events overlapping the current month.
