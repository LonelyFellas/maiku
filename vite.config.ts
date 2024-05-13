import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {
        resolve: {
          "koffi": { type: 'cjs'}
        }
      }
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': '/src',
      '@common': '/src/common',
      '@img': '/src/assets/images',
      '@sty': '/src/assets/styles',
      '@assets': '/src/assets',
      '@api': '/src/api',
    },
  },
  build: {
    rollupOptions: {
      output: {
        sourcemap: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules')[1].split('/')[0].toString();
          }
        },
      },
      external: ['koffi'],
    },
  },
});
