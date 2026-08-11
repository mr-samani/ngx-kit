import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '@demo/shared/services/dark-mode.service';
import { DirectionService } from '@demo/shared/services/direction.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected darkMode = inject(DarkModeService);
  protected direction = inject(DirectionService);
}
