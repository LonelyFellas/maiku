import { scrcpyProcessObj } from '/electron/main.ts';
import { spawn } from 'node:child_process';
import { getScrcpyCwd } from '/electron/utils';
import { checkWindowExists } from './utils/getActiveWindowRect';
import { BrowserWindow } from 'electron';

export default class Scrcpy<T extends EleApp.ProcessObj> {
  progressObj = {};
  mainWindow: BrowserWindow | null = null;

  constructor(obj: T) {
    this.progressObj = obj;
  }

  /**
   * 启动scrcpy窗口
   * @param params 启动所需要的一些参数
   * @param params.deviceId 设备id
   * @param params.envId 环境Id
   * @param params.name 环境名字
   * @param replyCallback 对渲染层通信的回调函数
   */
  public startWindow(params: SendChannelMap['scrcpy:start'][0], replyCallback: GenericsFn<[string, any]>) {
    const { deviceId, envId, backupName, envName } = params;
    const title = `${envName}-(${backupName})`;
    console.log('envId', envId);
    const scrcpyCwd = getScrcpyCwd();

    this.taskFindWindow(title, envId, backupName);
    const listenWindowTimeId: NodeJS.Timeout | null = null;
    scrcpyProcessObj[deviceId] = spawn('scrcpy', ['-s', deviceId, '--window-title', title, '--window-width', '381', '--window-height', '675'], {
      cwd: scrcpyCwd,
      shell: true,
    });
    scrcpyProcessObj[deviceId].stdout.on('data', (data: AnyObj) => {
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
    scrcpyProcessObj[deviceId].stderr.on('data', (data: AnyObj) => {
      const strData = data.toString();
      console.log(`stdrr: ${strData}`);

      if (strData.includes('ERROR')) {
        replyCallback('error', strData);
      }
    });
    scrcpyProcessObj[deviceId].on('close', () => {
      // 通知渲染层当前的scrcpy关闭了
      replyCallback('close-device-envId', envId);
    });
  }

  /** 设置主窗口 */
  public setMainWindow(mainWin: BrowserWindow) {
    this.mainWindow = mainWin;
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
  private taskFindWindow(winName: string, envId: number, backupName: string) {
    const findWinTimeId = setInterval(() => {
      const checkRes = this.checkCurrentWindowExist(winName);
      if (checkRes && findWinTimeId) {
        clearInterval(findWinTimeId);
        console.log(envId, 'envId');
        this.mainWindow?.webContents.send('scrcpy:start-window-open', {
          envId,
          backupName,
        });
      }
    }, 1000);
  }
}
