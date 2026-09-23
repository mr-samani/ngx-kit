export interface NgxImageViewerItem {
  src: string;
  alt?: string;
  caption?: string;
  downloadFileName?: string;
}


export interface NgxImageViewerToolbarConfig {
  prevNext?: boolean;
  counter?: boolean;
  zoomIn?: boolean;
  zoomOut?: boolean;
  resetZoom?: boolean;
  rotateLeft?: boolean;
  rotateRight?: boolean;
  download?: boolean;
  print?: boolean;
  fullscreen?: boolean;
  close?: boolean;
}

export const NGX_IMAGE_VIEWER_DEFAULT_TOOLBAR: Required<NgxImageViewerToolbarConfig> = {
  prevNext: true,
  counter: true,
  zoomIn: true,
  zoomOut: true,
  resetZoom: true,
  rotateLeft: true,
  rotateRight: true,
  download: true,
  print: true,
  fullscreen: true,
  close: false,
};
