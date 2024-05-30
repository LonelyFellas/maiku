import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import svgr from 'vite-plugin-svgr';

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
      renderer: {},
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': '/src',
      '@public': '/public',
      '@common': '/src/common',
      '@img': '/public/images',
      '@sty': '/src/assets/styles',
      '@assets': '/src/assets',
      '@api': '/src/api',
    },
  },

  server: {
    proxy: {
      '/mkapi': {
        target: 'http://maiku.npaas.cn/s/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mkapi/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        sourcemap: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_module')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});
