// ngx-lazy-i18n key extractor. Dependency-free, regex/scanner based (no Angular compiler needed).
import fs from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.angular', 'coverage']);
const LITERAL = /^(['"`])((?:(?!\1)[^\\\n])*)\1$/;

/** Returns the text of the first argument of a call whose "(" is at `open`, or null. */
function firstArg(text, open) {
  let depth = 0, quote = null, i = open + 1;
  const start = i;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (depth === 0) return text.slice(start, i); depth--; }
    else if (c === ',' && depth === 0) return text.slice(start, i);
  }
  return null;
}

/** String literal(s) of an expression: 'a'  |  cond ? 'a' : 'b'. Returns { keys, dynamic }. */
function literals(arg) {
  const a = arg.trim();
  let m = LITERAL.exec(a);
  if (m) return m[1] === '`' && m[2].includes('${') ? { keys: [], dynamic: true } : { keys: [m[2]], dynamic: false };
  m = /\?\s*(['"`])((?:(?!\1)[^\\\n])+)\1\s*:\s*(['"`])((?:(?!\3)[^\\\n])+)\3\s*$/.exec(a);
  if (m && !m[2].includes('${') && !m[4].includes('${')) return { keys: [m[2], m[4]], dynamic: false };
  return { keys: [], dynamic: true };
}

const join = (prefix, key) => (prefix ? `${prefix}.${key}` : key);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Scan one file's text. Returns { keys: string[], dynamic: number }.
 * Recognised:
 *   'a.b' | tr            (cond ? 'a' : 'b') | tr
 *   *tr="let t; prefix: 'p'"  + t('x') calls that follow it
 *   trKey="a.b"   [trKey]="'a.b'"   (+ trPrefix on the same tag)
 *   .t('a') .select('a') .has('a') .getObject('a')   translateSignal('a')   marker('a')
 *   // tr-keys: a.b, c.d      <!-- tr-keys(prefix): a, b -->
 */
export function scanText(text) {
  const keys = new Set();
  let dynamic = 0;
  const add = (k, prefix = '') => { if (k) keys.add(join(prefix, k)); };

  for (const m of text.matchAll(/(['"`])((?:(?!\1)[^\\\n$])+)\1\s*\|\s*tr\b/g)) add(m[2]);
  for (const m of text.matchAll(/\?\s*(['"`])((?:(?!\1)[^\\\n$])+)\1\s*:\s*(['"`])((?:(?!\3)[^\\\n$])+)\3\s*\)?\s*\|\s*tr\b/g)) { add(m[2]); add(m[4]); }

  // structural directive + t() calls
  const dirs = [];
  for (const m of text.matchAll(/\*tr\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    const v = m[1] ?? m[2];
    const name = /let\s+([\w$]+)/.exec(v)?.[1];
    const prefix = /prefix\s*:\s*(['"`])(.*?)\1/.exec(v)?.[2] ?? '';
    if (name) dirs.push({ idx: m.index, name, prefix });
  }
  for (const name of new Set(dirs.map((d) => d.name))) {
    const re = new RegExp(`(?<![\\w$.])${esc(name)}\\(`, 'g');
    for (const m of text.matchAll(re)) {
      const owner = [...dirs].reverse().find((d) => d.name === name && d.idx < m.index);
      if (!owner) continue;
      const arg = firstArg(text, m.index + m[0].length - 1);
      if (arg === null) continue;
      const r = literals(arg);
      if (r.dynamic) dynamic++;
      r.keys.forEach((k) => add(k, owner.prefix));
    }
  }

  // [trKey] / trKey attributes
  for (const m of text.matchAll(/\btrKey\s*=\s*"([^"]*)"|\[trKey\]\s*=\s*"([^"]*)"/g)) {
    const tagStart = text.lastIndexOf('<', m.index);
    const tagEnd = text.indexOf('>', m.index);
    const tag = text.slice(tagStart < 0 ? 0 : tagStart, tagEnd < 0 ? text.length : tagEnd);
    const prefix = /\btrPrefix\s*=\s*"([^"]*)"/.exec(tag)?.[1] ?? '';
    if (m[1] !== undefined) add(m[1].trim(), prefix);
    else { const r = literals(m[2]); if (r.dynamic) dynamic++; r.keys.forEach((k) => add(k, prefix)); }
  }

  // service / helper calls
  for (const m of text.matchAll(/(?:\.(?:t|select|has|getObject|instant)|\b(?:translateSignal|marker))\s*\(/g)) {
    const arg = firstArg(text, m.index + m[0].length - 1);
    if (arg === null || !arg.trim()) continue;
    const r = literals(arg);
    if (r.dynamic) dynamic++;
    r.keys.forEach((k) => add(k));
  }

  // comment markers
  for (const m of text.matchAll(/tr-keys(?:\(([^)]*)\))?\s*:\s*([^\n]*?)(?:-->|\*\/|\n|$)/g)) {
    for (const k of m[2].split(',').map((s) => s.trim()).filter(Boolean)) add(k, (m[1] ?? '').trim());
  }
  return { keys: [...keys], dynamic };
}

export function flattenObj(obj, out = {}, prefix = '') {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') flattenObj(v, out, key);
    else if (v != null) out[key] = String(v);
  }
  return out;
}

export function unflattenObj(flat) {
  const root = {};
  for (const key of Object.keys(flat)) {
    const parts = key.split('.');
    let cur = root, ok = true;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = cur[parts[i]];
      if (next === undefined) cur = cur[parts[i]] = {};
      else if (typeof next === 'object') cur = next;
      else { ok = false; break; } // 'a' is a leaf and 'a.b' wants to nest -> keep dotted
    }
    const last = parts[parts.length - 1];
    if (!ok) root[key] = flat[key];                 // parent is a leaf -> keep dotted
    else if (typeof cur[last] !== 'object') cur[last] = flat[key]; // else: a branch already owns this name, leaf skipped
  }
  return root;
}

function walk(dir, exts, ignore, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) { if (exts.has(path.extname(dir).slice(1))) out.push(dir); return out; }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (ignore.some((i) => p.split(path.sep).join('/').includes(i))) continue;
    if (e.isDirectory()) walk(p, exts, ignore, out);
    else if (exts.has(path.extname(e.name).slice(1)) && !/\.spec\.ts$/.test(e.name)) out.push(p);
  }
  return out;
}

/** Longest matching scope directory wins; no match -> global (null). */
export function scopeOf(file, scopes) {
  const f = path.resolve(file).split(path.sep).join('/');
  let best = null, bestLen = -1;
  for (const [name, dir] of Object.entries(scopes ?? {})) {
    const d = path.resolve(dir).split(path.sep).join('/').replace(/\/$/, '') + '/';
    if (f.startsWith(d) && d.length > bestLen) { best = name; bestLen = d.length; }
  }
  return best;
}

/**
 * options: { input: string[], output: string, langs: string[], scopes?: {name: dir}, extensions?: string[],
 *            ignore?: string[], placeholder?: string, sort?: boolean, unflat?: boolean,
 *            remove?: boolean, check?: boolean, cwd?: string }
 */
export function run(options) {
  const o = { extensions: ['html', 'ts'], ignore: [], placeholder: '', sort: true, unflat: false, remove: false, check: false, scopes: {}, cwd: process.cwd(), ...options };
  const r = (p) => path.resolve(o.cwd, p);
  const scopes = Object.fromEntries(Object.entries(o.scopes).map(([k, v]) => [k, r(v)]));
  const exts = new Set(o.extensions);
  const files = o.input.flatMap((i) => walk(r(i), exts, o.ignore));

  const perScope = new Map(); // scope|null -> Set(keys)
  let dynamic = 0;
  for (const f of files) {
    const { keys, dynamic: d } = scanText(fs.readFileSync(f, 'utf8'));
    dynamic += d;
    if (!keys.length) continue;
    const s = scopeOf(f, scopes);
    if (!perScope.has(s)) perScope.set(s, new Set());
    keys.forEach((k) => perScope.get(s).add(k));
  }
  for (const s of Object.keys(o.scopes)) if (!perScope.has(s)) perScope.set(s, new Set());
  if (!perScope.has(null)) perScope.set(null, new Set());

  const report = { files: files.length, dynamic, scopes: {}, written: [], ok: true };
  for (const [scope, found] of perScope) {
    const label = scope ?? '(global)';
    const rep = (report.scopes[label] = { keys: found.size, added: {}, unused: {}, empty: {} });
    for (const lang of o.langs) {
      const file = path.join(r(o.output), scope ?? '', `${lang}.json`);
      let existing = {};
      if (fs.existsSync(file)) existing = flattenObj(JSON.parse(fs.readFileSync(file, 'utf8') || '{}'));
      const next = {};
      const added = [], unused = [];
      for (const k of found) { if (k in existing) next[k] = existing[k]; else { next[k] = o.placeholder; added.push(k); } }
      for (const k of Object.keys(existing)) if (!found.has(k)) { unused.push(k); if (!o.remove) next[k] = existing[k]; }
      rep.added[lang] = added; rep.unused[lang] = unused;
      rep.empty[lang] = Object.values(next).filter((v) => v === '').length;
      if (added.length) report.ok = false; // unused keys never fail the check
      if (o.check) continue;
      const keys = o.sort ? Object.keys(next).sort() : Object.keys(next);
      const flat = Object.fromEntries(keys.map((k) => [k, next[k]]));
      const out = o.unflat ? unflattenObj(flat) : flat;
      const json = JSON.stringify(out, null, 2) + '\n';
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== json) {
        if (found.size || fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, json); report.written.push(file); }
      }
    }
  }
  return report;
}
