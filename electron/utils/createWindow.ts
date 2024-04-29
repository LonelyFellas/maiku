import {
  BrowserWindow,
  type BrowserWindowConstructorOptions,
} from 'electron';

export function createBrowserWindow(options: BrowserWindowConstructorOptions) {
  const defaultOptions = {
    width: 1200,
    height: 780,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      // devTools: !app.isPackaged, // 在生产环境中禁用
      contextIsolation: false,
    },
  };
  return new BrowserWindow(Object.assign(defaultOptions, options));
}
