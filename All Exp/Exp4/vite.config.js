// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Make sure to export the config properly
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
  },
  server: {
    port: 3000,
    open: true
  }
});