# Calendar event layout & interactions

## Event layout

Month view uses horizontal event segments. A multi-day event is split only at week boundaries, so the visual bar remains continuous across the seven columns of each week row. Each row has independent overlap lanes.

Week/day views use timed overlap clusters. Only events that overlap in time share the available horizontal lanes.

## Drag and resize

The calendar supports pointer-based event manipulation in month, week and day views:

- **Move**: drag the body of an event.
- **Resize start**: drag the start handle.
- **Resize end**: drag the end handle.
- Timed views snap to 30-minute increments.
- Month and all-day interactions snap to whole days.
- The minimum timed-event duration is 30 minutes.
- `min` and `max` prevent a drop outside the configured bounds.
- The input event object is not mutated in place.

## Outputs

```ts
@Output() eventChange = new EventEmitter<CalendarEventChange>();
@Output() eventsChange = new EventEmitter<MsEvents[]>();
```

`eventChange` contains the updated event, the previous event, the interaction type, and the applied day/minute delta. `eventsChange` emits the complete updated event collection.

The parent can treat `events` as a controlled input and update it from either output.

## Timed-event overlap

The lane algorithm is cluster based. If events overlap from 09:00–10:00 but another event exists at 15:00–16:00, the 15:00 event keeps the full column instead of being squeezed by the morning cluster.
