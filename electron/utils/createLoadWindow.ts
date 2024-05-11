import { screen } from 'electron';
import { __dirname, isProd } from './helper.ts';
import { createBrowserWindow } from '/electron/utils/createWindow.ts';
import path from 'node:path';

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

  loadingWin.loadFile(isProd ? './dist/loading.html' : 'public/loading.html');

  return loadingWin;
}
