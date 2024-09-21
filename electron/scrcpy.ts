import { createBrowserWindow, getScrcpyCwd } from '/electron/utils';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { BrowserWindow, ipcMain, screen } from 'electron';
import { checkWindowExists, embedWindow, findWindow, getElectronWindow } from './utils/scrcpy-koffi';
import { RENDERER_DIST, VITE_DEV_SERVER_URL } from './main';
import { __dirname, isDev } from './utils/helper';

const SCRCPY_WIDTH_V = 380;
const SCRCPY_HEIGHT_V = 702;
const SCRCPY_WIDTH_H = 676;
const SCRCPY_HEIGHT_H = 380;
const SCRCPY_WIN_WIDTH_V = 455;
const SCRCPY_WIN_HEIGHT_V = 712;
const SCRCPY_WIN_WIDTH_H = 752;
const SCRCPY_WIN_HEIGHT_H = 420;

export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  pyProcessObj: EleApp.ProcessObj = {};
  processInfo: Record<string, SendChannelMap['scrcpy:start'][0]> = {};
  scrcpyWindows: Record<string, { win?: BrowserWindow; hwnd?: number; id?: number; screenShotWindow?: BrowserWindow | null; adbAddr?: string; scrcpyWidth?: number; scrcpyHeight?: number; direction: EleApp.Direction }> = {};

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
    // ipcMain.on('scrcpy:rotate-screen', (_, { winName, direction }) => {
    //   // this.rotateScreen(winName, direction);
    // });
    ipcMain.on('scrcpy:init-size-window', (_, { winName, direction = 'horizontal' }) => {
      this.initSizeWindow(winName, direction);
    });
    /** 重新嵌入scrcpy窗口 */
    ipcMain.on('scrcpy:reembed-window', (_, winName: string) => {
      const scrcpy = this.scrcpyWindows[winName];
      if (scrcpy.win) {
        this.embedScrcpyWindow({ winName, scrcpyWindow: scrcpy.win, width: scrcpy.scrcpyWidth ?? 0, height: scrcpy.scrcpyHeight ?? 0 });
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

    this.taskFindWindow({ name, id, adbAddr });
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
      if (strData.includes('Texture: 720x1280')) {
        if (this.scrcpyWindows[name] && this.scrcpyWindows[name].win) {
          this.scrcpyWindows[name].direction = 'vertical';
          this.initSizeWindow(name, 'vertical');
        } else {
          this.scrcpyWindows[name] = {
            direction: 'vertical',
          };
          this.scrcpyWindows[name].direction = 'vertical';
        }
      } else if (strData.includes('Texture: 1280x720')) {
        if (this.scrcpyWindows[name] && this.scrcpyWindows[name].win) {
          this.scrcpyWindows[name].direction = 'horizontal';
          this.initSizeWindow(name, 'horizontal');
        } else {
          this.scrcpyWindows[name] = {
            direction: 'horizontal',
          };
          this.scrcpyWindows[name].direction = 'horizontal';
        }
      }

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
  private async createEleScrcpyWindow(winName: string, id: number, adbAddr: string) {
    const direction = this.scrcpyWindows[winName].direction;
    if (!direction) {
      return;
    }
    const scrcpyWindow = createBrowserWindow({
      width: direction === 'vertical' ? SCRCPY_WIN_WIDTH_V : SCRCPY_WIN_WIDTH_H,
      height: direction === 'vertical' ? SCRCPY_WIN_HEIGHT_V : SCRCPY_WIN_HEIGHT_H,
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
      adbAddr,
    });
    if (isDev) {
      scrcpyWindow.loadURL(`${VITE_DEV_SERVER_URL}?window_name=scrcpy_window&win_name=${winName}`);
    } else {
      scrcpyWindow.loadURL(path.join(RENDERER_DIST, `index.html?window_name=scrcpy_window&win_name=${winName}`));
    }
    const width = direction === 'vertical' ? SCRCPY_WIDTH_V : SCRCPY_WIDTH_H;
    const height = direction === 'vertical' ? SCRCPY_HEIGHT_V : SCRCPY_HEIGHT_H;
    setTimeout(() => {
      this.embedScrcpyWindow({ winName, scrcpyWindow, width, height, direction: this.scrcpyWindows[winName].direction });
    }, 1000);
  }

  public embedScrcpyWindow({ winName, scrcpyWindow, width, height, direction = 'vertical' }: { winName: string; scrcpyWindow: BrowserWindow; width: number; height: number; direction?: EleApp.Direction }) {
    const scrcpy = this.scrcpyWindows[winName]!;
    if (scrcpy.win) {
      const parentScrcpyHwnd = getElectronWindow(scrcpy.win.getNativeWindowHandle().readInt32LE());
      // 获取窗口的位置
      const [x, y] = scrcpy.win.getPosition();

      // 获取窗口所在的显示器
      const currentDisplay = screen.getDisplayNearestPoint({ x, y });
      const scaleFactor = currentDisplay.scaleFactor;
      // 计算调整后的窗口大小
      const adjustedWidth = Math.round(width * scaleFactor);
      const adjustedHeight = Math.round(height * scaleFactor);
      embedWindow({
        parentHwnd: parentScrcpyHwnd,
        nativeHwnd: scrcpy.hwnd!,
        scrcpyWindow,
        width: adjustedWidth,
        height: adjustedHeight,
        direction,
      });
      // 记录窗口的大小
      this.scrcpyWindows[winName].scrcpyHeight = height;
      this.scrcpyWindows[winName].scrcpyWidth = width;
    }
  }

  /**
   * 计时器任务查找当前窗口是否存在
   * 如果存在则停止查找，并发送到渲染层
   * 如果不存在则继续查找
   * @private
   * @param params
   */
  private taskFindWindow(params: { name: string; id: number; adbAddr: string }) {
    const { id, name, adbAddr } = params;
    const maxAttempt = 10;
    let attempt = 0;

    const findWinTimeId = setInterval(() => {
      if (attempt >= maxAttempt) {
        clearInterval(findWinTimeId);
      }
      const checkRes = checkWindowExists(name);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        this.createEleScrcpyWindow(name, id, adbAddr);
      }
      attempt++;
    }, 1000);
  }
  private setScrcpyWindow({ win, id, hwnd, winName, adbAddr }: { win: BrowserWindow; id: number; hwnd: number; winName: string; adbAddr: string }) {
    this.scrcpyWindows[winName] = { ...this.scrcpyWindows[winName], win, hwnd, id, adbAddr };
  }

  private openScreenShotWindow(winName: string) {
    if (this.scrcpyWindows[winName].screenShotWindow) {
      this.scrcpyWindows[winName].screenShotWindow.show();
      this.scrcpyWindows[winName].screenShotWindow.webContents.send('scrcpy:show-screen-shot-window', { port: 10020, winName });
      return;
    }
    const scrcpyScreenShotWindow = createBrowserWindow({
      width: 200,
      height: 350,
      frame: false,
      resizable: false,
      autoHideMenuBar: true,
      show: true,
      x: this.scrcpyWindows[winName].win!.getPosition()[0] + 185,
      y: this.scrcpyWindows[winName].win!.getPosition()[1] + 35,
      parent: this.scrcpyWindows[winName].win,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: `screen shot`,
    });

    if (isDev) {
      scrcpyScreenShotWindow.loadURL(`${VITE_DEV_SERVER_URL}?window_name=scrcpy_screen_shot_window&win_name=${winName}&adbAddr=${this.scrcpyWindows[winName].adbAddr}&port=${10020}`);
    } else {
      scrcpyScreenShotWindow.loadURL(path.join(RENDERER_DIST, `index.html?window_name=scrcpy_screen_shot_window&win_name=${winName}&adbAddr=${this.scrcpyWindows[winName].adbAddr}&port=${10020}`));
    }
    this.scrcpyWindows[winName].screenShotWindow = scrcpyScreenShotWindow;
  }
  private closeScreenShotWindow(winName: string) {
    this.scrcpyWindows[winName].screenShotWindow?.hide();
  }
  // private rotateScreen(winName: string, direction: EleApp.Direction) {
  //   console.log('rotateScreen', winName, direction);
  //   // this.initSizeWindow(winName, direction);
  // }
  private initSizeWindow(winName: string, direction: EleApp.Direction = 'vertical') {
    console.log('direction', direction);
    const scrcpy = this.scrcpyWindows[winName];
    const widthWin = direction === 'horizontal' ? SCRCPY_WIN_WIDTH_H : SCRCPY_WIN_WIDTH_V;
    const heightWin = direction === 'horizontal' ? SCRCPY_WIN_HEIGHT_H : SCRCPY_WIN_HEIGHT_V;
    const width = direction === 'horizontal' ? SCRCPY_WIDTH_H : SCRCPY_WIDTH_V;
    const height = direction === 'horizontal' ? SCRCPY_HEIGHT_H : SCRCPY_HEIGHT_V;
    if (scrcpy.win) {
      console.log(direction);
      console.log('winthWin, heightWin', widthWin, heightWin);
      scrcpy.win.setSize(widthWin, heightWin);
      this.embedScrcpyWindow({
        winName,
        width,
        height,
        scrcpyWindow: scrcpy.win,
        direction,
      });
    }
  }
}
