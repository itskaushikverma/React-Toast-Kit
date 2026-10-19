import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const clientDirective = "'use client';\n";

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  platform: 'neutral',
  external: ['react', 'react/jsx-runtime', 'react-dom', 'lucide-react'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
  async onSuccess() {
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      const source = readFileSync(file, 'utf8');
      if (!source.startsWith(clientDirective)) {
        writeFileSync(file, `${clientDirective}${source}`);
      }
    }
  },
});
