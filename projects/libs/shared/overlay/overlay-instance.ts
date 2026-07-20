import { ComponentRef, EmbeddedViewRef, ApplicationRef } from '@angular/core';
import { PlacementConfig } from './placement-config';
import { Point } from './overlay-options';

export interface OverlayInstance {
  element: HTMLDialogElement;
  anchor: HTMLElement;
  point?: Point;
  placementConfig: PlacementConfig;

  componentRef?: ComponentRef<any>;
  embeddedView?: EmbeddedViewRef<any>;
  appRef?: ApplicationRef;
  onClosed?: () => void;

  rafId: number | null;
  focusTimeoutId: ReturnType<typeof setTimeout> | null;

  cleanup: () => void;
}
