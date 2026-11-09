import { resolve } from 'node:path';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

// One config for both targets:
// - npm:    vite build --mode lib  → dist/
// - Vercel: vite build             → dist-demo/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [react()],
      publicDir: false,
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
          entry: resolve(import.meta.dirname, 'src/index.js'),
          fileName: (format) =>
            format === 'es' ? 'react-toast-kit-js.js' : 'react-toast-kit-js.cjs',
          formats: ['es', 'cjs'],
        },
        rolldownOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
        },
        sourcemap: true,
      },
    };
  }

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    build: {
      outDir: 'dist-demo',
      emptyOutDir: true,
    },
  };
});
