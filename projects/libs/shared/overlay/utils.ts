import { OverlayAnchor } from './overlay-options';

export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function isElementAnchor(anchor: OverlayAnchor): anchor is HTMLElement {
  return anchor instanceof HTMLElement;
}
