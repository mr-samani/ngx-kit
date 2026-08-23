import { ICategory } from './interfaces/ICategory';

export const MENU_LIST: ICategory[] = [
  {
    name: 'Message & Dialog & Notify',
    items: [
      {
        title: 'Message',
        url: '/components/message',
        imageDark: 'preview/message-dark.png',
        imageLight: 'preview/message-light.png',
      },
      {
        title: 'Notify',
        url: '/components/notify',
        imageDark: 'preview/notify-dark.png',
        imageLight: 'preview/notify-light.png',
      },
      {
        title: 'Dialog',
        url: '/components/dialog',
      },
    ],
  },
  {
    name: 'Form Controls',
    items: [
      {
        title: 'Date Picker',
        url: '/components/date-picker',
        imageDark: 'preview/datepicker-dark.png',
        imageLight: 'preview/datepicker-light.png',
      },
      {
        title: 'Time Picker',
        url: '/components/time-picker',
        imageDark: 'preview/timepicker-dark.png',
        imageLight: 'preview/timepicker-light.png',
      },
      {
        title: 'Calendar',
        url: '/components/calendar',
        imageDark: 'preview/calendar-dark.png',
        imageLight: 'preview/calendar-light.png',
      },
      {
        title: 'form-field',
        url: '/components/form-field',
      },
    ],
  },
  {
    name: 'Design Controls',
    items: [
      {
        title: 'Color Picker',
        url: '/components/color-picker',
        imageDark: 'preview/color-picker-dark.png',
        imageLight: 'preview/color-picker-light.png',
      },
      {
        title: 'Gradient Picker',
        url: '/components/gradient-picker',
        imageDark: 'preview/gradient-picker-dark.png',
        imageLight: 'preview/gradient-picker-light.png',
      },
      {
        title: 'Box Shadow',
        url: '/components/box-shadow',
      },
      {
        title: 'Angle Selector',
        url: '/components/angle-selector',
        imageDark: 'preview/angle-selector-dark.png',
        imageLight: 'preview/angle-selector-light.png',
      },
    ],
  },
  {
    name: 'Table',
    items: [
      {
        title: 'Table With Paginator',
        url: '/components/table',
        imageDark: 'preview/table-dark.png',
        imageLight: 'preview/table-light.png',
      },
    ],
  },
  {
    name: 'Media & Layout',
    items: [
      {
        title: 'Dropzone',
        url: '/components/dropzone',
        imageDark: 'preview/drop-zone-dark.png',
        imageLight: 'preview/drop-zone-light.png',
      },
      {
        title: 'Image Editor',
        url: '/components/image-editor',
        imageDark: 'preview/image-editor-dark.png',
        imageLight: 'preview/image-editor-light.png',
      },
      {
        title: 'Image Viewer',
        url: '/components/gallery',
      },
      {
        title: 'Drawer Menu',
        url: '/components/drawer-menu',
      },
    ],
  },
  {
    name: 'Others',
    items: [
      {
        title: 'Menu',
        url: '/components/menu',
        imageDark: 'preview/menu-dark.png',
        imageLight: 'preview/menu-light.png',
      },
    ],
  },
];
