import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Locale, NgxCalendarComponent } from 'ngx-kit/date-picker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxCalendarComponent],
})
export class CalendarComponent {
  locale: Locale = 'fa';
}
