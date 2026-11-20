import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envDir: process.env.BEBSHAX_FRONTEND_VERIFY === '1' ? path.resolve(__dirname, '.tmp/verification-env') : '../..',
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    strictPort: true,
  },
  build: {
    // Base64-inlining a woff2 into the render-blocking stylesheet makes it
    // ~33% bigger (base64 of already-compressed data does not gzip) and
    // defeats unicode-range lazy loading. Always emit fonts as files.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          return null;
        },
      },
    },
  },
  test: {
    exclude: [...configDefaults.exclude, '**/.tsupgrader/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: false,
  },
});
