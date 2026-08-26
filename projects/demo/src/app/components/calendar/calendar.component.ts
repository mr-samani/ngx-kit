import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getLocals,
  NgxCalendarComponent,
  provideDateAdapters,
  type CalendarEventChange,
  type MsEvents,
} from 'ngx-kit/date-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
import type { ISelectedEvent } from 'ngx-kit/date-picker/models/selected-event';
import { MSG } from 'ngx-kit/message';
import { Notify } from 'ngx-kit/notify';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxCalendarComponent, ExampleShowcaseComponent],
  providers: [provideDateAdapters()],
})
export class CalendarComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/calendar/calendar.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/calendar/calendar.component.html', language: 'html' },
  ];

  locale: string = 'fa';
  availableLocals = getLocals();

  today = new Date();
  myEvents: MsEvents[] = [
    {
      id: 1,
      start: this.today,
      end: new Date(
        `${this.today.getFullYear()}-${this.today.getMonth() + 2}-${this.today.getDate() + 3}`,
      ),
      color: '#23ef78',
      title: 'this is today',
      allDay: true,
    },
    {
      id: 2,
      start: this.today,
      end: new Date(
        `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate() + 5}`,
      ),
      color: '#ef8923',
      title:
        'this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title ',
      allDay: true,
    },
    {
      id: 3,
      start: this.today,
      end: new Date(
        `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate() + 4}`,
      ),
      color: '#4f23ef',
      title: 'my events',
      allDay: true,
    },
    {
      id: 4,
      start: this.today,
      title: 'today 1',
    },
    {
      id: 5,
      start: this.today,
      title: 'today 2',
    },
    {
      id: 6,
      start: this.today,
      title: 'today 3',
    },
  ];

  ngOnInit(): void {
    console.log('myEvents', this.myEvents);
  }

  onSelectEvent(ev: ISelectedEvent) {
    MSG.fire({ title: ev.event.title ?? '', text: ev.date.toISOString() });
  }

  onEventChange(ev: CalendarEventChange) {
    Notify.info('Event Changed.');
  }
}
