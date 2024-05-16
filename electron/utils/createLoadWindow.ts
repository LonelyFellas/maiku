import { screen } from 'electron';
import path from 'node:path';
import { createBrowserWindow, __dirname, isProd } from '/electron/utils';
import { RENDERER_DIST } from '/electron/main.ts';

/**
 * 窗口一个用于加载的窗口
 * @param loadingWin 窗口实例
 * @returns
 */
export function createLoadWindow(loadingWin: Electron.BrowserWindow | null) {
  // 获取屏幕的尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  loadingWin = createBrowserWindow({
    frame: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
      devTools: isProd,
    },
    width: 300,
    height: 300,
    x: (width - 300) / 2,
    y: (height - 300) / 2,
  });

  loadingWin.loadFile(isProd ? path.join(RENDERER_DIST, 'loading.html') : 'public/loading.html');

  return loadingWin;
}
