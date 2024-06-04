import { spawn, execFile } from 'node:child_process';
import { getScrcpyCwd, isMac, killProcessWithWindows } from '/electron/utils';
import path from 'node:path';
import { BrowserWindow } from 'electron';
import { __dirname } from '/electron/utils';
import { checkWindowExists } from '/electron/utils/scrcpy-koffi.ts';

export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  processInfo: Record<string, SendChannelMap['scrcpy:start'][0]> = {};
  mainWindow: BrowserWindow | null = null;

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
   * 计时器任务查找当前窗口是否存在
   * 如果存在则停止查找，并发送到渲染层
   * 如果不存在则继续查找
   * @param winName 窗口的名字，必须和scrcpy窗口的名字一致
   * @param deviceAddr
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
      const checkRes = checkWindowExists(winName);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          envId,
          backupName,
          isSuccess: true,
        });
        this.openPythonScrcpyWindow(winName, deviceAddr);
      }
      attempt++;
    }, 1000);
  }

  private openPythonScrcpyWindow(winName: string, deviceAddr: string) {
    const pyPath = path.join(getScrcpyCwd(), 'main.exe');
    execFile(pyPath, [winName, deviceAddr], (error, stdout, stderr) => {
      if (error) {
        console.error(`stderr: ${error}`);
        return;
      }
      console.log(`Output: ${stdout}`);
      if (stderr) {
        console.error(`Error: ${stderr}`);
      }
    });
  }
}
