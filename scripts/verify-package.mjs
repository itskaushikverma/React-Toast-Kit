import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));

function assert(condition, message) {
  if (!condition) {
    console.error(`Verification failed: ${message}`);
    process.exit(1);
  }
}

const esmPath = path.join(root, 'dist/index.js');
const cjsPath = path.join(root, 'dist/index.cjs');
const dtsPath = path.join(root, 'dist/index.d.ts');
const esm = readFileSync(esmPath, 'utf8');
const cjs = readFileSync(cjsPath, 'utf8');
const dts = readFileSync(dtsPath, 'utf8');

function hasClientDirective(source) {
  return source.slice(0, 120).includes("'use client'") || source.slice(0, 120).includes('"use client"');
}

assert(hasClientDirective(esm), 'ESM bundle is missing the use client directive');
assert(hasClientDirective(cjs), 'CJS bundle is missing the use client directive');

for (const marker of [
  '#161a30',
  '#388e3c',
  '#fee2e2',
  '#b91c1c',
  'h-5 w-5 text-white',
  'text-[#b91c1c]',
  '@keyframes slideIn',
  '0.5s ease',
  'toast-slide-out',
]) {
  assert(esm.includes(marker), `ESM bundle is missing ${marker}`);
}

assert(/from ["']react["']/.test(esm), 'react must stay external in the ESM build');
assert(/from ["']react\/jsx-runtime["']/.test(esm), 'react/jsx-runtime must stay external');
assert(esm.includes('lucide-react'), 'lucide-react must stay external');
assert(!esm.includes('react.production'), 'react must not be bundled');
assert(esm.length < 100000, 'ESM bundle is unexpectedly large');

for (const name of ['ToastProvider', 'useToast', 'ToastContext', 'ToastType', 'ToastOptions']) {
  assert(dts.includes(name), `Declaration file is missing ${name}`);
}

const esmModule = await import(pathToFileURL(esmPath).href);
assert(typeof esmModule.ToastProvider === 'function', 'ESM ToastProvider export');
assert(typeof esmModule.useToast === 'function', 'ESM useToast export');
assert(esmModule.ToastContext, 'ESM ToastContext export');

const named = await import('react-toast-kit');
assert(typeof named.ToastProvider === 'function', 'package export ToastProvider');
assert(typeof named.useToast === 'function', 'package export useToast');

const cjsModule = require('react-toast-kit');
assert(typeof cjsModule.ToastProvider === 'function', 'CJS ToastProvider export');
assert(typeof cjsModule.useToast === 'function', 'CJS useToast export');
assert(cjsModule.ToastContext, 'CJS ToastContext export');

const html = renderToString(createElement(esmModule.ToastProvider, null, createElement('p', null, 'server child')));
assert(html.includes('server child'), 'server render dropped children');
assert(html.includes('toast-container'), 'server render dropped the toast container');
assert(html.includes('@keyframes slideIn'), 'server render dropped the animation CSS');

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
assert(!pkg.dependencies?.react, 'react must be a peer dependency, not a dependency');
assert(!pkg.dependencies?.['react-dom'], 'react-dom must be a peer dependency, not a dependency');
assert(pkg.peerDependencies.react, 'missing react peer dependency');
assert(pkg.peerDependencies['react-dom'], 'missing react-dom peer dependency');
assert(pkg.dependencies['lucide-react'], 'lucide-react should be a runtime dependency');

const pack = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: root,
  encoding: 'utf8',
});
if (pack.status !== 0) {
  console.error(pack.stdout);
  console.error(pack.stderr);
  process.exit(1);
}

const jsonStart = pack.stdout.indexOf('[');
const jsonObject = pack.stdout.indexOf('{');
const start = jsonStart === -1 ? jsonObject : jsonObject === -1 ? jsonStart : Math.min(jsonStart, jsonObject);
const packed = JSON.parse(pack.stdout.slice(start));
const entry = Array.isArray(packed) ? packed[0] : packed;
const packedPaths = entry.files.map((file) => file.path);

for (const required of ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'README.md', 'LICENSE']) {
  assert(packedPaths.includes(required), `tarball missing ${required}`);
}

assert(
  !packedPaths.some((file) => file.startsWith('src/') || file.startsWith('tests/') || file.startsWith('scripts/') || file.startsWith('playground/')),
  'tarball includes private source',
);

const tsc = spawnSync(path.join(root, 'node_modules/.bin/tsc'), ['--noEmit', '-p', 'tsconfig.consumer.json'], {
  cwd: root,
  encoding: 'utf8',
});
if (tsc.status !== 0) {
  console.error(tsc.stdout);
  console.error(tsc.stderr);
  process.exit(1);
}

console.log('Package exports, types, server render, and tarball contents verified.');
