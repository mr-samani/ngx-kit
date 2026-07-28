import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DarkModeService } from '@demo/shared/services/dark-mode.service';
import { ComponentsRoutingModule } from '../../components/components-routing.module';
import { IsRtl } from 'ngx-kit/shared/utils/is-rtl';
import { DirectionService } from '@demo/shared/services/direction.service';
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, ComponentsRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected doc = inject(DOCUMENT);
  public darkMode = inject(DarkModeService);
  public direction = inject(DirectionService);

  constructor() {}
}
