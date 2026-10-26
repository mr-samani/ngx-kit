#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const val = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };

if (flag('help') || flag('h')) {
  console.log(`ngx-lazy-i18n-extract [--config i18n.config.json] [--check] [--remove] [--langs fa,en] [--output dir] [--input src,libs]
  --check    do not write; exit 1 if keys are missing from the files (CI)
  --remove   delete keys that are no longer used in the source`);
  process.exit(0);
}

const cfgPath = path.resolve(val('config') ?? 'i18n.config.json');
let cfg = {};
if (fs.existsSync(cfgPath)) {
  cfg = cfgPath.endsWith('.json') ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : (await import(pathToFileURL(cfgPath).href)).default;
}
const options = {
  input: ['src'], output: 'src/assets/i18n', langs: ['en'], ...cfg,
  ...(val('langs') && { langs: val('langs').split(',') }),
  ...(val('output') && { output: val('output') }),
  ...(val('input') && { input: val('input').split(',') }),
  ...(flag('check') && { check: true }),
  ...(flag('remove') && { remove: true }),
};

const here = path.dirname(new URL(import.meta.url).pathname);
const { run } = await import(pathToFileURL(path.resolve(here, '../tools/extractor.mjs')).href);
const rep = run(options);

console.log(`Scanned ${rep.files} files${rep.dynamic ? ` (${rep.dynamic} dynamic key expressions skipped; use "// tr-keys: a.b" to declare them)` : ''}`);
for (const [scope, s] of Object.entries(rep.scopes)) {
  console.log(`\n• ${scope}: ${s.keys} keys`);
  for (const lang of options.langs) {
    console.log(`    ${lang}: +${s.added[lang].length} new, ${s.unused[lang].length} unused${options.remove ? ' (removed)' : ''}, ${s.empty[lang]} untranslated`);
    if (options.check) s.added[lang].slice(0, 20).forEach((k) => console.log(`      missing: ${k}`));
  }
}
if (!options.check) rep.written.forEach((f) => console.log(`wrote ${path.relative(process.cwd(), f)}`));
if (options.check && !rep.ok) { console.error('\ni18n check failed: run the extractor and commit the result.'); process.exit(1); }
