import { Component, signal } from '@angular/core';
import { NgxMenuModule } from 'ngx-kit/menu';
import { Notify } from 'ngx-kit/notify';
import { ExampleShowcaseComponent } from '../../shared/showcase/example-showcase.component';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-menu',
  imports: [NgxMenuModule, ExampleShowcaseComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/menu/menu.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/menu/menu.component.html', language: 'html' },
    { label: 'SCSS', path: 'examples/menu/menu.component.scss', language: 'scss' },
  ];

  protected readonly lastAction = signal('Choose an item to see its action.');

  action(act: string): void {
    this.lastAction.set(`Action selected: ${act}`);
    Notify.info(`Clicked on "${act}"!`);
  }
}
