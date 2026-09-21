import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
export async function bundleHarness() {
  const res = await build({
    entryPoints: [path.join(here, 'harness.ts')],
    bundle: true, write: false, format: 'iife', globalName: 'H', platform: 'browser', target: 'es2022',
    tsconfigRaw: { compilerOptions: { experimentalDecorators: true, useDefineForClassFields: false } },
    define: { ngDevMode: 'true', ngJitMode: 'true' },
    logLevel: 'error',
  });
  return res.outputFiles[0].text;
}
