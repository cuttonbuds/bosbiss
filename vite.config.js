import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the 3D stack in its own async chunk so the first paint never waits for it.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
