import {
  Tray,
  nativeImage,
  Menu,
  type BrowserWindow,
  type App,
} from 'electron';

/**
 * 创建托盘
 * @param mainWindow 主窗口
 * @param app Electron应用实例
 *
 */
export function createTray(mainWindow: BrowserWindow, app: App) {
  // 创建系统托盘图标
  const icon = nativeImage.createFromPath('build/icons/favicon.ico');
  const tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开迈库',
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: '退出',
      click: function () {
        app.quit();
      },
    },
  ]);

  // 监听托盘图标点击事件 显示主窗口
  tray.on('click', () => {
    mainWindow.show();
  });
  tray.setToolTip('迈库');
  tray.setContextMenu(contextMenu);
}
