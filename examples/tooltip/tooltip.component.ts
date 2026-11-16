import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ExampleShowcaseComponent } from '../../shared/showcase/example-showcase.component';
import { ExampleSourceFile } from '../../shared/showcase/example-showcase.component';
import { NgxTooltip, type NgxTooltipPlacement, type NgxTooltipTrigger } from 'ngx-kit/tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxTooltip, FormsModule, ExampleShowcaseComponent],
})
export class TooltipComponent {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/tooltip/tooltip.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/tooltip/tooltip.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/tooltip/tooltip.component.scss',
      language: 'scss',
    },
  ];

  tooltipContent = model('Helpful context appears here.');

  placements: NgxTooltipPlacement[] = ['top', 'bottom', 'left', 'right'];
  placement = model<NgxTooltipPlacement>('bottom');
  offset = model<number>(8);
  delay = model<number>(150);
  hideDelay = model<number>(100);
  useHtml = model<boolean>(false);
  usePopOver = model<boolean>(true);
  trigger = model<NgxTooltipTrigger>('hover');
  triggers: NgxTooltipTrigger[] = ['hover', 'focus', 'hover-focus'];
  flip = model(true);
  shift = model(true);
}
