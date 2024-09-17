import { createBrowserWindow, getScrcpyCwd } from '/electron/utils';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { BrowserWindow, ipcMain, screen } from 'electron';
import { checkWindowExists, embedWindow, findWindow, getElectronWindow } from './utils/scrcpy-koffi';
import { RENDERER_DIST, VITE_DEV_SERVER_URL } from './main';
import { __dirname, isDev } from './utils/helper';

export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  pyProcessObj: EleApp.ProcessObj = {};
  processInfo: Record<string, SendChannelMap['scrcpy:start'][0]> = {};
  scrcpyWindows: Record<string, { win: BrowserWindow; hwnd: number; id: number }> = {};
  scrcpyScreenShotWindow: BrowserWindow | null = null;

  constructor(processObj: T, pyProcessObj: T) {
    this.processObj = processObj;
    this.pyProcessObj = pyProcessObj;

    ipcMain.on('scrcpy:screen-shot', (_, { type, winName }) => {
      if (type === 'open') {
        this.openScreenShotWindow(winName);
      } else {
        this.closeScreenShotWindow(winName);
      }
    });
  }

  /**
   * 启动scrcpy窗口
   * @param params 启动所需要的一些参数
   * @param params.deviceId 设备id
   * @param params.id id
   * @param params.name 环境名字
   * @param replyCallback 对渲染层通信的回调函数
   */
  public async startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    const { adbAddr, id, name = '测试窗口' } = params;
    const scrcpyCwd = getScrcpyCwd();

    this.taskFindWindow({ name, id });
    /**
     * --window-title: 窗口标题
     * --window-width: 窗口宽度
     * --window-height: 窗口高度
     * --window-x: 窗口x坐标
     * --window-y: 窗口y坐标
     */
    this.processObj[adbAddr] = spawn('scrcpy', ['-s', adbAddr, '--window-title', name, '--window-width', '1', '--window-height', '720', '--window-x', '-10000', '--window-y', '-10000', "--video-encoder 'c2.android.avc.encoder'"], {
      cwd: scrcpyCwd,
      shell: true,
    });
    this.processInfo[adbAddr] = params;
    this.processObj[adbAddr].stdout.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.error(`stdout: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
        replyCallback('scrcpy:stop', {
          isSuccess: false,
          id,
        });
        return;
      }

      if (this.scrcpyWindows[id]) return;
    });
    this.processObj[adbAddr].stderr.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
      }
    });
    this.processObj[adbAddr].on('close', () => {
      // 通知渲染层当前的scrcpy关闭了
      replyCallback('close-device-envId', id);
    });
    console.log('name', name);
    console.log('adbAddr', adbAddr);
    // setTimeout(() => {
    // }, 3000);
  }

  /**
   *
   * @param winName 窗口名字
   * @param title scrcpy窗口的标题
   * @param id 考虑多id
   * @private
   */
  private async createEleScrcpyWindow(winName: string, id: number) {
    const scrcpyWindow = createBrowserWindow({
      width: 450,
      height: 702,
      frame: true,
      resizable: true,
      autoHideMenuBar: true,
      show: true,
      modal: false,
      skipTaskbar: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: `[${winName}]`,
    });

    const scrcpyNativeHwnd = await findWindow(winName);
    this.setScrcpyWindow({
      id,
      win: scrcpyWindow,
      hwnd: scrcpyNativeHwnd,
      winName,
    });
    if (isDev) {
      scrcpyWindow.loadURL(`${VITE_DEV_SERVER_URL}?window_name=scrcpy_window&win_name=${winName}`);
    } else {
      scrcpyWindow.loadURL(path.join(RENDERER_DIST, `index.html?window_name=scrcpy_window&win_name=${winName}`));
    }
    setTimeout(() => {
      this.embedScrcpyWindow(winName);
    }, 1000);
  }

  public embedScrcpyWindow(winName: string) {
    const parentScrcpyHwnd = getElectronWindow(this.scrcpyWindows[winName].win.getNativeWindowHandle().readInt32LE());
    // 获取窗口的位置
    const [x, y] = this.scrcpyWindows[winName].win.getPosition();

    // 获取窗口所在的显示器
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    const scaleFactor = currentDisplay.scaleFactor;
    embedWindow(parentScrcpyHwnd, this.scrcpyWindows[winName].hwnd, scaleFactor);
  }

  /**
   * 计时器任务查找当前窗口是否存在
   * 如果存在则停止查找，并发送到渲染层
   * 如果不存在则继续查找
   * @private
   * @param params
   */
  private taskFindWindow(params: { name: string; id: number }) {
    const { id, name } = params;
    const maxAttempt = 10;
    let attempt = 0;

    const findWinTimeId = setInterval(() => {
      if (attempt >= maxAttempt) {
        clearInterval(findWinTimeId);
      }
      const checkRes = checkWindowExists(name);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        this.createEleScrcpyWindow(name, id);
      }
      attempt++;
    }, 1000);
  }
  private setScrcpyWindow({ win, id, hwnd, winName }: { win: BrowserWindow; id: number; hwnd: number; winName: string }) {
    this.scrcpyWindows[winName] = { win, hwnd, id };
  }

  private openScreenShotWindow(winName: string) {
    if (this.scrcpyScreenShotWindow === null) {
      const scrcpyScreenShotWindow = createBrowserWindow({
        width: 200,
        height: 350,
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        show: true,
        x: this.scrcpyWindows[winName].win.getPosition()[0] + 185,
        y: this.scrcpyWindows[winName].win.getPosition()[1] + 35,
        parent: this.scrcpyWindows[winName].win,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.mjs'),
        },
        title: `screen shot`,
      });

      if (isDev) {
        scrcpyScreenShotWindow.loadURL(`${VITE_DEV_SERVER_URL}?window_name=scrcpy_screen_shot_window&port=${10020}`);
      } else {
        scrcpyScreenShotWindow.loadURL(path.join(RENDERER_DIST, `index.html?window_name=scrcpy_screen_shot_window&port=${10020}`));
      }
      this.scrcpyScreenShotWindow = scrcpyScreenShotWindow;
    } else {
      this.scrcpyWindows[winName].win.webContents.send('scrcpy:show-screen-shot-window', { port: 10020, winName });
      this.scrcpyScreenShotWindow.show();
    }
  }
  private closeScreenShotWindow(winName: string) {
    this.scrcpyScreenShotWindow?.hide();
  }
}
