import { BrowserWindow, ipcMain } from 'electron';
import { type AppUpdater, autoUpdater } from 'electron-updater';

/**
 * 更新器
 */
export default class Updater {
  updater: AppUpdater = autoUpdater;

  constructor() {
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'http://web.shandianyun.vip/app/windows',
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
      mainWin?.webContents.send('update-progress', {
        progress: event.percent,
      });
    });
    this.updater.on('update-downloaded', () => {
      mainWin?.webContents.send('update-downloaded');
    });
    ipcMain.on('download-update', () => {
      this.updater.downloadUpdate();
    });
    ipcMain.on('updated-restart', () => {
      this.updater.quitAndInstall();
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
