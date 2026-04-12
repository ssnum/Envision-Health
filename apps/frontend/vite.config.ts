import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // Skip TypeScript type checking during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    }
  },
  esbuild: {
    // Don't fail build on TypeScript errors
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})