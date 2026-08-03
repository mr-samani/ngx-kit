// 'None' | 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';
export const ICONS: { [key: string]: string } = {
  None: '',
  success: `<svg viewBox="0 0 46 46"><path class="draw" d="M12 24 L20 32 L34 15"/></svg>`,
  error: `<svg viewBox="0 0 46 46"><path class="draw" d="M14 14 L32 32"/><path class="draw" style="animation-delay:.55s" d="M32 14 L14 32"/></svg>`,
  warning: `<svg viewBox="0 0 46 46"><path class="draw" d="M23 10 L23 26"/><circle class="dot-mark" cx="23" cy="34" r="3.4"/></svg>`,
  info: `<svg viewBox="0 0 46 46"><circle class="dot-mark" cx="23" cy="12" r="3.2" style="animation-delay:.28s"/><path class="draw" style="animation-delay:.4s" d="M23 20 L23 36"/></svg>`,
  question: `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M204.3 32.01H96c-52.94 0-96 43.06-96 96c0 17.67 14.31 31.1 32 31.1s32-14.32 32-31.1c0-17.64 14.34-32 32-32h108.3C232.8 96.01 256 119.2 256 147.8c0 19.72-10.97 37.47-30.5 47.33L127.8 252.4C117.1 258.2 112 268.7 112 280v40c0 17.67 14.31 31.99 32 31.99s32-14.32 32-31.99V298.3L256 251.3c39.47-19.75 64-59.42 64-103.5C320 83.95 268.1 32.01 204.3 32.01zM144 400c-22.09 0-40 17.91-40 40s17.91 39.1 40 39.1s40-17.9 40-39.1S166.1 400 144 400z"/></svg>`,
  loading: `<div class="spinner-wrap"><div class="spinner"></div></div>`,
};
