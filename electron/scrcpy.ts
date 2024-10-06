import { spawn, exec } from 'child_process';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';
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
  isSupportAudioDevice = true;
  scrcpyWindows: Record<
    string,
    {
      win?: BrowserWindow;
      pid?: number;
      pidSpawn?: number;
      imgHostName: string;
      imgPort: number;
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
    this.checkAudioDevices();
    this.processObj = processObj;
    ipcMain.on('show-scrcpy-window', (_, winName) => {
      this.scrcpyWindows[winName]?.win?.show();
    });
    ipcMain.on('set-resizebale-true-scrcpy-window', (_, winName) => {
      this.scrcpyWindows[winName]?.win?.setResizable(true);
    });
    ipcMain.on('set-adb-keyboard', (_, winName, action) => this.inputADBKeybord(winName, action));
    ipcMain.handle('install-adb-keyboard', (_, winName) => {
      const { adbAddr } = this.scrcpyWindows[winName];
      this.scrcpyWindows[winName].isInstallADBKeyboard = true;
      const apkPath = path.join(this.scrcpyCwd, '/ADBKeyboard.apk');
      return new Promise((resolve) => {
        const installData = spawn(`adb connect ${adbAddr} && adb -s ${adbAddr} install ${apkPath}`, {
          cwd: this.scrcpyCwd,
          shell: true,
        });
        installData.stdout.on('data', (data: AnyObj) => {
          resolve(data);
        });
        installData.stderr.on('data', (data: AnyObj) => {
          resolve(data);
        });
      });
    });
    ipcMain.on('screenshot-scrcpy-window', (_, winName) => this.screenshot(winName));
  }

  public async startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    if (this.scrcpyWindows[params.name] && this.scrcpyWindows[params.name].win) {
      this.scrcpyWindows[params.name].win?.show(); // 如果已经打开了窗口，则直接激活当前窗口
      return;
    }
    const { name: winName = '测试窗口', adbAddr, imgHostName, imgPort } = params;
    this.scrcpyWindows[params.name] = { adbAddr, imgHostName, imgPort } as any;
    const direction: EleApp.Direction = 'vertical';

    const scrcpyWindow = createBrowserWindow({
      width: direction === 'vertical' ? SCRCPY_WIN_WIDTH_V : SCRCPY_WIN_WIDTH_H,
      height: direction === 'vertical' ? SCRCPY_WIN_HEIGHT_V : SCRCPY_WIN_HEIGHT_H,
      frame: true,
      resizable: false,
      autoHideMenuBar: true,
      show: false,
      modal: false,
      skipTaskbar: false,
      movable: false,
      backgroundColor: '#000000',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: `[${winName}]`,
    });

    if (isDev) {
      scrcpyWindow.loadURL(`http://localhost:8080?winName=${winName}&adbAddr=${adbAddr}`);
      scrcpyWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      scrcpyWindow.loadURL(path.join(RENDERER_DIST, `scrcpy/index.html?winName=${winName}&adbAddr=${adbAddr}`));
    }

    this.scrcpyWindows[winName] = {
      ...this.scrcpyWindows[winName],
      win: scrcpyWindow,
      imgHostName: params.imgHostName,
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
    const scrcpySpawn = spawn(
      'scrcpy',
      ['-s', adbAddr, '--window-title', winName, '--window-width', '1', '--window-height', '1', '--window-x', '-10000', '--window-y', '-10000', "--video-encoder 'c2.android.avc.encoder'", this.isSupportAudioDevice ? '' : '--no-audio'],
      {
        cwd: this.scrcpyCwd,
        shell: true,
      },
    );
    scrcpySpawn.stdout.on('data', async (data: AnyObj) => {
      scrcpy.pidSpawn = scrcpySpawn.pid ?? -1;
      const strData = data.toString();

      if (strData.includes('Renderer: direct3d')) {
        const findHwnd = await this.findScrcpyWindow(winName);
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
    if (['undefined', 'null', null, undefined, '', 0].includes(scrcpyNativeHwnd)) {
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

    // // 重置ADB键盘
    // if (scrcpy.startADBKeybord && scrcpy.adbAddr) {
    //   spawn(`adb -s ${scrcpy.adbAddr} shell ime reset`, {
    //     shell: true,
    //     cwd: this.scrcpyCwd,
    //   });
    // }
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
      scrcpy.win.setResizable(false);
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
        scrcpy.win?.setMovable(true);
      }, 1000);
    }
  }

  private async screenshot(winName: string) {
    const scrcpy = this.scrcpyWindows[winName];
    const screenshotWindow = createBrowserWindow({
      width: 200,
      height: 350,
      frame: false,
      resizable: false,
      show: true,
      backgroundColor: '#000000',
      x: scrcpy.win!.getPosition()[0] + 185,
      y: scrcpy.win!.getPosition()[1] + 35,
      parent: scrcpy.win,
      modal: true,
      title: `[${winName}]截图`,
    });

    if (isDev) {
      screenshotWindow.loadURL(path.join(__dirname, `../scrcpy/screen-shot.html?winName=${winName}&imgHostName=${scrcpy.imgHostName}&imgPort=${scrcpy.imgPort}`));
    } else {
      screenshotWindow.loadURL(path.join(RENDERER_DIST, `scrcpy/screen-shot.html?winName=${winName}&imgHostName=${scrcpy.imgHostName}&imgPort=${scrcpy.imgPort}`));
    }
    screenshotWindow.webContents.on('dom-ready', async () => {
      screenshotWindow.show();
      setTimeout(() => {
        screenshotWindow.close();
      }, 3000);
      const t = new Date().getTime();
      const saveName = `../../${t}.jpeg`;
      const downloadRes = await this.downloadImage(`http://${scrcpy.imgHostName}/proxy-api/task=snap&level=2?port=${scrcpy.imgPort}&t=${t}`, path.join(RENDERER_DIST, saveName));
      if (downloadRes) {
        spawn(`adb -s ${scrcpy.adbAddr} push ${path.join(RENDERER_DIST, saveName)} /sdcard/Pictures`, {
          cwd: this.scrcpyCwd,
          shell: true,
        });
      }
    });
  }
  private checkAudioDevices() {
    // 检查电脑系统音频设备是否可用
    exec('powershell -Command "Get-Service -Name Audiosrv | Select-Object -ExpandProperty Status"', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      mainWin?.webContents.send('error', stdout);
      if (stdout.includes('Running')) {
        this.isSupportAudioDevice = true;
      } else {
        this.isSupportAudioDevice = false;
      }
    });
  }
  private downloadImage(url: string, outputPath: string) {
    // 下载图片函数
    const file = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      http
        .get(url, (response) => {
          // 检查响应状态码是否成功
          if (response.statusCode !== 200) {
            console.error(`Failed to get image. Status Code: ${response.statusCode}`);
            reject(false);
            return;
          }

          // 将响应的数据写入文件
          response.pipe(file);

          // 文件写入完成后的处理
          file.on('finish', () => {
            resolve(true);
            file.close(() => {
              console.log('Image downloaded successfully');
            });
          });
        })
        .on('error', (err) => {
          reject(false);
          fs.unlink(outputPath, () => {}); // 出现错误时删除未完整的文件
          console.error('Error downloading image:', err.message);
        });
    });
  }
}
