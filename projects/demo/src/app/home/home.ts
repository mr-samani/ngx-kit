import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICategory } from '@demo/shared/interfaces/ICategory';
import { MENU_LIST } from '@demo/shared/menu-items';
import { PreviewCardComponent } from '@demo/shared/preview-card/preview-card.component';
import { DarkModeService } from '@demo/shared/services/dark-mode.service';

const ICONS: Record<string, string> = {
  Menu: '☰',
  'Color Picker': '🎨',
  'Gradient Picker': '🌈',
  'Box Shadow': '🔲',
  'Angle Selector': '📐',
  'Date Picker': '📅',
  Calendar: '📆',
  'Data Table': '📊',
  'Table With Paginator': '📊',
  Dialog: '🗔',
  Message: '💬',
  Notify: '🔔',
  Dropzone: '📥',
  'Image Editor': '🖼️',
  'Image Viewer': '🔍',
  'Drawer Menu': '📑',
};

@Component({
  selector: 'app-home',
  imports: [RouterModule, PreviewCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly list: ICategory[] = MENU_LIST;
  protected readonly darkMode = inject(DarkModeService);
  readonly isDarkMode = computed(() => this.darkMode.isDarkMode());

  protected iconFor(title: string): string {
    return ICONS[title] ?? '◆';
  }
}
