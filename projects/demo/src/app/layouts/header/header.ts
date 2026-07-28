import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DarkModeService } from '@demo/shared/services/dark-mode.service';
import { ComponentsRoutingModule } from '../../components/components-routing-module';
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, ComponentsRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected doc = inject(DOCUMENT);
  public darkMode = inject(DarkModeService);
  isRtl = signal(false);

  constructor() {
    const dir = document.documentElement.getAttribute('dir') || 'ltr';
    this.isRtl.update((u) => (u = dir == 'rtl' ? true : false));
  }

  toggleDirection() {
    this.isRtl.update((u) => !u);
    document.documentElement.setAttribute('dir', this.isRtl() ? 'rtl' : 'ltr');
  }
}
