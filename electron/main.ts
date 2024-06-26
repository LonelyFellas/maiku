import path from 'node:path';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import Store from 'electron-store';
import schema from './config/electron-store-schema.json';
import createListener from '/electron/listener';
import Updater from './updater';
import { __dirname, closeAllScrcpyDevices, createBrowserWindow, createLoadWindow, createTray, isMac, isProd } from './utils';
import Scrcpy from '/electron/scrcpy.ts';

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;
export const scrcpyProcessObj: EleApp.ProcessObj = {};
export const pyProcessObj: EleApp.ProcessObj = {};
export const scrcpy = new Scrcpy(scrcpyProcessObj || {}, pyProcessObj || {});

// 初始化electron-store
export const store = new Store({ defaults: schema });
export let mainWin: BrowserWindow | null = null;
let loadingWin: Electron.BrowserWindow | null = null;
const updater = new Updater();

function createMainWindow() {
  // 获取屏幕的尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = (width - 972) / 2;
  let y = (height - 722) / 2;
  if (y < 0) {
    y = 0;
  }
  mainWin = createBrowserWindow({
    frame: isMac,
    show: false,
    icon: path.join(process.env.VITE_PUBLIC ?? '', 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
      // devTools: !app.isPackaged,
    },
    x,
    y,
  });

  if (VITE_DEV_SERVER_URL) {
    mainWin.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWin.loadFile(path.join(RENDERER_DIST, 'index.html'));
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

  process.on('unhandledRejection', (reason: string, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (mainWin) {
      mainWin.webContents.send('error', reason.toString());
    }
  });

  // Open the DevTools.
  if (!isProd) {
    mainWin.webContents.openDevTools({ mode: 'detach' });
  }
  if (mainWin) {
    // 给主窗口设置scrcpy实例
    // 后续scrcpy窗口进行操作时有可能需要的对渲染层发消息
    scrcpy.setMainWindow(mainWin);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // 关闭所有的云机
  closeAllScrcpyDevices();
  // 再关闭主窗口和程序
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
    // 检查更新
    updater.checkForUpdates();
    // 监听来自渲染器的消息
    updater.autoUpdaerOn(mainWin);
  }
});

// 监听来自渲染器的消息
createListener({
  store,
});
