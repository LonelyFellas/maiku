import { BrowserWindow, dialog, ipcMain, app } from 'electron';
import type Store from 'electron-store';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import * as process from 'node:process';
import { isMac, getScrcpyCwd, killProcessWithWindows } from '/electron/utils';
import { scrcpyProcessObj } from './main';

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
  im.on('scrcpy:start', async (event, deviceId, winName = 'Test') => {
    const scrcpyCwd = getScrcpyCwd();
    if (Object.prototype.hasOwnProperty.call(scrcpyProcessObj, deviceId)) {
      if (isMac) {
        scrcpyProcessObj[deviceId].kill('SIGTERM');
        delete scrcpyProcessObj[deviceId];
      } else {
        killProcessWithWindows(scrcpyProcessObj[deviceId].pid!);
        delete scrcpyProcessObj[deviceId];
      }
    }

    /**
     * `--window-title`: 设置窗口的标题
     * `--window-width`：设置窗口的宽度
     * `--window-height`: 设置窗口的高度
     */
    scrcpyProcessObj[deviceId] = spawn('scrcpy', ['-s', deviceId, '--window-title', winName, '--window-width', '381', '--window-height', '675'], {
      cwd: scrcpyCwd,
      shell: true,
    });

    scrcpyProcessObj[deviceId].stdout.on('data', (data) => {
      const strData = data.toString();
      console.error(`stdout: ${strData}`);

      if (strData.includes('ERROR')) {
        event.reply('error', strData);
      } else {
        // 确保它渲染完成
        if (strData.includes('INFO: Device:')) {
          // 你可以在这里执行其他操作，例如通知用户 scrcpy 已启动成功
          console.log('Renderer ready');
          event.reply('open-scrcpy-window', () => ({
            bb: 1,
            cc: 2,
            ee: 3,
          }));
          /**
           * 执行一个定时任务，检查窗口是否存在
           * 如果窗口存在，则打开scrcpy的taskbar窗口
           * 如果窗口不存在，则尝试重新打开窗口
           */
          // task(() => checkWindowExists(winName), {
          //   type: 'check',
          //   attempts: 0,
          //   maxAttempts: 5,
          //   timeout: 1000,
          //   onSuccess: () => {
          //     const rect = getWindowRect(winName)!;
          //     const { top, bottom, right } = rect;
          //     const scrcpyTaskbarWindow = createBrowserWindow({
          //       x: right - 7,
          //       y: top + 1,
          //       width: 40,
          //       height: bottom - top - 10,
          //       frame: false,
          //       webPreferences: {
          //         nodeIntegration: true,
          //         contextIsolation: true,
          //         preload: path.join(__dirname, 'preload.mjs'),
          //       },
          //     });
          //     setInterval(() => {
          //       const rect = getWindowRect(winName)!;
          //       const { top, right } = rect;
          //       scrcpyTaskbarWindow.setPosition(right - 7, top + 1);
          //     }, 0);
          //     scrcpyTaskbarWindow.on('blur', (event) => {
          //       event.preventDefault(); // 阻止子窗口最小化
          //     });
          //     scrcpyTaskbarWindow.on('minimize', (event) => {
          //       event.preventDefault(); // 阻止子窗口最小化
          //       if (scrcpyTaskbarWindow.isMinimized()) {
          //         scrcpyTaskbarWindow.restore(); // 立即恢复子窗口
          //       }
          //     });
          //     scrcpyTaskbarWindow.loadURL(`${VITE_DEV_SERVER_URL}/scrcpy`);
          //   },
          // });
        }
      }
    });

    scrcpyProcessObj[deviceId].stderr.on('data', (data) => {
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        event.reply('error', strData);
      }
    });

    scrcpyProcessObj[deviceId].on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
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
