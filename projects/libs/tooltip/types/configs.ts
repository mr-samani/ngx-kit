import type { NgxTooltipPlacement, NgxTooltipTrigger } from '../public-api';

const DEFAULT_OFFSET = 8;
const SHOW_DELAY = 80;
const HIDE_DELAY = 40;

export class NgxTooltipConfig {
  placement: NgxTooltipPlacement = 'bottom';
  offset: number = DEFAULT_OFFSET;
  delay: number = SHOW_DELAY;
  hideDelay: number = HIDE_DELAY;
  useHtml: boolean = false;
  usePopOver: boolean = true;
  trigger: NgxTooltipTrigger = 'hover';
 
}
