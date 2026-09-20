import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NgxCalendarComponent } from '../components/calendar/ngx-calendar.component';
import { provideDateAdapters } from '../provide-date-adapters';

const HOUR_HEIGHT = 64;
const HALF_HOUR_HEIGHT = 32;
const DAY_HEIGHT = 24 * HOUR_HEIGHT;

const d = (value: string) => new Date(`${value}T12:00:00`);

const domRect = (left = 0, top = 0, width = 100, height = DAY_HEIGHT): DOMRect =>
  ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

describe('NgxCalendarComponent', () => {
  let fixture: ComponentFixture<NgxCalendarComponent>;
  let component: NgxCalendarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxCalendarComponent],
      providers: [...provideDateAdapters()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxCalendarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.instance.locale = 'en';

    fixture.componentRef.setInput('events', []);
    fixture.componentRef.setInput('resizeAndMovable', true);

    fixture.detectChanges();
  });

  // ===========================================================================
  // VIEW / NAVIGATION
  // ===========================================================================

  describe('navigation and views', () => {
    it('shows seven days in week view', () => {
      component.anchorDate.set(d('2026-08-19'));
      component.changeView('week');

      expect(component.weekDays).toHaveLength(7);

      expect(component.weekDays[0].date.getDay()).toBe(0);
      expect(component.weekDays[6].date.getDay()).toBe(6);

      expect(component.weekDays[3].date.getDate()).toBe(19);

      expect(component.headerText).toContain('August');
      expect(component.headerText).toContain('2026');
    });

    it('uses the selected day in day view', () => {
      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      expect(component.weekDays).toHaveLength(1);
      expect(component.weekDays[0].date.getDate()).toBe(19);
      expect(component.headerText).toContain('19');
    });

    it('moves one week forward and backward in week view', () => {
      component.anchorDate.set(d('2026-08-19'));
      component.changeView('week');

      component.next();

      expect(component.anchorDate()?.getDate()).toBe(26);

      component.previous();

      expect(component.anchorDate()?.getDate()).toBe(19);
    });

    it('moves one day forward and backward in day view', () => {
      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      component.next();

      expect(component.anchorDate()?.getDate()).toBe(20);
      expect(component.weekDays[0].date.getDate()).toBe(20);

      component.previous();

      expect(component.anchorDate()?.getDate()).toBe(19);
      expect(component.weekDays[0].date.getDate()).toBe(19);
    });

    it('moves one month forward and backward in month view', () => {
      component.anchorDate.set(d('2026-08-19'));
      component.changeView('month');

      component.next();

      expect(component.currMonth()).toBe(8);
      expect(component.currYear()).toBe(2026);

      component.previous();

      expect(component.currMonth()).toBe(7);
      expect(component.currYear()).toBe(2026);
    });

    it('handles December to January navigation', () => {
      component.anchorDate.set(d('2026-12-15'));
      component.changeView('month');

      component.next();

      expect(component.currMonth()).toBe(0);
      expect(component.currYear()).toBe(2027);
    });

    it('handles January to December navigation', () => {
      component.anchorDate.set(d('2026-01-15'));
      component.changeView('month');

      component.previous();

      expect(component.currMonth()).toBe(11);
      expect(component.currYear()).toBe(2025);
    });
  });

  // ===========================================================================
  // EVENT RENDERING
  // ===========================================================================

  describe('event rendering', () => {
    it('renders a timed event in week view', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 'meeting',
          title: 'Meeting',
          start: new Date('2026-08-19T09:00:00'),
          end: new Date('2026-08-19T14:30:00'),
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('week');

      const day = component.weekDays.find((x) => x.date.getDate() === 19)!;

      expect(day.events).toHaveLength(1);

      expect(day.events[0].top).toBe(9 * HOUR_HEIGHT);
      expect(day.events[0].height).toBe(5.5 * HOUR_HEIGHT);
    });

    it('renders a timed event in day view', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 'meeting',
          title: 'Meeting',
          start: new Date('2026-08-19T09:30:00'),
          end: new Date('2026-08-19T11:00:00'),
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      expect(component.weekDays).toHaveLength(1);
      expect(component.weekDays[0].events).toHaveLength(1);

      const event = component.weekDays[0].events[0];

      expect(event.top).toBe(9.5 * HOUR_HEIGHT);
      expect(event.height).toBe(1.5 * HOUR_HEIGHT);
    });

    it('keeps all-day events out of timed events', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 'holiday',
          title: 'Holiday',
          start: d('2026-08-19'),
          end: d('2026-08-20'),
          allDay: true,
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      expect(component.weekDays[0].events).toHaveLength(0);
      expect(component.allDayByColumn[0]).toHaveLength(1);
    });

    it('renders an all-day event in the active day column', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 'holiday',
          title: 'Holiday',
          start: d('2026-08-19'),
          end: d('2026-08-20'),
          allDay: true,
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('week');

      const index = component.weekDays.findIndex((day) => day.date.getDate() === 19);

      expect(index).toBeGreaterThanOrEqual(0);
      expect(component.allDayByColumn[index]).toHaveLength(1);
    });
  });

  // ===========================================================================
  // OVERLAP
  // ===========================================================================

  describe('overlapping events', () => {
    it('keeps overlapping events visible', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 1,
          title: 'A',
          start: new Date('2026-08-19T09:00:00'),
          end: new Date('2026-08-19T11:00:00'),
        },
        {
          id: 2,
          title: 'B',
          start: new Date('2026-08-19T10:00:00'),
          end: new Date('2026-08-19T12:00:00'),
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      const events = component.weekDays[0].events;

      expect(events).toHaveLength(2);

      expect(events[0].columnCount).toBeGreaterThan(1);
      expect(events[1].columnCount).toBeGreaterThan(1);
    });

    it('does not create an overlap lane for a separate event', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 1,
          start: new Date('2026-08-19T09:00:00'),
          end: new Date('2026-08-19T10:00:00'),
        },
        {
          id: 2,
          start: new Date('2026-08-19T09:30:00'),
          end: new Date('2026-08-19T10:30:00'),
        },
        {
          id: 3,
          start: new Date('2026-08-19T15:00:00'),
          end: new Date('2026-08-19T16:00:00'),
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      const events = component.weekDays[0].events;

      expect(events).toHaveLength(3);

      expect(events[0].columnCount).toBe(2);
      expect(events[1].columnCount).toBe(2);
      expect(events[2].columnCount).toBe(1);
    });
  });

  // ===========================================================================
  // MONTH EVENTS
  // ===========================================================================

  describe('month event segments', () => {
    it('splits a multi-day event across month rows', () => {
      fixture.componentRef.setInput('events', [
        {
          id: 'multi',
          title: 'Conference',
          start: new Date('2026-08-19T09:00:00'),
          end: new Date('2026-08-23T18:00:00'),
        },
      ]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('month');

      expect(component.monthEventSegments.length).toBe(2);

      expect(component.monthEventSegments[0].continuesAfter).toBe(true);
      expect(component.monthEventSegments[1].continuesBefore).toBe(true);

      expect(component.monthEventSegments[0].startColumn).toBe(3);
      expect(component.monthEventSegments[0].endColumn).toBe(6);

      expect(component.monthEventSegments[1].startColumn).toBe(0);
      expect(component.monthEventSegments[1].endColumn).toBe(0);
    });
  });

  // ===========================================================================
  // TIMED INTERACTION TEST HELPERS
  // ===========================================================================

  function mockDayColumnGeometry(): HTMLElement {
    fixture.detectChanges();
    const column = fixture.nativeElement.querySelector('.day-column') as HTMLElement;

    expect(column).toBeTruthy();

    vi.spyOn(column, 'getBoundingClientRect').mockReturnValue(domRect());

    return column;
  }

  function pointer(
    type: 'down' | 'move' | 'up',
    clientX: number,
    clientY: number,
    pointerId = 1,
  ): PointerEvent {
    return new PointerEvent(`pointer${type}`, {
      button: type === 'down' ? 0 : 0,
      pointerId,
      clientX,
      clientY,
    });
  }

  // ===========================================================================
  // MOVE
  // ===========================================================================

  describe('timed event move', () => {
    it('moves a timed event by one hour', () => {
      const event = {
        id: 'move',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const emitted: any[] = [];

      component.eventChange.subscribe((change) => {
        emitted.push(change);
      });

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 1), target);

      component['updateEventInteraction'](pointer('move', 10, 10 * HOUR_HEIGHT, 1));

      component['finishEventInteraction'](pointer('up', 10, 10 * HOUR_HEIGHT, 1), false);

      expect(emitted).toHaveLength(1);

      expect(emitted[0].event.start.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());

      expect(emitted[0].event.end?.getTime()).toBe(new Date('2026-08-19T11:00:00').getTime());
    });

    it('snaps movement to 30-minute increments', () => {
      const event = {
        id: 'snap',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 2), target);

      /*
       * 48px = 45 minutes because:
       *
       * 32px = 30 minutes
       * 48px = 45 minutes
       *
       * snapMinutes(45) => 60
       */
      component['updateEventInteraction'](pointer('move', 10, 9 * HOUR_HEIGHT + 48, 2));

      expect(component['interaction']?.deltaMinutes).toBe(60);
    });

    it('does not emit eventChange when there is no actual change', () => {
      const event = {
        id: 'unchanged',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const emitted: any[] = [];

      component.eventChange.subscribe((change) => {
        emitted.push(change);
      });

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 3), target);

      component['finishEventInteraction'](pointer('up', 10, 9 * HOUR_HEIGHT, 3), false);

      expect(emitted).toHaveLength(0);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());
    });

    it('does not commit a cancelled interaction', () => {
      const event = {
        id: 'cancel',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const emitted: any[] = [];

      component.eventChange.subscribe((change) => {
        emitted.push(change);
      });

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 4), target);

      component['updateEventInteraction'](pointer('move', 10, 11 * HOUR_HEIGHT, 4));

      component['finishEventInteraction'](pointer('up', 10, 11 * HOUR_HEIGHT, 4), true);

      expect(emitted).toHaveLength(0);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());
    });
  });

  // ===========================================================================
  // RESIZE END
  // ===========================================================================

  describe('resize-end', () => {
    it('extends the event end time', () => {
      const event = {
        id: 'resize-end',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(
        pointer('down', 10, 10 * HOUR_HEIGHT, 10),
        target,
        'resize-end',
      );

      component['updateEventInteraction'](pointer('move', 10, 12 * HOUR_HEIGHT, 10));

      component['finishEventInteraction'](pointer('up', 10, 12 * HOUR_HEIGHT, 10), false);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T12:00:00').getTime());
    });

    it('clamps resize-end to 30 minutes', () => {
      const event = {
        id: 'resize-end-min',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(
        pointer('down', 10, 10 * HOUR_HEIGHT, 11),
        target,
        'resize-end',
      );

      /*
       * Pointer goes from 10:00 to 08:00.
       *
       * Candidate end = 08:00
       *
       * But:
       *
       * start + 30min = 09:30
       *
       * Therefore applyEventDelta() must clamp end to 09:30.
       */
      component['updateEventInteraction'](pointer('move', 10, 8 * HOUR_HEIGHT, 11));

      component['finishEventInteraction'](pointer('up', 10, 8 * HOUR_HEIGHT, 11), false);

      const updated = component.events[0];

      expect(updated.start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(updated.end?.getTime()).toBe(new Date('2026-08-19T09:30:00').getTime());
    });
  });

  // ===========================================================================
  // RESIZE START
  // ===========================================================================

  describe('resize-start', () => {
    it('moves the event start backward', () => {
      const event = {
        id: 'resize-start',
        start: new Date('2026-08-19T10:00:00'),
        end: new Date('2026-08-19T12:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(
        pointer('down', 10, 10 * HOUR_HEIGHT, 12),
        target,
        'resize-start',
      );

      component['updateEventInteraction'](pointer('move', 10, 8 * HOUR_HEIGHT, 12));

      component['finishEventInteraction'](pointer('up', 10, 8 * HOUR_HEIGHT, 12), false);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T08:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T12:00:00').getTime());
    });

    it('clamps resize-start to 30 minutes before the end', () => {
      const event = {
        id: 'resize-start-min',
        start: new Date('2026-08-19T10:00:00'),
        end: new Date('2026-08-19T12:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(
        pointer('down', 10, 10 * HOUR_HEIGHT, 13),
        target,
        'resize-start',
      );

      component['updateEventInteraction'](pointer('move', 10, 13 * HOUR_HEIGHT, 13));

      component['finishEventInteraction'](pointer('up', 10, 13 * HOUR_HEIGHT, 13), false);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T11:30:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T12:00:00').getTime());
    });
  });

  // ===========================================================================
  // applyEventDelta
  // ===========================================================================

  describe('applyEventDelta', () => {
    it('moves both start and end together', () => {
      const source = {
        id: 'move-domain',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:30:00'),
      };

      const result = component['applyEventDelta'](source, 'move', 1, 60);

      expect(result.start.getTime()).toBe(new Date('2026-08-20T10:00:00').getTime());

      expect(result.end?.getTime()).toBe(new Date('2026-08-20T11:30:00').getTime());
    });

    it('enforces the minimum duration when resizing the end', () => {
      const source = {
        id: 'resize-end-domain',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      const result = component['applyEventDelta'](source, 'resize-end', 0, -120);

      expect(result.start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(result.end?.getTime()).toBe(new Date('2026-08-19T09:30:00').getTime());
    });

    it('enforces the minimum duration when resizing the start', () => {
      const source = {
        id: 'resize-start-domain',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      const result = component['applyEventDelta'](source, 'resize-start', 0, 120);

      expect(result.start.getTime()).toBe(new Date('2026-08-19T09:30:00').getTime());

      expect(result.end?.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());
    });

    it('does not mutate the source event', () => {
      const source = {
        id: 'immutable',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      const originalStart = source.start.getTime();
      const originalEnd = source.end?.getTime();

      const result = component['applyEventDelta'](source, 'move', 0, 60);

      expect(source.start.getTime()).toBe(originalStart);
      expect(source.end?.getTime()).toBe(originalEnd);

      expect(result).not.toBe(source);
    });
  });

  // ===========================================================================
  // EVENT CHANGE
  // ===========================================================================

  describe('eventChange', () => {
    it('emits the changed event after a successful move', () => {
      const event = {
        id: 'emit',
        title: 'Meeting',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      let emitted: any;

      component.eventChange.subscribe((change) => {
        emitted = change;
      });

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 20), target);

      component['finishEventInteraction'](pointer('up', 10, 10 * HOUR_HEIGHT, 20), false);

      expect(emitted).toBeTruthy();
      expect(emitted.event.id).toBe('emit');

      expect(emitted.event.start.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());

      expect(emitted.event.end?.getTime()).toBe(new Date('2026-08-19T11:00:00').getTime());
    });

    it('updates the events collection after a successful interaction', () => {
      const event = {
        id: 'collection',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 21), target);

      component['finishEventInteraction'](pointer('up', 10, 11 * HOUR_HEIGHT, 21), false);

      expect(component.events).toHaveLength(1);

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T11:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T12:00:00').getTime());
    });
  });

  // ===========================================================================
  // INTERACTION STATE
  // ===========================================================================

  describe('interaction lifecycle', () => {
    it('clears interaction after finish', () => {
      const event = {
        id: 'interaction',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 30), target);

      expect(component['interaction']).toBeTruthy();

      component['finishEventInteraction'](pointer('up', 10, 9 * HOUR_HEIGHT, 30), false);

      expect(component['interaction']).toBeNull();
    });

    it('clears interaction after cancellation', () => {
      const event = {
        id: 'interaction-cancel',
        start: new Date('2026-08-19T09:00:00'),
        end: new Date('2026-08-19T10:00:00'),
      };

      fixture.componentRef.setInput('events', [event]);

      component.anchorDate.set(d('2026-08-19'));
      component.changeView('day');

      mockDayColumnGeometry();

      const target = component.weekDays[0].events[0];

      component.startTimedEventInteraction(pointer('down', 10, 9 * HOUR_HEIGHT, 31), target);

      expect(component['interaction']).toBeTruthy();

      component['finishEventInteraction'](pointer('up', 10, 11 * HOUR_HEIGHT, 31), true);

      expect(component['interaction']).toBeNull();

      expect(component.events[0].start.getTime()).toBe(new Date('2026-08-19T09:00:00').getTime());

      expect(component.events[0].end?.getTime()).toBe(new Date('2026-08-19T10:00:00').getTime());
    });
  });
});
