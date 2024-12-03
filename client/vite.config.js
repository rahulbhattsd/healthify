import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-quill']  // Ensure react-quill is included in optimization
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Your Express server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});



