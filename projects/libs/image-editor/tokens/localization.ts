import { InjectionToken } from '@angular/core';

export const NGX_IMAGE_EDITOR_LOCALIZATION = new InjectionToken<NgxImageEditorLocalization>(
  'ngx-image-localization',
  {
    factory: () => DEFAULT_NGX_IMAGE_EDITOR_LOCALIZATION,
  },
);

export class NgxImageEditorLocalization {
  LoadingImage = 'Loading image…';
  Rotation = 'Fine rotation';
  Brightness = 'Brightness';
  Contrast = 'Contrast';
  Saturation = 'Saturation';
  Filter = 'Filter';
  None = 'None';
  Grayscale = 'Grayscale';
  Sepia = 'Sepia';
  Invert = 'Invert';
  Cartoon = 'Cartoon';
  Cancel = 'Cancel';
  Save = 'Save';
  Saving = 'Saving…';
  Reset = 'Reset';
}
export const DEFAULT_NGX_IMAGE_EDITOR_LOCALIZATION = new NgxImageEditorLocalization();
