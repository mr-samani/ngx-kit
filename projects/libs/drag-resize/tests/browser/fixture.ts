import { chromium, type Browser, type Page } from 'playwright-core';
import { afterAll, beforeAll } from 'vitest';
import { bundleHarness } from './build.mjs';

const CHROME =
  process.env['CHROMIUM_PATH'] ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

let browser: Browser;
let code: string;

export const BASE_CSS = `
  body{margin:0;font:14px sans-serif}
  .it{box-sizing:border-box;height:40px;border-bottom:1px solid #999;background:#eef}
  [data-list]{position:absolute;box-sizing:border-box}
`;

export function useBrowser() {
  beforeAll(async () => {
    code = await bundleHarness();
    browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  });
  afterAll(async () => {
    await browser?.close();
  });
}

/** Runs `fn` inside a fresh page that contains `html` and the bundled library harness (`H`). */
export async function run<R, A = undefined>(
  html: string,
  fn: (H: any, arg: A) => R | Promise<R>,
  arg?: A,
  opts: { css?: string; width?: number; height?: number } = {},
): Promise<R> {
  const page: Page = await browser.newPage({ viewport: { width: opts.width ?? 900, height: opts.height ?? 700 } });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.addInitScript('window.__name = (f) => f;');
    await page.setContent(`<style>${BASE_CSS}${opts.css ?? ''}</style>${html}`);
    await page.addScriptTag({ content: code });
    const result = await page.evaluate(
      async ({ src, a }) => {
        const f = (0, eval)(`(${src})`);
        return f((window as any).H, a);
      },
      { src: fn.toString(), a: arg },
    );
    if (errors.length) throw new Error('page errors: ' + errors.join(' | '));
    return result as R;
  } finally {
    await page.close();
  }
}

/** Items `A`,`B`,... as `.it` divs. */
export const items = (ids: string, cls = 'it', extra = '') =>
  ids
    .split('')
    .map((c) => `<div class="${cls}" data-item data-id="${c}" ${extra}>${c}</div>`)
    .join('');
