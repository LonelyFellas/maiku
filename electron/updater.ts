import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

/**
 * 更新器
 */
export default class Updater {
  constructor() {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: 'http://maiku.npaas.cn/app/',
    });
  }

  checkForUpdates() {
    // 因为它默认为自动下载，所以这里设置成不自动下载.
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
  }

  autoUpdaerOn(mainWin: BrowserWindow | null) {
    autoUpdater.on('update-available', () => {
      if (mainWin) {
        mainWin.webContents.send('update-available', {
          aaa: 111,
          bbb: 222,
          ccc: 333,
        });
        dialog
          .showMessageBox({
            type: 'info',
            title: '有新版本可用',
            message: '有新版本可用，是否更新？',
            buttons: ['是', '否'],
          })
          .then((result) => {
            if (result.response && result.response === 0) {
              autoUpdater.downloadUpdate();
            }
          });
      }
    });

    autoUpdater.on('update-downloaded', () => {
      if (mainWin) {
        dialog
          .showMessageBox({
            type: 'info',
            title: '下载完成',
            message: '下载完成，是否重启应用？',
            buttons: ['是', '否'],
          })
          .then((result) => {
            if (result.response && result.response === 0) {
              autoUpdater.quitAndInstall();
            }
          });
      }
    });
  }
}
