import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CalendarEventChange,
  getLocals,
  MsEvents,
  NgxCalendarComponent,
  provideDateAdapters,
} from 'ngx-kit/date-picker';
import { ISelectedEvent } from 'ngx-kit/date-picker/models/selected-event';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  imports: [CommonModule, FormsModule, NgxCalendarComponent, ExampleShowcaseComponent],
  providers: [provideDateAdapters()],
})
export class CalendarComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/calendar/calendar.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/calendar/calendar.component.html', language: 'html' },
  ];

  locale = 'en';
  availableLocals = getLocals();
 
  readonly today = new Date();
  readonly selectedEvent = signal('Select an event to see its details.');
  readonly calendarStatus = signal('Drag or resize an event to try calendar interactions.');

  events: MsEvents[] = [
    {
      id: 1,
      start: this.atOffset(0, 9),
      end: this.atOffset(0, 10),
      color: '#635bff',
      title: 'Design review',
    },
    {
      id: 2,
      start: this.atOffset(1, 0),
      end: this.atOffset(2, 0),
      color: '#18a66a',
      title: 'Planning day',
      allDay: true,
    },
    {
      id: 3,
      start: this.atOffset(2, 14),
      color: '#e99b25',
      title: 'Project check-in',
    },
    {
      id: 4,
      start: this.atOffset(4, 11),
      end: this.atOffset(4, 12),
      color: '#ef5da8',
      title: 'Team sync',
    },
  ];

  addEvent(): void {
    const id = Math.max(0, ...this.events.map((event) => Number(event.id) || 0)) + 1;
    this.events = [
      ...this.events,
      {
        id,
        start: this.atOffset(id % 6, 13),
        end: this.atOffset(id % 6, 14),
        color: '#4285f4',
        title: `New event ${id}`,
      },
    ];
    this.calendarStatus.set(`Added New event ${id}.`);
  }

  resetEvents(): void {
    this.events = this.events.filter((event) => Number(event.id) <= 4);
    this.calendarStatus.set('Sample events restored.');
    this.selectedEvent.set('Select an event to see its details.');
  }

  onSelectEvent(selection: ISelectedEvent): void {
    const title = selection.event.title || 'Untitled event';
    this.selectedEvent.set(`${title} · ${selection.date.toLocaleDateString(this.locale)}`);
  }

  onEventChange(change: CalendarEventChange): void {
    this.events = this.events.map((event) => (event.id === change.event.id ? change.event : event));
    this.calendarStatus.set('Event updated. The calendar reflects its new time or duration.');
  }

  private atOffset(dayOffset: number, hour: number): Date {
    const date = new Date(this.today);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);
    return date;
  }
}
