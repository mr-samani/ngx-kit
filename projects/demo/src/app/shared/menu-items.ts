import { ICategory } from './interfaces/ICategory';

export const MENU_LIST: ICategory[] = [
  {
    name: 'Message & Dialog & Notify',
    items: [
      {
        title: 'Message',

        url: '/components/message',
      },
      {
        title: 'Notify',

        url: '/components/notify',
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
      },
      {
        title: 'Calendar',

        url: '/components/calendar',
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
      },
      {
        title: 'Gradient Picker',

        url: '/components/gradient-picker',
      },
      {
        title: 'Box Shadow',

        url: '/components/box-shadow',
      },
      {
        title: 'Angle Selector',

        url: '/components/angle-selector',
      },
    ],
  },
  {
    name: 'Table',
    items: [
      {
        title: 'Table With Paginator',

        url: '/components/table',
      },
    ],
  },
  {
    name: 'Media & Layout',
    items: [
      {
        title: 'Dropzone',

        url: '/components/dropzone',
      },
      {
        title: 'Image Editor',

        url: '/components/image-editor',
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
      },
    ],
  },
];
