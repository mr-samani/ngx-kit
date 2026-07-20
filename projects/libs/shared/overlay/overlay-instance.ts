import { ComponentRef, EmbeddedViewRef, ApplicationRef } from '@angular/core';
import { OverlayAnchor } from './overlay-options';
import { PlacementConfig } from './placement-config';

export interface OverlayInstance {
  element: HTMLDialogElement;
  anchor: OverlayAnchor;
  placementConfig: PlacementConfig;

  componentRef?: ComponentRef<any>;
  embeddedView?: EmbeddedViewRef<any>;
  appRef?: ApplicationRef;
  onClosed?: () => void;

  rafId: number | null;
  focusTimeoutId: ReturnType<typeof setTimeout> | null;

  cleanup: () => void;
}
