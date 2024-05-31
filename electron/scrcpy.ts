import { spawn } from 'node:child_process';
import { createBrowserWindow, getScrcpyCwd, isMac, killProcessWithWindows } from '/electron/utils';
import path from 'node:path';
import { BrowserWindow } from 'electron';
import { __dirname } from '/electron/utils';
import { findWindow, getElectronWindow, checkWindowExists, embedWindow } from '/electron/utils/scrcpy-koffi.ts';
import { mainWin, RENDERER_DIST, VITE_DEV_SERVER_URL } from '/electron/main.ts';
import { isDev } from '@darwish/utils-is';

export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  processInfo: Record<string, SendChannelMap['scrcpy:start'][0]> = {};
  mainWindow: BrowserWindow | null = null;
  scrcpyWindows: Record<
    string,
    {
      window: BrowserWindow;
      winName: string;
      int32LE: number;
    }
  > = {};

  constructor(obj: T) {
    this.processObj = obj;
  }

  /**
   * 启动scrcpy窗口
   * @param params 启动所需要的一些参数
   * @param params.deviceId 设备id
   * @param params.envId 环境Id
   * @param params.name 环境名字
   * @param replyCallback 对渲染层通信的回调函数
   */
  public async startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    const { deviceId, envId, backupName, envName, type: paramsType } = params;
    const title = `[${envName}]-${backupName}`;
    const scrcpyCwd = getScrcpyCwd();

    // 重启
    if (paramsType === 'restart') {
      await this.killProcess(deviceId);
    }

    this.taskFindWindow({
      winName: title,
      deviceAddr: deviceId,
      backupName,
      envId,
    });

    // const listenWindowTimeId: NodeJS.Timeout | null = null;
    this.processObj[deviceId] = spawn('scrcpy', ['-s', deviceId, '--window-title', title, '--window-width', '381', '--window-height', '675'], {
      cwd: scrcpyCwd,
      shell: true,
    });
    this.processInfo[deviceId] = params;
    this.processObj[deviceId].stdout.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.error(`stdout: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
        replyCallback('scrcpy:stop', {
          isSuccess: false,
          envId,
        });
      }
    });
    this.processObj[deviceId].stderr.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
      }
    });
    this.processObj[deviceId].on('close', () => {
      // 通知渲染层当前的scrcpy关闭了
      replyCallback('close-device-envId', envId);
    });
  }

  /**
   * 停止scrcpy窗口
   */
  public async closeWindow(deviceId: string) {
    if (this.processObj[deviceId]) {
      await this.killProcess(deviceId);
      delete this.processInfo[deviceId];
    }
  }

  /** 设置主窗口 */
  public setMainWindow(mainWin: BrowserWindow) {
    this.mainWindow = mainWin;
  }

  // public setupPythonWindow() {
  //   const devPyPath = path.join(__dirname, '../electron/resources/extra/win/scrcpy/py-main.exe');
  //   execFile(devPyPath, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`stderr: ${error}`);
  //       return;
  //     }
  //     console.log(`Output: ${stdout}`);
  //     if (stderr) {
  //       console.error(`Error: ${stderr}`);
  //     }
  //   });
  // }

  /**
   * 杀死进程
   * @param deviceId
   * @private
   */
  private async killProcess(deviceId: string) {
    if (isMac) {
      this.processObj[deviceId].kill('SIGTERM');
      delete this.processObj[deviceId];
    } else {
      killProcessWithWindows(this.processObj[deviceId].pid!);
      delete this.processObj[deviceId];
    }
  }

  /**
   * 通过`'@darwish/captures-win32-position` 第三方库获取当前窗口的位置
   * @param winName 窗口的名字
   * @private
   */
  private checkCurrentWindowExist(winName: string) {
    return checkWindowExists(winName);
  }

  /**
   * 计时器任务查找当前窗口是否存在
   * 如果存在则停止查找，并发送到渲染层
   * 如果不存在则继续查找
   * @param winName 窗口的名字，必须和scrcpy窗口的名字一致
   * @param envId 环境Id
   * @param backupName 备份名字
   * @private
   */
  private taskFindWindow({ winName, deviceAddr, backupName, envId }: { winName: string; deviceAddr: string; backupName: string; envId: number }) {
    const maxAttempt = 10;
    let attempt = 0;

    const findWinTimeId = setInterval(() => {
      if (attempt >= maxAttempt) {
        clearInterval(findWinTimeId);
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          envId,
          backupName,
          isSuccess: false,
        });
      }
      const checkRes = this.checkCurrentWindowExist(winName);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          envId,
          backupName,
          isSuccess: true,
        });
        this.createEleScrcpyWindow(winName, deviceAddr, envId);
      }
      attempt++;
    }, 1000);
  }

  /**
   *
   * @param winName 窗口名字
   * @param title scrcpy窗口的标题
   * @param envId 环境id ，考虑多环境打开窗口需要传入环境id
   * @private
   */
  private createEleScrcpyWindow(winName: string, deviceAddr: string, envId: number) {
    const scrcpyWindow = createBrowserWindow({
      width: 430,
      height: 702,
      frame: false,
      resizable: false,
      show: true,
      skipTaskbar: false,
      alwaysOnTop: true,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: 'scrcpy-window',
    });
    // 解决打开窗口在主窗口前面，后面去掉窗口置顶
    setTimeout(() => {
      scrcpyWindow.setAlwaysOnTop(false);
    }, 2000);
    if (isDev) {
      scrcpyWindow.loadURL(`${VITE_DEV_SERVER_URL}scrcpy?title=${winName}&deviceAddr=${deviceAddr}&envId=${envId}`);
    } else {
      scrcpyWindow.loadFile(path.join(RENDERER_DIST, `index.html#/scrcpy?title=${winName}&deviceAddr=${deviceAddr}&envId=${envId}`));
    }
    const int32LE = scrcpyWindow.getNativeWindowHandle().readInt32LE();
    this.scrcpyWindows[deviceAddr] = {
      winName,
      window: scrcpyWindow,
      int32LE: int32LE,
    };
    setTimeout(() => {
      embedWindow(winName, int32LE);
    }, 1000);

    let blurWindow = false;
    scrcpyWindow.on('minimize', () => {
      blurWindow = true;
    });
    scrcpyWindow.on('focus', () => {
      if (blurWindow) {
        const id = setInterval(() => {
          embedWindow(winName, int32LE);
        }, 1000);
        setTimeout(() => {
          clearInterval(id);
        }, 3000);
      }
    });
  }

  public setScrcpyWindowSize(deviceAddr: string, width: number) {
    this.scrcpyWindows[deviceAddr].window.resizable = true;
    this.scrcpyWindows[deviceAddr].window.setSize(width, 702);
    this.scrcpyWindows[deviceAddr].window.resizable = false;
    // embedWindow(parentScrcpyHwnd, scrcpyHwnd);
    // this.refocusScrcpyWindow();
  }

  // private refocusScrcpyWindow = (scrcpyHwnd: number, scrcpyWindows: BrowserWindow) => {
  //   const id = setInterval(() => {
  //     embedWindow(winName, scrcpyWindows.getNativeWindowHandle().readInt32LE());
  //   }, 1000);
  //   setTimeout(() => {
  //     clearInterval(id);
  //   }, 3000);
  // };
  //
  // private getScrcpyWindow(scrcpyHwnd: number, scrcpyWindows: BrowserWindow, deviceAddr?: string) {
  //   const parentScrcpyHwnd = getElectronWindow(scrcpyWindows.getNativeWindowHandle().readInt32LE());
  //   if (deviceAddr) {
  //     this.setScrcpyWindow(scrcpyWindows, parentScrcpyHwnd);
  //     this.scrcpyWindows[deviceAddr] = {
  //       window: scrcpyWindows,
  //       hwnd: parentScrcpyHwnd,
  //     };
  //   }
  //
  //   embedWindow(parentScrcpyHwnd, scrcpyHwnd);
  // }
  //
  // private setScrcpyWindow(scrcpyWindows: BrowserWindow, deviceAddr: string) {
  //   // @ts-ignore
  //   if (this.scrcpyWindows[deviceAddr] === undefined) this.scrcpyWindows[deviceAddr] = { window: null, hwnd: -1 };
  //   this.scrcpyWindows[deviceAddr].window = scrcpyWindows;
  // }

  public scrcpyWindowStatesMini(deviceAddr: string) {
    this.scrcpyWindows[deviceAddr].window?.minimize();
  }

  public scrcpyWindowStatesClose(deviceAddr: string) {
    this.scrcpyWindows[deviceAddr].window?.destroy();
  }
}
