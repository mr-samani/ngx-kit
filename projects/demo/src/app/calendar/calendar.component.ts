import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getLocals, NgxCalendarComponent, provideDateAdapters } from 'ngx-kit/date-picker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxCalendarComponent],
  providers: [provideDateAdapters()],
})
export class CalendarComponent {
  locale: string = 'fa';

  availableLocals = getLocals();
}
