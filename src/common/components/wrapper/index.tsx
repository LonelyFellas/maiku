import React, { useState } from 'react';
import { useLocalStorage } from '@darwish/hooks-core';
import IconClose from '@public/images/close.svg?react';
import IconMax from '@public/images/maximize.svg?react';
import IconMin from '@public/images/minimize.svg?react';
import IconRestore from '@public/images/restore.svg?react';
import { toNumber } from 'lodash';
import { useI18nConfig, isMacFunc, Constants, isScrcpyWindow } from '@common';
import pkg from '/package.json';
import Space from '../space';

export default function Wrapper(props: React.PropsWithChildren<object>) {
  const [windowClose, setWindowClose] = useLocalStorage<RememberState>(Constants.LOCAL_WINDOW_CLOSE, '');
  const [isWinMax, setWinMax] = useState(false);
  const [title] = useI18nConfig('config.basic.project_name');
  const isMac = isMacFunc();

  const urlObj = new URL(window.location.href);
  const params = new URLSearchParams(urlObj.search);
  let urlTitle = params.get('title') ?? `${title} ${pkg.version}`;
  if (urlTitle.length > 25) {
    urlTitle = `${urlTitle.slice(0, 25)} ...`;
  }

  const envId = toNumber(params.get('envId') ?? '-1');
  if (isMac) {
    return <>{props.children}</>;
  }

  const handleMinimize = () => {
    if (!isScrcpyWindow) {
      window.ipcRenderer.invoke('window:state', 'minimize');
    } else {
      window.ipcRenderer.send('scrcpy:window-state', 'minimize', envId);
    }
  };

  const handleMaximize = async () => {
    const isWinMaximized = await window.ipcRenderer.invoke('window:state', 'maximize');
    if (typeof isWinMaximized === 'boolean') {
      setWinMax(isWinMaximized);
    }
  };

  const handleClose = async () => {
    if (!isScrcpyWindow) {
      const res = await window.ipcRenderer.invoke('window:state', 'close', windowClose);
      /**
       * repsonse: 1 最小化托盘
       * response: 2 关闭窗口
       */
      if (typeof res === 'object' && res.checkboxChecked && res.response !== 2) {
        setWindowClose(res.response === 0 ? 'minimizeToTray' : 'close');
      }
    } else {
      window.ipcRenderer.send('scrcpy:window-state', 'close', envId);
    }
  };

  const MaxIconComponent = isWinMax ? IconRestore : IconMax;

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="z-[10000] drag flex justify-between items-center bg-bg_primary h-[30px]">
        <div className="h-full py-1 px-3 flex items-center">
          <img className="h-full border-white rounded-full" src="https://avatars.githubusercontent.com/u/38754760?v=4" />
          <span className="ml-2 text-sm">{urlTitle}</span>
        </div>
        <Space className="no_drag h-full" size={1}>
          <div className="all_flex hover:bg-black/[0.1] h-full w-10" onClick={handleMinimize}>
            <IconMin className="h-3 w-3 cursor-pointer fill-black" />
          </div>
          <div
            className="all_flex hover:bg-black/[0.2] h-full w-10"
            onClick={handleMaximize}
            style={{
              display: isScrcpyWindow ? 'none' : 'flex',
            }}
          >
            <MaxIconComponent className="h-3 w-3 cursor-pointer fill-black" />
          </div>
          <div className="group all_flex hover:bg-red-500 h-full w-10" onClick={handleClose}>
            <IconClose className="h-3 w-3 cursor-pointer fill-black group-hover:fill-white" />
          </div>
        </Space>
      </div>
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
