import path from 'node:path';
import * as process from 'node:process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import type Store from 'electron-store';
import { scrcpy, mainWin } from './main';
import { getScrcpyCwd } from '/electron/utils';

interface CreateListenerOptions {
  store: Store<typeof import('./config/electron-store-schema.json')>;
}

const im = ipcMain as unknown as Electron.IM;

export default function createListener(options: CreateListenerOptions) {
  const { store } = options;

  /** 处理windows的窗口的状态按钮 */
  im.handle('window:state', async (...args) => {
    const [event, channel, windowClose] = args;
    // const window = BrowserWindow.getFocusedWindow();
    if (channel === 'minimize') {
      mainWin?.minimize();
    }
    if (channel === 'maximize') {
      mainWin?.isMaximized() ? mainWin?.unmaximize() : mainWin?.maximize();
    }
    if (channel === 'close') {
      const windowCloseVal = store.get('window_close');

      // 当窗口关闭时，弹出提示框询问用户是否最小化到托盘或关闭窗口
      if (windowCloseVal === '') {
        const minimizeToTray = () => {
          const mainWindow = BrowserWindow.fromWebContents(event.sender);
          mainWindow?.hide();
        };
        const closeWindow = () => {
          app.quit();
        };
        // 判断窗口是否记住了选择了，如果记住选择了，则不弹出提示框 直接执行记住的操作
        if (windowClose === '') {
          const dialogRes = await dialog.showMessageBox({
            type: 'question',
            message: '你点击关闭按钮，你确定：',
            buttons: ['最小化到托盘', '关闭窗口', '取消'],
            checkboxLabel: '记住我的选择',
            checkboxChecked: false,
            cancelId: -1, // 取消按钮的索引
          });
          // 没有点击‘记住我的选择’时，根据用户的选择执行相应的操作
          // 当用户点击了‘记住我的选择’时，将选择保存到本地存储
          // 当前是最小化到托盘
          if (dialogRes.response === 0) {
            minimizeToTray();
          }
          // 当前是关闭窗口
          if (dialogRes.response === 1) {
            closeWindow();
          }
          return dialogRes;
        } else if (windowClose === 'minimizeToTray') {
          minimizeToTray();
        } else {
          closeWindow();
        }
      }
    }
    return mainWin?.isMaximized();
  });

  /** 启动scrcpy **/
  im.on('scrcpy:start', async (event, params) => {
    scrcpy.startWindow(params, (channel, channelData) => event.reply(channel, channelData));
  });
  /** 关闭和重启 */
  im.on('app:operate', (_, operation) => {
    if (operation === 'close') {
      app.quit();
    } else if (operation === 'restart') {
      if (app.isPackaged) {
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunched']) });
        app.quit();
      }
    }
  });

  im.handle('get-static-path', async (_, type) => {
    if (type === 'keyboard-apk-path') {
      const scrcpyPath = getScrcpyCwd();
      const keyboardApkPath = path.join(scrcpyPath, '/ADBKeyboard.apk');
      return keyboardApkPath;
    } else if (type === 'img') {
      return '';
    }
    return '';
  });
}
