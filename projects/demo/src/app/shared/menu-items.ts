import { ICategory } from './interfaces/ICategory';

export const MENU_LIST: ICategory[] = [
  {
    name: 'Feedback & Overlay',
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
      {
        title: 'Tooltip',
        url: '/components/tooltip',
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
    ],
  },
  {
    name: 'Color & Styling',
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
        imageDark: 'preview/shadow-dark.png',
        imageLight: 'preview/shadow-light.png',
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
    name: 'Data Display',
    items: [
      {
        title: 'Table With Paginator',
        url: '/components/table',
        imageDark: 'preview/table-dark.png',
        imageLight: 'preview/table-light.png',
      },
      {
        title: 'Tree List',
        description:
          'Filters a hierarchical tree while preserving the branches that contain matching nodes.',
        url: '/components/tree-list',
      },
    ],
  },
  {
    name: 'Drag, Drop & Interaction',
    items: [
      {
        title: 'Drag and Resize',
        url: '/components/drag-resize',
        fragments: [
          {
            id: 'overview',
            title: 'Overview',
            description: 'Explore drag and resize capabilities.',
            icon: '✦',
          },
          {
            id: 'drag',
            title: 'Basic Drag',
            description: 'Simple draggable elements.',
            icon: '✥',
          },
          {
            id: 'resize',
            title: 'Basic Resize',
            description: 'Resize elements from every direction.',
            icon: '↗',
          },
          {
            id: 'combined',
            title: 'Drag + Resize',
            description: 'Move and resize simultaneously.',
            icon: '⤢',
          },
          {
            id: 'positions',
            title: 'Position Modes',
            description: 'Static, relative, absolute and fixed.',
            icon: '▣',
          },
          {
            id: 'boundary',
            title: 'Boundary',
            description: 'Keep elements inside a container.',
            icon: '□',
          },
          {
            id: 'handle',
            title: 'Drag Handle',
            description: 'Drag using a dedicated handle.',
            icon: '☷',
          },
          {
            id: 'scroll',
            title: 'Scrolling',
            description: 'Drag inside scrollable containers.',
            icon: '↕',
          },
          {
            id: 'rtl',
            title: 'RTL / LTR',
            description: 'Bidirectional layouts.',
            icon: '⇄',
          },
          {
            id: 'multiple',
            title: 'Multiple Elements',
            description: 'Real-world dashboard layout.',
            icon: '▦',
          },
          {
            id: 'resizepan',
            title: 'Resize Pan',
            description: 'Resize side pan.',
            icon: '🔛',
          },
          {
            id: 'interaction',
            title: 'Interaction',
            description: 'Enable interaction with child of draggable items.',
            icon: '✦',
          },
        ],
      },
      {
        title: 'Drop List',
        url: '/components/drop-list',
        children: [
          {
            url: '/components/drop-list/sort-list',
            title: 'Sort List',
          },
          {
            url: '/components/drop-list/kanban',
            title: 'Kanban View',
          },
          {
            url: '/components/drop-list/horizontal-list',
            title: 'Horizontal List',
          },
          {
            url: '/components/drop-list/copy-to-zone',
            title: 'Copy to Zone',
          },
          {
            url: '/components/drop-list/copy-to-iframe',
            title: 'Copy to Iframe',
          },
          {
            url: '/components/drop-list/nested-tree-sort',
            title: 'Nested Tree',
          },
          {
            url: '/components/drop-list/dynamic-html',
            title: 'Dynamic HTML Elements',
          },
        ],
      },
    ],
  },
  {
    name: 'Scrolling & Navigation',
    items: [
      {
        title: 'Virtual Scroll',
        url: '/components/virtual-scroll',
      },
      {
        title: 'Infinite Scroll',
        url: '/components/infinite-scroll',
      },
      {
        title: 'Menu',
        url: '/components/menu',
        imageDark: 'preview/menu-dark.png',
        imageLight: 'preview/menu-light.png',
      },
    ],
  },
  {
    name: 'Media',
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
        url: '/components/image-viewer',
        imageDark: 'preview/image-viewer-dark.png',
        imageLight: 'preview/image-viewer-light.png',
      },
      {
        title: 'Media Control',
        url: '/components/media-control',
      },
    ],
  },
  {
    name: 'Layout',
    items: [
      {
        title: 'Grid Layout',
        description: 'Grid layout with resizable and draggable widgets.',
        url: '/components/grid-layout',
      },
      {
        title: 'Drawer Menu',
        url: '/components/drawer-menu',
      },
    ],
  },
  {
    name: 'Internationalization',
    items: [
      {
        title: 'I18n',
        url: '/components/i18n',
      },
    ],
  },
];
