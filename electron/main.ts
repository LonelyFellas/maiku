import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { isProd, createLoadWindow, createBrowserWindow, createTray, isMac, __dirname } from './utils';
import Store from 'electron-store';
import schema from './config/electron-store-schema.json';
import createListener from '/electron/listener.ts';
import { test } from 'window_test';

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

// 初始化electron-store
const store = new Store({ defaults: schema });
let mainWin: BrowserWindow | null = null;
let loadingWin: Electron.BrowserWindow | null = null;
// console.log('createMainWindow');

console.log('test', test);

function createMainWindow() {
  // 获取屏幕的尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWin = createBrowserWindow({
    frame: isMac,
    show: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
      // devTools: !app.isPackaged,
    },
    x: (width - 1200) / 2,
    y: (height - 780) / 2,
  });

  if (VITE_DEV_SERVER_URL) {
    mainWin.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWin.loadFile('./dist/index.html');
  }

  // 创建托盘图标
  createTray(mainWin, app);

  // // 监听来自渲染器的消息
  // ipcMain.on('request-system-status', (event) => {
  //   const status = checkSystemStatus(); // 假设这是一个检查系统状态的函数
  //   event.reply('system-status', status);
  // });
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
    if (mainWin) {
      mainWin.webContents.send('error', error.toString());
    }
  });

  process.on('unhandledRejection', (reason: any, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (mainWin) {
      mainWin.webContents.send('error', reason.toString());
    }
  });

  // Open the DevTools.
  if (!isProd) {
    mainWin.webContents.openDevTools({ mode: 'detach' });
  }
  mainWin.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      if (isMac) {
        mainWin?.hide();
      }
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWin = null;
  }
});
app.on('ready', () => {
  store.set('twoWindowsLoading', {
    main: true,
    loading: true,
  });
  loadingWin = createLoadWindow(loadingWin);
  createMainWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  } else {
    mainWin?.show();
  }
});
app.on('before-quit', () => {
  app.isQuitting = true;
  if (mainWin) {
    mainWin.destroy();
  }
});
ipcMain.on('loading:done', (_, type: 'main' | 'loading' = 'main') => {
  // 关闭加载窗口(关闭之前确保加载窗口的任务也同样完成)
  const loadingWinStatus = store.get('twoWindowsLoading');
  if (type === 'loading') {
    store.set('twoWindowsLoading', {
      ...loadingWinStatus,
      loading: false,
    });
  }
  if (type === 'main') {
    store.set('twoWindowsLoading', {
      ...loadingWinStatus,
      main: false,
    });
  }

  const getAgainLoadingWinStatus = store.get('twoWindowsLoading');
  if (!getAgainLoadingWinStatus.loading && !getAgainLoadingWinStatus.main) {
    loadingWin?.destroy();
    mainWin?.show();
  }
});

// 监听来自渲染器的消息
createListener({
  store,
});
