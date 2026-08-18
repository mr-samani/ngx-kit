import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getLocals, NgxCalendarComponent, provideDateAdapters } from 'ngx-kit/date-picker';
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
export class CalendarComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: '/examples/calendar/calendar.component.ts', language: 'typescript' },
    { label: 'HTML', path: '/examples/calendar/calendar.component.html', language: 'html' },
  ];

  locale: string = 'fa';
  theme: 'auto' | 'dark' | 'light' = 'auto';

  availableLocals = getLocals();
}
