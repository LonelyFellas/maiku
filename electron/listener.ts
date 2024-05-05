import { BrowserWindow, dialog, ipcMain, app } from 'electron';
import type Store from 'electron-store';
import share from './utils/share';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface CreateListenerOptions {
  loadingWin: BrowserWindow | null;
  mainWin: BrowserWindow | null;
  store: Store<{
    window_close: string;
    twoWindowsLoading: {
      loading: boolean;
      main: boolean;
    };
  }>;
}

export default function createListener(options: CreateListenerOptions) {
  const { store, mainWin, loadingWin } = options;

  /** 处理windows的窗口的状态按钮 */
  ipcMain.handle('window:state', async (event, channel, windowClose) => {
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
  ipcMain.handle('lang:i18n', async (_, lang: string) => {
    console.log('lang:', lang);
    const [get, set] = share('i81n');
    const value = await get();
    set('en');

    // 模拟异步加载静态数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, 120);
    });
  });
  /** 启动scrcpy **/
  ipcMain.on('startScrcpy', (event, deviceId: string) => {
    const command = deviceId ? `scrcpy -s ${deviceId}` : 'scrcpy';

    const scrcpyProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        event.reply('error', `exec error: ${error}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    scrcpyProcess.on('exit', (code) => {
      console.log(`scrcpy exited with code ${code}`);
    });
  });
  /** 关闭和重启 */
  ipcMain.on('app:operate', (_, operation) => {
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
  ipcMain.handle('dialog:open', async (_, option) => {
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

  /** 保存文件 **/
  ipcMain.on('file:operation', (event, outputPath, type) => {
    if (type === 'save') {
      console.log(outputPath);
      console.log(path.join(__dirname, outputPath));
      // fs.writeFile(
      //   path.join(__dirname, outputPath),
      //   Buffer.from(data),
      //   (err) => {
      //     if (err) {
      //       console.error('Error saving file:', err);
      //       event.reply(err.message);
      //       return;
      //     }
      //   },
      // );
    } else {
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
          event.reply(err.message);
          return;
        }
      });
    }
  });
  /** 下载文件 **/
  ipcMain.on('download-file-progress', (event) => {
    event.reply('download-file-progress', {
      // progress:
    });
  });
}
