/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: import.meta.VITE_PORT,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      },
    },
  },
});
