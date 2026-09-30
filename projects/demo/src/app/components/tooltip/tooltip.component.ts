import { CommonModule } from '@angular/common';
import { Component, EventEmitter, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';
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
  ];

  tooltipContent = model('Test tooltip');

  placements: NgxTooltipPlacement[] = ['top', 'bottom', 'left', 'right'];
  placement = model<NgxTooltipPlacement>('top');
  offset = model<number>(8);
  delay = model<number>(80);
  hideDelay = model<number>(40);
  useHtml = model<boolean>(false);
  usePopOver = model<boolean>(true);
  trigger = model<NgxTooltipTrigger>('hover');
  triggers: NgxTooltipTrigger[] = ['hover', 'focus', 'hover-focus'];
}
