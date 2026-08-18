import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getLocals,
  NgxCalendarComponent,
  provideDateAdapters,
  type MsEvents,
} from 'ngx-kit/date-picker';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

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
  theme: 'auto' | 'dark' | 'light' = 'auto';

  availableLocals = getLocals();

  today = new Date();
  myEvents: MsEvents[] = [
    {
      start: this.today,
      end: new Date(
        `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate() + 15}`,
      ),
      color: '#23ef78',
      title: 'this is today',
      allDay: true,
    },
    {
      start: this.today,
      end: new Date(
        `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate() + 5}`,
      ),
      color: '#ef8923',
      title: 'this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title this is a long title ',
      allDay: true,
    },
  ];

  ngOnInit(): void {
    console.log(this.myEvents);
  }
}
