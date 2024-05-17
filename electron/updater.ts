import { BrowserWindow, ipcMain } from 'electron';
import { autoUpdater, type AppUpdater } from 'electron-updater';

/**
 * 更新器
 */
export default class Updater {
  updater: AppUpdater = autoUpdater;

  constructor() {
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'http://maiku.npaas.cn/app/',
    });
  }

  checkForUpdates() {
    // 因为它默认为自动下载，所以这里设置成不自动下载.
    this.updater.autoDownload = false;
    this.updater.checkForUpdates();
  }

  autoUpdaerOn(mainWin: BrowserWindow | null) {
    this.updater.on('update-available', () => {
      if (mainWin) {
        mainWin.webContents.send('update-available', {
          isUpdate: true,
        });
      }
    });

    this.updater.on('download-progress', (event) => {
      mainWin?.webContents.send('error', '11111');
      if (mainWin) {
        mainWin.webContents.send('update-progress', {
          progress: event.percent,
        });
      }
    });
    this.updater.on('update-downloaded', () => {
      mainWin?.webContents.send('error', '33333');
    });
    ipcMain.on('download-update', () => {
      mainWin?.webContents.send('error', '22222');
      this.updater.downloadUpdate();
    });

    // this.updater.on('update-downloaded', () => {
    //   if (mainWin) {
    //     dialog
    //       .showMessageBox({
    //         type: 'info',
    //         title: '下载完成',
    //         message: '下载完成，是否重启应用？',
    //         buttons: ['是', '否'],
    //       })
    //       .then((result) => {
    //         if (result.response && result.response === 0) {
    //           this.updater.quitAndInstall();
    //         }
    //       });
    //   }
    // });
  }
}
