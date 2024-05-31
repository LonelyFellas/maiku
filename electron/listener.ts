import fs from 'node:fs';
import * as http from 'node:http';
import path from 'node:path';
import * as process from 'node:process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import type Store from 'electron-store';
import { scrcpy, mainWin } from './main';
import { __dirname } from '/electron/utils';

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

  /** 处理scrcpyWindows的窗口的状态按钮*/
  im.on('scrcpy:window-state', (...args) => {
    const [, chnannel, envId] = args;
    if (chnannel === 'minimize') {
      scrcpy.scrcpyWindowStatesMini(envId);
    } else {
      scrcpy.scrcpyWindowStatesClose(envId);
    }
  });
  /** 启动scrcpy **/
  im.on('scrcpy:start', async (event, params) => {
    scrcpy.startWindow(params, (channel, channelData) => event.reply(channel, channelData));
  });
  im.on('scrcpy:stop', async (_, { deviceId }) => scrcpy.closeWindow(deviceId));
  // im.on('scrcpy:restart', async (event, { deviceId }) => scrcpy.restartWindow(deviceId, (channel, channelData) => event.reply(channel, channelData)));
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
  /** 打开文件框，选择文件，处理文件，拿到文件名和文件大小，返回给renderer **/
  im.handle('dialog:open', async (...args) => {
    const [, option] = args;
    const res = await dialog.showOpenDialog(option);
    if (!res.canceled && res.filePaths.length > 0) {
      const files = await Promise.all(
        res.filePaths.map(async (filePath) => {
          const temp = { url: filePath, name: '', size: -1 };
          const stats = await fs.promises.stat(filePath);
          temp.name = path.basename(filePath);
          temp.size = stats.size;
          return temp;
        }),
      );
      return files;
    }
    return res.filePaths;
  });

  // /** 保存文件 **/
  // ipcMain.on('file:operation', (event, outputPath, type) => {
  //   if (type === 'save') {
  //     console.log(outputPath);
  //     console.log(path.join(__dirname, outputPath));
  //     // fs.writeFile(
  //     //   path.join(__dirname, outputPath),
  //     //   Buffer.from(data),
  //     //   (err) => {
  //     //     if (err) {
  //     //       console.error('Error saving file:', err);
  //     //       event.reply(err.message);
  //     //       return;
  //     //     }
  //     //   },
  //     // );
  //   } else {
  //     fs.unlink(outputPath, (err) => {
  //       if (err) {
  //         console.error('Failed to delete file:', err);
  //         event.reply(err.message);
  //         return;
  //       }
  //     });
  //   }
  // });
  // /** 下载文件 **/
  // ipcMain.on('download-file-progress', (event) => {
  //   event.reply('download-file-progress', {
  //     // progress:
  //   });
  // });
  // ipcMain.on('window:scrcpy-listen', (_, winName: string) => {
  //   const rect = getWindowRect(winName);
  //   console.log('rect', rect);
  // });
  /** 下载文件资源 */
  im.on('download-file', async (_, url, options) => {
    const { isDialog = false, ...dialogOptions } = options;
    if (isDialog) {
      const { filePath, canceled } = await dialog.showSaveDialog(dialogOptions);
      if (!canceled) {
        downloadImage(url, filePath ?? path.join(__dirname, 'downloads', path.basename(url)));
      }
    }
  });
  /** 打开scrcpy窗口额外透明栏 */
  im.on('scrcpy:show-toast', (_, deviceAddr, isTransparent) => {
    scrcpy.setScrcpyWindowTransparent(deviceAddr, isTransparent);
  });
}

function downloadImage(url: string, filePath: string) {
  // 发送 HTTPS GET 请求获取图片数据
  http.get(url, (response) => {
    // 创建可写流
    const file = fs.createWriteStream(filePath);
    // 将相应数据管道到文件流
    response.pipe(file);
    // 监听文件流关闭事件
    file
      .on('finish', () => {
        file.close(() => {
          console.log('Image downloaded successfully');
        });
      })
      .on('error', (err) => {
        console.error('Error downloading image:', err);
        mainWin?.webContents.send('error', err.message);
      });
  });
}
