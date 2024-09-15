import { spawn } from 'node:child_process';
import { getScrcpyCwd, killProcessWithWindows } from '/electron/utils';
import path from 'node:path';
import { BrowserWindow } from 'electron';
import { checkWindowExists } from '/electron/utils/scrcpy-koffi.ts';

export default class Scrcpy<T extends EleApp.ProcessObj> {
  processObj: EleApp.ProcessObj = {};
  pyProcessObj: EleApp.ProcessObj = {};
  processInfo: Record<string, SendChannelMap['scrcpy:start'][0]> = {};
  mainWindow: BrowserWindow | null = null;

  constructor(processObj: T, pyProcessObj: T) {
    this.processObj = processObj;
    this.pyProcessObj = pyProcessObj;
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
    const { adbAddr, id, name, type: paramsType } = params;
    const scrcpyCwd = getScrcpyCwd();

    // 重启
    if (paramsType === 'restart') {
      await this.killProcess(adbAddr);
    }

    this.taskFindWindow({ ...params, title: name, replyCallback });

    /**
     * --window-title: 窗口标题
     * --window-width: 窗口宽度
     * --window-height: 窗口高度
     * --window-x: 窗口x坐标
     * --window-y: 窗口y坐标
     */
    this.processObj[adbAddr] = spawn('scrcpy', ['-s', adbAddr, '--window-title', name, '--window-width', '1', '--window-height', '1', '--window-x', '-10000', '--window-y', '-10000', "--video-encoder 'c2.android.avc.encoder'"], {
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
      }
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
    killProcessWithWindows(this.processObj[deviceId].pid!);
    killProcessWithWindows(this.pyProcessObj[deviceId].pid!);
    delete this.processObj[deviceId];
    delete this.pyProcessObj[deviceId];
  }

  /**
   * 计时器任务查找当前窗口是否存在
   * 如果存在则停止查找，并发送到渲染层
   * 如果不存在则继续查找
   * @private
   * @param params
   */
  private taskFindWindow(
    params: SendChannelMap['scrcpy:start'][0] & {
      title: string;
      replyCallback: GenericsFn<[string, any]>;
    },
  ) {
    const { title: winName, id, name } = params;
    const maxAttempt = 10;
    let attempt = 0;

    const findWinTimeId = setInterval(() => {
      if (attempt >= maxAttempt) {
        clearInterval(findWinTimeId);
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          id,
          name,
          isSuccess: false,
        });
      }
      const checkRes = checkWindowExists(winName);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          id,
          name,
          isSuccess: true,
        });
        this.openPythonScrcpyWindow(params);
      }
      attempt++;
    }, 1000);
  }

  private openPythonScrcpyWindow(
    params: SendChannelMap['scrcpy:start'][0] & {
      title: string;
      replyCallback: GenericsFn<[string, any]>;
    },
  ) {
    const { adbAddr: deviceAddr, title: winName, token, id, replyCallback } = params;
    const pyPath = path.join(getScrcpyCwd(), 'main.exe');
    console.log('pyPath', pyPath);
    this.pyProcessObj[deviceAddr] = spawn(pyPath, [winName, deviceAddr, token, id.toString()]);
    this.pyProcessObj[deviceAddr].stdout.on('data', (data: AnyObj) => {
      const strData = data.toString();
      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
        replyCallback('scrcpy:stop', {
          isSuccess: false,
          id,
        });
      }
    });
    this.pyProcessObj[deviceAddr].stderr.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
      }
    });
    this.pyProcessObj[deviceAddr].on('close', () => {
      // 通知渲染层当前的scrcpy关闭了
      replyCallback('close-device-envId', id);
    });
  }
}
