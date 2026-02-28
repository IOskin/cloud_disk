import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
    filename: 'stats.html',
    template: 'flamegraph'
  }), compression()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/video': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      // },
    },
  },
});
