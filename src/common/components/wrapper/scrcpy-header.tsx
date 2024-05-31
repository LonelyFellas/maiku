import React from 'react';
import { useI18nConfig, getParamsUrl, useDeviceToast } from '@common';
import IconClose from '@img/close.svg?react';
import IconMin from '@img/minimize.svg?react';
import pkg from '/package.json';
import Space from '../space';

export default function ScrcpyHeader(props: React.PropsWithChildren<object>) {
  const [title] = useI18nConfig('config.basic.project_name');
  const toastRecord = useDeviceToast().toastRecord;

  const [titleParam, deviceAddrParam] = getParamsUrl(['title', 'deviceAddr']);
  let urlTitle = titleParam ?? `${title} ${pkg.version}`;
  if (urlTitle.length > 25) {
    urlTitle = `${urlTitle.slice(0, 25)} ...`;
  }

  const deviceAddr = deviceAddrParam || '-1';
  const handleMinimize = () => {
    window.ipcRenderer.send('scrcpy:window-state', 'minimize', deviceAddr);
  };

  const handleClose = async () => {
    window.ipcRenderer.send('scrcpy:window-state', 'close', deviceAddr);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="z-[10000] flex h-[30px] w-full">
        <div className="drag flex justify-between items-center bg-bg_primary flex-1 min-w-[430px]">
          <div className="h-full py-1 px-3 flex items-center">
            <img className="h-full border-white rounded-full" src="https://avatars.githubusercontent.com/u/38754760?v=4" alt="avatar" />
            <span className="ml-2 text-sm">{urlTitle}</span>
          </div>
          <Space className="no_drag h-full" size={1}>
            <div className="all_flex hover:bg-black/[0.1] h-full w-10" onClick={handleMinimize}>
              <IconMin className="h-3 w-3 cursor-pointer fill-black" />
            </div>
            <div className="group all_flex hover:bg-red-500 h-full w-10" onClick={handleClose}>
              <IconClose className="h-3 w-3 cursor-pointer fill-black group-hover:fill-white" />
            </div>
          </Space>
        </div>
        {toastRecord[deviceAddr] ? <div className="bg-toast w-[300px] bg-transparent"></div> : null}
      </div>
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
