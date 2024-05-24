import fs from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import type Store from 'electron-store';
import { scrcpy } from './main';

interface CreateListenerOptions {
  store: Store<typeof import('./config/electron-store-schema.json')>;
}

const im = ipcMain as unknown as Electron.IM;

export default function createListener(options: CreateListenerOptions) {
  const { store } = options;

  /** 处理windows的窗口的状态按钮 */
  im.handle('window:state', async (...args) => {
    const [event, channel, windowClose] = args;
    const window = BrowserWindow.getFocusedWindow();
    if (channel === 'minimize') {
      window?.minimize();
    }
    if (channel === 'maximize') {
      window?.isMaximized() ? window?.unmaximize() : window?.maximize();
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
    return window?.isMaximized();
  });

  /** 启动scrcpy **/
  im.on('scrcpy:start', async (event, params) => {
    scrcpy.startWindow(params, (channel, channelData) => event.reply(channel, channelData));
    // const title = `Test-${envId}`;
    //
    // /**
    //  * 开启scrcpy窗口的逻辑:
    //  * 首先检测环境id是否存在，如果存在，则杀掉进程,开启新的进程
    //  * 如果不存在则直接开启新的进程
    //  * 错误处理需要手动处理，
    //  * 错误日志需要发送给渲染层
    //  * 同时在主函数中，也要监听主窗口的关闭事件，如果当前的主窗口关闭，同时也要关闭scrcpy所有窗口
    //  * @param title 窗口的标题
    //  */
    // const handleOpenScrcpyWindow = (title: string) => {
    //   const scrcpyCwd = getScrcpyCwd();
    //   if (handleCheckProcessExists(deviceId)) {
    //     killProcess(deviceId);
    //   }
    //
    //   /**
    //    * `--window-title`: 设置窗口的标题
    //    * `--window-width`：设置窗口的宽度
    //    * `--window-height`: 设置窗口的高度
    //    */
    //   // console.log('open scrcpy window1', ['-s', deviceId, '--window-title', title, '--window-width', '381', '--window-height', '675']);
    //   // console.log('open scrcpy window2', scrcpyCwd);
    //   scrcpyProcessObj[deviceId] = spawn('scrcpy', ['-s', deviceId, '--window-title', title, '--window-width', '381', '--window-height', '675'], {
    //     cwd: scrcpyCwd,
    //     shell: true,
    //   });
    //   scrcpyProcessObj[deviceId].stdout.on('data', (data) => {
    //     const strData = data.toString();
    //     console.error(`stdout: ${strData}`);
    //
    //     if (strData.includes('ERROR')) {
    //       event.reply('error', strData);
    //       event.reply('scrcpy:stop', {
    //         isSuccess: false,
    //         envId,
    //       });
    //     }
    //   });
    //   scrcpyProcessObj[deviceId].stderr.on('data', (data) => {
    //     const strData = data.toString();
    //     console.log(`stdrr: ${strData}`);
    //
    //     if (strData.includes('ERROR')) {
    //       event.reply('error', strData);
    //     }
    //   });
    //
    //   scrcpyProcessObj[deviceId].on('close', () => {
    //     // 通知渲染层当前的scrcpy关闭了
    //     event.reply('close-device-envId', envId);
    //   });
    // };
    // const handleCheckProcessExists = (deviceId: string) => Object.prototype.hasOwnProperty.call(scrcpyProcessObj, deviceId);
    //
    // if (type === 'notask') {
    //   console.log('notask');
    //   handleOpenScrcpyWindow(title);
    // }
    // if (type === 'task') {
    //   // 开启任务器的逻辑:
    //   // 首先开一个5秒任务器，来检查窗口是否存在
    //   // 1. 如果任务器失败，说明环境窗口不存在，直接打开scrcpy窗口 （打开scrcpy窗口还有其他逻辑）
    //   // 2. 如果任务其成功，关闭当前窗口, defer 30s 再打开新的窗口（关闭窗口和给渲染层发送消息）
    //   handleOpenScrcpyWindow(title);
    // }
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
}
