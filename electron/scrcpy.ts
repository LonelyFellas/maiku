import { spawn, exec } from 'child_process';
import path from 'path';
import { BrowserWindow, ipcMain, screen } from 'electron';
import { mainWin, RENDERER_DIST } from './main';
import { createBrowserWindow, __dirname, isDev, getScrcpyCwd } from './utils';
import { embedWindow, findWindow, getElectronWindow } from './utils/scrcpy-koffi';

const SCRCPY_WIDTH_V = 380;
const SCRCPY_HEIGHT_V = 702;
const SCRCPY_WIDTH_H = 676;
const SCRCPY_HEIGHT_H = 380;
const SCRCPY_WIN_WIDTH_V = 435;
const SCRCPY_WIN_HEIGHT_V = 712;
const SCRCPY_WIN_WIDTH_H = 732;
const SCRCPY_WIN_HEIGHT_H = 416;
export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  scrcpyCwd = getScrcpyCwd();
  scrcpyWindows: Record<
    string,
    {
      win?: BrowserWindow;
      pid?: number;
      pidSpawn?: number;
      imgPort: string;
      hwnd?: number;
      id?: number;
      screenShotWindow?: BrowserWindow | null;
      adbAddr?: string;
      scrcpyWidth?: number;
      scrcpyHeight?: number;
      direction: EleApp.Direction;
      startADBKeybord?: boolean;
      isInstallADBKeyboard?: boolean;
    }
  > = {};
  constructor(processObj: T) {
    this.processObj = processObj;
    ipcMain.on('show-scrcpy-window', (_, winName) => {
      console.log(`show-scrcpy-window ${winName}`);
      this.scrcpyWindows[winName]?.win?.show();
    });
    ipcMain.on('set-resizebale-true-scrcpy-window', (_, winName) => {
      // this.scrcpyWindows[winName]?.win?.setResizable(true);
    });
    ipcMain.on('set-adb-keyboard', (_, winName, action) => this.inputADBKeybord(winName, action));
    ipcMain.on('install-adb-keyboard', (_, winName) => {
      const { adbAddr, isInstallADBKeyboard } = this.scrcpyWindows[winName];
      if (isInstallADBKeyboard) return;
      this.scrcpyWindows[winName].isInstallADBKeyboard = true;
      const apkPath = path.join(this.scrcpyCwd, '/ADBKeyboard.apk');
      spawn(`adb -s ${adbAddr} install ${apkPath}`, {
        cwd: this.scrcpyCwd,
        shell: true,
      });
    });
  }

  public async startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    if (this.scrcpyWindows[params.name] && this.scrcpyWindows[params.name].win) return;
    const { name: winName = '测试窗口', adbAddr, imgPort } = params;
    this.scrcpyWindows[params.name] = { adbAddr } as any;
    const direction: EleApp.Direction = 'vertical';

    const scrcpyWindow = createBrowserWindow({
      width: direction === 'vertical' ? SCRCPY_WIN_WIDTH_V : SCRCPY_WIN_WIDTH_H,
      height: direction === 'vertical' ? SCRCPY_WIN_HEIGHT_V : SCRCPY_WIN_HEIGHT_H,
      frame: true,
      // resizable: true,
      autoHideMenuBar: true,
      show: true,
      modal: false,
      skipTaskbar: false,
      movable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: `[${winName}]`,
    });

    if (isDev) {
      scrcpyWindow.loadURL(`http://localhost:8080?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`);
      scrcpyWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      mainWin?.webContents.send('error', path.join(RENDERER_DIST, `scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`));
      scrcpyWindow.loadURL(path.join(RENDERER_DIST, `scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}&imgPort=${imgPort}`));
    }

    this.scrcpyWindows[winName] = {
      ...this.scrcpyWindows[winName],
      win: scrcpyWindow,
      imgPort: params.imgPort,
      direction,
      pid: -1,
    };
    this.startScrcpyNativeWindow(params, replyCallback, scrcpyWindow);
  }

  private startScrcpyNativeWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>, scrcpyWindow: BrowserWindow) {
    let isInitWindow = true;
    const { adbAddr, name: winName = '测试窗口', id } = params;
    const scrcpy = this.scrcpyWindows[winName];
    // 初始化scrcpy的pid和pidSpawn
    scrcpy.pid = -1;
    scrcpy.pidSpawn = -1;
    if (scrcpy.pid !== -1) return;
    const scrcpySpawn = spawn('scrcpy', ['-s', adbAddr, '--window-title', winName, '--window-width', '1', '--window-height', '1', '--window-x', '-10000', '--window-y', '-10000', "--video-encoder 'c2.android.avc.encoder'"], {
      cwd: this.scrcpyCwd,
      shell: true,
    });
    scrcpySpawn.stdout.on('data', async (data: AnyObj) => {
      scrcpy.pidSpawn = scrcpySpawn.pid ?? -1;
      const strData = data.toString();

      if (strData.includes('Renderer: direct3d')) {
        const findHwnd = await this.findScrcpyWindow(winName);
        console.log(`findHwnd: ${findHwnd}`);
        if (!findHwnd) {
          this.stopScrcpyNativeWindow(winName);
          return;
        }
        scrcpy.hwnd = findHwnd;
      }

      const isVertical = strData.includes('Texture: 720x1280');
      const isHorizontal = strData.includes('Texture: 1280x720');
      if (isVertical || isHorizontal) {
        const direction = isVertical ? 'vertical' : 'horizontal';
        if (this.scrcpyWindows[winName] && this.scrcpyWindows[winName].win) {
          this.scrcpyWindows[winName].direction = direction;
        }
        this.initSizeWindow(winName, direction, isInitWindow);

        if (isInitWindow) isInitWindow = false;
      }
      console.error(`stdout: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
        this.scrcpyWindows[winName].win?.close();
        this.stopScrcpyNativeWindow(winName);
        return;
      }

      if (this.scrcpyWindows[id]) return;
    });
    scrcpySpawn.stderr.on('data', (data: AnyObj) => {
      scrcpy.pidSpawn = scrcpySpawn.pid ?? -1;
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
          scrcpy.pid = parseInt(pid);
        }
      });
    });
    scrcpyWindow.on('closed', () => {
      this.stopScrcpyNativeWindow(winName);
    });
  }

  // 找到scrcpy窗口的hwnd 递归查找10次，每次间隔1秒
  private async findScrcpyWindow(winName: string, count = 10) {
    const scrcpyNativeHwnd = await findWindow(winName);
    if (count === 0) {
      console.error(`Can't find scrcpy window ${winName}`);
      return undefined;
    }
    if (scrcpyNativeHwnd === 'undefined') {
      setTimeout(() => {
        this.findScrcpyWindow(winName, count - 1);
      }, 1000);
      return;
    }
    return scrcpyNativeHwnd;
  }

  private async stopScrcpyNativeWindow(winName: string) {
    const scrcpy = this.scrcpyWindows[winName];
    scrcpy.win = undefined;
    if (scrcpy.pid && scrcpy.pid !== -1) {
      process.kill(scrcpy.pid);
      scrcpy.pid = -1;
    }
    if (scrcpy.pidSpawn && scrcpy.pidSpawn !== -1) {
      process.kill(scrcpy.pidSpawn);
      scrcpy.pidSpawn = -1;
    }

    // 重置ADB键盘
    if (scrcpy.startADBKeybord && scrcpy.adbAddr) {
      spawn(`adb -s ${scrcpy.adbAddr} shell ime reset`, {
        shell: true,
        cwd: this.scrcpyCwd,
      });
    }
  }

  private inputADBKeybord(winName: string, action: 'start' | 'close') {
    const scrcpy = this.scrcpyWindows[winName];
    scrcpy.startADBKeybord = action === 'start';
  }

  private initSizeWindow(winName: string, direction: EleApp.Direction = 'vertical', isInitWindow: boolean) {
    const scrcpy = this.scrcpyWindows[winName];
    const widthWin = direction === 'horizontal' ? SCRCPY_WIN_WIDTH_H : SCRCPY_WIN_WIDTH_V;
    const heightWin = direction === 'horizontal' ? SCRCPY_WIN_HEIGHT_H : SCRCPY_WIN_HEIGHT_V;
    const width = direction === 'horizontal' ? SCRCPY_WIDTH_H : SCRCPY_WIDTH_V;
    const height = direction === 'horizontal' ? SCRCPY_HEIGHT_H : SCRCPY_HEIGHT_V;

    if (scrcpy.win) {
      scrcpy.win.setSize(widthWin, heightWin);
      // scrcpy.win.setResizable(false);
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
        scrcpy.win!.setMovable(true);
      }, 1000);
    }
  }
}
