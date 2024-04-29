import React, { useState } from 'react';
import IconClose from '@img/close.svg?react';
import IconMax from '@img/maximize.svg?react';
import IconMin from '@img/minimize.svg?react';
import IconRestore from '@img/restore.svg?react';
import pkg from '/package.json';
import Space from '../space';
import { useI18nConfig, isMacFunc } from '@common';

export default function Wrapper(props: React.PropsWithChildren<object>) {
  const [isWinMax, setWinMax] = useState(false);
  const [title] = useI18nConfig('config.basic.project_name');
  const isMac = isMacFunc();

  if (isMac) {
    return <>{props.children}</>;
  }

  const handleMinimize = () => {
    window.ipcRenderer.invoke('window:state', 'minimize');
  };

  const handleMaximize = async () => {
    const isWinMaximized = await window.ipcRenderer.invoke(
      'window:state',
      'maximize',
    );
    setWinMax(isWinMaximized);
  };

  const handleClose = () => {
    window.ipcRenderer.invoke('window:state', 'close');
  };

  const MaxIconComponent = isWinMax ? IconRestore : IconMax;

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="z-[10000] drag flex justify-between items-center bg-bg_primary h-[30px]">
        <div className="h-full py-1 px-3 flex items-center">
          <img
            className="h-full border-white rounded-full"
            src="https://avatars.githubusercontent.com/u/38754760?v=4"
          />
          <span className="ml-2 text-sm">
            {title} {pkg.version}
          </span>
        </div>
        <Space className="no_drag h-full" size={1}>
          <div
            className="all_flex hover:bg-black/[0.1] h-full w-10"
            onClick={handleMinimize}
          >
            <IconMin className="h-3 w-3 cursor-pointer fill-black" />
          </div>
          <div
            className="all_flex hover:bg-black/[0.2] h-full w-10"
            onClick={handleMaximize}
          >
            <MaxIconComponent className="h-3 w-3 cursor-pointer fill-black" />
          </div>
          <div
            className="group all_flex hover:bg-red-500 h-full w-10"
            onClick={handleClose}
          >
            <IconClose className="h-3 w-3 cursor-pointer fill-black group-hover:fill-white" />
          </div>
        </Space>
      </div>
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
