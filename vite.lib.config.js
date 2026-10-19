import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      fileName: (format) => (format === 'es' ? 'react-toast-kit-js.js' : 'react-toast-kit-js.cjs'),
      formats: ['es', 'cjs'],
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    },
    sourcemap: true,
  },
})
