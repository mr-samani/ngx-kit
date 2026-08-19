import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxCalendarComponent } from '../components/calendar/ngx-calendar.component';
import { provideDateAdapters } from '../provide-date-adapters';

const d = (value: string) => new Date(`${value}T12:00:00`);

describe('NgxCalendarComponent calendar navigation and views', () => {
  let fixture: ComponentFixture<NgxCalendarComponent>;
  let component: NgxCalendarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxCalendarComponent],
      providers: [...provideDateAdapters()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxCalendarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('locale', 'en');
    fixture.componentRef.setInput('events', []);
    fixture.detectChanges();
  });

  it('shows the seven real dates of the active week', () => {
    component.anchorDate = d('2026-08-19'); // Wednesday
    component.changeView('week');

    expect(component.weekDays).toHaveLength(7);
    expect(component.weekDays[0].date.getDay()).toBe(0);
    expect(component.weekDays[6].date.getDay()).toBe(6);
    expect(component.headerText).toContain('August');
    expect(component.headerText).toContain('2026');
  });

  it('uses the selected day, not the week start, in day view', () => {
    component.anchorDate = d('2026-08-19');
    component.changeView('day');

    expect(component.weekDays).toHaveLength(1);
    expect(component.weekDays[0].date.getDate()).toBe(19);
    expect(component.headerText).toContain('19');
  });

  it('renders timed events in week view', () => {
    fixture.componentRef.setInput('events', [
      {
        id: 'meeting',
        title: 'Meeting',
        start: d('2026-08-19'),
        end: new Date('2026-08-19T14:30:00'),
      },
    ]);
    component.anchorDate = d('2026-08-19');
    component.changeView('week');

    const day = component.weekDays.find((x) => x.date.getDate() === 19)!;
    expect(day.events).toHaveLength(1);
    expect(day.events[0].top).toBeGreaterThanOrEqual(0);
    expect(day.events[0].height).toBeGreaterThan(0);
  });

  it('renders timed events in day view', () => {
    fixture.componentRef.setInput('events', [
      {
        id: 'meeting',
        title: 'Meeting',
        start: new Date('2026-08-19T09:30:00'),
        end: new Date('2026-08-19T11:00:00'),
      },
    ]);
    component.anchorDate = d('2026-08-19');
    component.changeView('day');

    expect(component.weekDays).toHaveLength(1);
    expect(component.weekDays[0].events).toHaveLength(1);
    expect(component.weekDays[0].events[0].top).toBe(9.5 * 64);
    expect(component.weekDays[0].events[0].height).toBe(1.5 * 64);
  });

  it('renders all-day events in the all-day lane', () => {
    fixture.componentRef.setInput('events', [
      {
        id: 'holiday',
        title: 'Holiday',
        start: d('2026-08-18'),
        end: d('2026-08-20'),
        allDay: true,
      },
    ]);
    component.anchorDate = d('2026-08-19');
    component.changeView('day');

    expect(component.allDayByColumn[0]).toHaveLength(1);
    expect(component.weekDays[0].events).toHaveLength(0);
  });

  it('moves one week at a time in week view', () => {
    component.anchorDate = d('2026-08-19');
    component.changeView('week');
    component.next();

    expect(component.anchorDate.getDate()).toBe(26);
    expect(component.headerText).toContain('August');

    component.previous();
    expect(component.anchorDate.getDate()).toBe(19);
  });

  it('moves one day at a time in day view', () => {
    component.anchorDate = d('2026-08-19');
    component.changeView('day');
    component.next();

    expect(component.anchorDate.getDate()).toBe(20);
    expect(component.weekDays[0].date.getDate()).toBe(20);

    component.previous();
    expect(component.anchorDate.getDate()).toBe(19);
  });

  it('moves one calendar month at a time in month view', () => {
    component.anchorDate = d('2026-08-19');
    component.changeView('month');
    component.next();

    expect(component.currMonth).toBe(8);
    expect(component.currYear).toBe(2026);

    component.previous();
    expect(component.currMonth).toBe(7);
  });

  it('keeps overlapping events visible instead of painting them over one another', () => {
    fixture.componentRef.setInput('events', [
      { id: 1, title: 'A', start: new Date('2026-08-19T09:00:00'), end: new Date('2026-08-19T11:00:00') },
      { id: 2, title: 'B', start: new Date('2026-08-19T10:00:00'), end: new Date('2026-08-19T12:00:00') },
    ]);

    component.anchorDate = d('2026-08-19');
    component.changeView('day');

    expect(component.weekDays[0].events).toHaveLength(2);
    expect(component.weekDays[0].events[0].columnCount).toBeGreaterThan(1);
    expect(component.weekDays[0].events[1].columnCount).toBeGreaterThan(1);
  });
});
