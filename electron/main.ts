import { app, BrowserWindow } from 'electron'
import Store from "electron-store";
import { createBrowserWindow} from './utils/createWindow.ts';
import schema from "./config/electron-store-schema.json"
import createListener from '/electron/listener.ts';
import { createTray } from '/electron/utils/tray.ts';
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

const isProd = app.isPackaged;
// 初始化electron-store
const store = new Store({ defaults: schema });
const isMac = process.platform === 'darwin';
let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = createBrowserWindow({
    frame: isMac,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
      // devTools: !app.isPackaged,
    },
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  console.log(path.join(RENDERER_DIST))
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile('./dist/index.html')
  }

  // 创建托盘图标
  createTray(mainWindow, app);

  // // 监听来自渲染器的消息
  // ipcMain.on('request-system-status', (event) => {
  //   const status = checkSystemStatus(); // 假设这是一个检查系统状态的函数
  //   event.reply('system-status', status);
  // });
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
    if (mainWindow) {
      mainWindow.webContents.send('error', error.toString());
    }
  });

  process.on('unhandledRejection', (reason:any, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (mainWindow) {
      mainWindow.webContents.send('error', reason.toString());
    }
  });

  // Open the DevTools.
  if (!isProd) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      if (isMac) {
        mainWindow?.hide();
      }
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})
app.on('ready', createWindow);


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow?.show();
  }
});
app.on('before-quit', () => {
  app.isQuitting = true;
  if (mainWindow) {
    mainWindow.destroy();
  }
});

// 监听来自渲染器的消息
createListener({
  store,
});
