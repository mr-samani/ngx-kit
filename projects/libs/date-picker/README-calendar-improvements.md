# Calendar view improvements

## Implemented

- Locale-aware week boundaries through `IDateAdapter.getStartOfWeek()` / `getEndOfWeek()`.
- Gregorian/Chinese/Hijri weeks start on Sunday.
- Jalali weeks start on Saturday.
- Week header shows the actual seven-day range.
- Day header shows the selected/active day, not the beginning of its week.
- Previous/next navigation:
  - month/event: one calendar month
  - week: seven days
  - day: one day
- Full hourly day view with 30-minute grid lines.
- Week view with seven independent day columns.
- Timed events are rendered at their actual time and duration.
- All-day events are rendered in a dedicated all-day lane.
- Multi-day timed events are clipped per visible day and marked as continuing.
- Overlapping timed events are assigned separate visual lanes.
- Event click continues to emit `selectEvent`.
- `OnPush` change detection and precomputed view models reduce unnecessary work.
- Added adapter and component tests for navigation, week boundaries, day/week events, all-day events, and overlap handling.

## Event semantics

`start` and `end` are treated as real instants for timed events. For month/day intersection logic the calendar compares the calendar date portion, so an event spanning midnight appears on every affected day.

For a one-day event, omit `end` or set `end` to the same date.

```ts
{
  id: 'meeting-1',
  title: 'Architecture meeting',
  start: new Date(2026, 7, 19, 9, 30),
  end: new Date(2026, 7, 19, 11, 0),
  color: '#6750A4'
}
```

For an all-day event:

```ts
{
  id: 'holiday',
  title: 'Holiday',
  start: new Date(2026, 7, 19),
  end: new Date(2026, 7, 20),
  allDay: true
}
```
