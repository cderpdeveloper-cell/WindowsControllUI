import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://windowscontrolcenterapi.runasp.net',
        changeOrigin: true,
      },
      '/hubs': {
        target: 'http://windowscontrolcenterapi.runasp.net',
        ws: true,
      },
    },
  },
});
