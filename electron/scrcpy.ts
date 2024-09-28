import { createBrowserWindow, __dirname, isDev, getScrcpyCwd } from './utils';
import { spawn, exec } from 'child_process';
import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { embedWindow, findWindow, getElectronWindow } from './utils/scrcpy-koffi';
import { mainWin, RENDERER_DIST } from './main';

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
  scrcpyCwd = getScrcpyCwd();
  scrcpyWindows: Record<string, { win?: BrowserWindow; pid?: number; imgPort: string; hwnd?: number; id?: number; screenShotWindow?: BrowserWindow | null; adbAddr?: string; scrcpyWidth?: number; scrcpyHeight?: number; direction: EleApp.Direction }> =
    {};
  constructor(processObj: T) {
    this.processObj = processObj;
  }

  public async startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    const { name: winName = '测试窗口', adbAddr, imgPort } = params;
    const direction: EleApp.Direction = 'vertical';

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

    if (isDev) {
      scrcpyWindow.loadURL(`http://127.0.0.1:5500/scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`);
    } else {
      mainWin?.webContents.send('error', path.join(RENDERER_DIST, `scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`));
      scrcpyWindow.loadURL(path.join(RENDERER_DIST, `scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`));
    }

    scrcpyWindow.on('ready-to-show', () => {
      this.startScrcpyNativeWindow(params, replyCallback, scrcpyWindow);
    });

    this.scrcpyWindows[winName] = {
      win: scrcpyWindow,
      imgPort: params.imgPort,
      direction,
      pid: -1,
    };
  }

  private startScrcpyNativeWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>, scrcpyWindow: BrowserWindow) {
    let isInitWindow = true;
    const pids = {
      spawnPid: -1,
      scrcpyPid: -1,
    };
    const { adbAddr, name: winName = '测试窗口', id } = params;
    if (this.scrcpyWindows[winName].pid !== -1) return;
    const scrcpySpawn = spawn('scrcpy', ['-s', adbAddr, '--window-title', winName, '--window-width', '1', '--window-height', '1', '--window-x', '-10000', '--window-y', '-10000', "--video-encoder 'c2.android.avc.encoder'"], {
      cwd: this.scrcpyCwd,
      shell: true,
    });
    scrcpySpawn.stdout.on('data', async (data: AnyObj) => {
      pids.spawnPid = scrcpySpawn.pid ?? -1;
      const strData = data.toString();
      if (strData.includes('Renderer: direct3d')) {
        const scrcpyNativeHwnd = await findWindow(winName);
        this.scrcpyWindows[winName].hwnd = scrcpyNativeHwnd;
      }
      if (strData.includes('Texture: 720x1280')) {
        if (this.scrcpyWindows[winName] && this.scrcpyWindows[winName].win) {
          this.scrcpyWindows[winName].direction = 'vertical';
        }
        this.initSizeWindow(winName, 'vertical', isInitWindow);
        if (isInitWindow) isInitWindow = false;
      } else if (strData.includes('Texture: 1280x720')) {
        if (this.scrcpyWindows[winName] && this.scrcpyWindows[winName].win) {
          this.scrcpyWindows[winName].direction = 'horizontal';
        }
        this.initSizeWindow(winName, 'horizontal', isInitWindow);
        if (isInitWindow) isInitWindow = false;
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
    scrcpySpawn.stderr.on('data', (data: AnyObj) => {
      pids.scrcpyPid = scrcpySpawn.pid ?? -1;
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
      }
    });
    scrcpySpawn.on('close', () => {
      // 通知渲染层当前的scrcpy关闭了
      replyCallback('close-device-envId', id);
    });

    // 监听 scrcpy 启动事件
    scrcpySpawn.on('spawn', () => {
      exec(`wmic process where "name='scrcpy.exe' and commandline like '%${winName}%'" get processid`, (error, stdout) => {
        if (error) {
          console.error(`Error fetching PID: ${error}`);
          return;
        }

        const lines = stdout.split('\n').filter((line) => line.trim());
        if (lines.length > 1) {
          const pid = lines[1].trim(); // 第二行是 PID
          pids.scrcpyPid = parseInt(pid);
          this.scrcpyWindows[winName].pid = pids.scrcpyPid;
        }
      });
    });
    scrcpyWindow.on('closed', () => {
      if (scrcpySpawn.pid !== -1) {
        if (pids.scrcpyPid !== -1) {
          process.kill(pids.scrcpyPid);
          this.scrcpyWindows[winName].pid = -1;
        }
        if (pids.scrcpyPid !== -1) {
          process.kill(pids.spawnPid);
        }
      }
    });
  }

  private initSizeWindow(winName: string, direction: EleApp.Direction = 'vertical', isInitWindow: boolean) {
    const scrcpy = this.scrcpyWindows[winName];
    const widthWin = direction === 'horizontal' ? SCRCPY_WIN_WIDTH_H : SCRCPY_WIN_WIDTH_V;
    const heightWin = direction === 'horizontal' ? SCRCPY_WIN_HEIGHT_H : SCRCPY_WIN_HEIGHT_V;
    const width = direction === 'horizontal' ? SCRCPY_WIDTH_H : SCRCPY_WIDTH_V;
    const height = direction === 'horizontal' ? SCRCPY_HEIGHT_H : SCRCPY_HEIGHT_V;

    if (scrcpy.win) {
      scrcpy.win.setSize(widthWin, heightWin);
      this.embedScrcpyWindow({
        winName,
        width,
        height,
        direction,
        isInitWindow,
      });
    }
  }
  public embedScrcpyWindow({ winName, width, height, direction = 'vertical', isInitWindow = true }: { winName: string; width: number; height: number; direction?: EleApp.Direction; isInitWindow?: boolean }) {
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
      const embedWindowFn = () =>
        embedWindow({
          parentHwnd: parentScrcpyHwnd,
          nativeHwnd: scrcpy.hwnd!,
          scrcpyWindow: scrcpy.win!,
          width: adjustedWidth,
          height: adjustedHeight,
          direction,
        });
      if (!isInitWindow) {
        embedWindowFn();
        return;
      }
      setTimeout(() => {
        embedWindow({
          parentHwnd: parentScrcpyHwnd,
          nativeHwnd: scrcpy.hwnd!,
          scrcpyWindow: scrcpy.win!,
          width: adjustedWidth,
          height: adjustedHeight,
          direction,
        });
      }, 3000);

      // 记录窗口的大小
      this.scrcpyWindows[winName].scrcpyHeight = height;
      this.scrcpyWindows[winName].scrcpyWidth = width;
    }
  }
}
