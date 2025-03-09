// vite.config.js
export default {
  root: './',
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    host: true
  },
  optimizeDeps: {
    exclude: []
  }
};