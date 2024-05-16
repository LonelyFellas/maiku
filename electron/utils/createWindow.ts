import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';

/**
 * 创建一个通用窗口的模版
 * @param options BrowserWindowConstructorOptions
 * @returns
 */
export function createBrowserWindow(options: BrowserWindowConstructorOptions) {
  const defaultOptions = {
    width: 972,
    height: 722,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      // devTools: !app.isPackaged, // 在生产环境中禁用
      contextIsolation: false,
    },
  };
  return new BrowserWindow(Object.assign(defaultOptions, options));
}
