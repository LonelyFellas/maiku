import { App, Button, Flex, message, notification, Spin } from 'antd';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getParamsUrl, toNumber } from '@common';
import { getEnvByIdService } from '@api';
import IconAllPid from '@img/all-pid.svg?react';
import IconApp from '@img/app-store.svg?react';
import IconBack from '@img/back.svg?react';
import IconMainMenu from '@img/main-menu.svg?react';
import IconMore from '@img/more.svg?react';
import IconRotary from '@img/rotary-phone.svg?react';
import IconScreenShot from '@img/screen-shot.svg?react';
import IconSpeedUp from '@img/speed-up.svg?react';
import IconUpload from '@img/upload.svg?react';
import IconVolumeDown from '@img/volume-down.svg?react';
import IconVolumeUp from '@img/volume-up.svg?react';
import './index.css';

export default function ScrcpyWindow() {
  const [deviceAddr, envId] = getParamsUrl(['deviceAddr', 'envId']);
  const [api, contextHolder] = notification.useNotification({
    getContainer: () => document.querySelector('.scrcpy-transparent-area') as HTMLElement,
    maxCount: 1,
  });

  const handleDownloadScreenPic = (url: string) => {
    window.ipcRenderer.send('download-file', url, {
      isDialog: true,
      title: '保存截图',
      message: '正在下载...',
    });
  };
  const detailMutation = useMutation({
    mutationKey: ['env-detail-by-id'],
    mutationFn: getEnvByIdService,
    onSuccess: (data) => {
      console.log(data);
      api.open({
        message: ``,
        description: (
          <div className="flex flex-col items-center gap-2">
            <img src={data.screenShot} alt="screen shot" />
            <Button onClick={() => handleDownloadScreenPic(data.screenShot)}>下载截图</Button>
          </div>
        ),
        placement: 'topRight',
        duration: 3000,
        closeIcon: null,
        style: {
          width: '250px',
          borderRadius: '5px',
        },
      });
    },
  });

  /**
   * 截屏
   */
  const handleScreenshot = () => {
    if (deviceAddr) {
      const formatedTime = dayjs().format('YYYY_MM_DD_HH_mm_ss');
      const command = `screencap /sdcard/Pictures/scrrenshot_${formatedTime}.png`;
      detailMutation.mutate({ id: toNumber(envId) });
      window.adbApi.shell(deviceAddr, command);
    }
  };
  /**
   * 功能按钮点击事件
   * * 音量+
   * * 音量-
   * * 返回键
   * * 返回主菜单键
   * * 打开系统功能页面键,
   */
  const handlerSystemFeature = (keycode: string) => {
    if (deviceAddr) {
      window.adbApi.shell(deviceAddr, `input keyevent ${keycode}`);
    }
  };
  return (
    <div className="flex h-full w-full">
      <div className="all_flex bg-[#d7dae3] w-[381px]">
        <div className="text-center">
          <Spin size="large" />
          <h1 className="mt-2 text-primary">正在启动云机 ...</h1>
        </div>
      </div>
      <div className="h-full flex flex-col justify-between text-[13px] items-center w-[49px] pb-3 bg-[#d7dae3]">
        <Flex vertical className="w-full text-center pt-3 gap-3">
          <OperationButton text="旋转" IconFC={IconRotary} />
          <OperationButton text="截屏" IconFC={IconScreenShot} onClick={handleScreenshot} />
          <OperationButton text="上传" IconFC={IconUpload} />
          <OperationButton text="音+" IconFC={IconVolumeUp} onClick={() => handlerSystemFeature('KEYCODE_VOLUME_UP')} />
          <OperationButton text="音-" IconFC={IconVolumeDown} onClick={() => handlerSystemFeature('KEYCODE_VOLUME_DOWN')} />
          <OperationButton text="加速" IconFC={IconSpeedUp} />
          <OperationButton text="更多" IconFC={IconMore} />
        </Flex>
        <Flex vertical className="w-full gap-3">
          <OperationButton text="" IconFC={IconBack} padding="4px 0px" onClick={() => handlerSystemFeature('4')} />
          <OperationButton text="" IconFC={IconMainMenu} padding="4px 0px" onClick={() => handlerSystemFeature('3')} />
          <OperationButton text="" IconFC={IconAllPid} padding="4px 0px" onClick={() => handlerSystemFeature('187')} />
        </Flex>
        <OperationButton text="应用" gap={2} color="orange" IconFC={IconApp} />
      </div>
      <div className="scrcpy-transparent-area bg-transparent">{contextHolder}</div>
    </div>
  );
}

interface OperationButtonProps {
  text: string;
  IconFC: typeof IconRotary;
  gap?: number;
  color?: string;
  padding?: string;
  onClick: GenericsFn;
}

function OperationButton(props: OperationButtonProps) {
  const { text, IconFC, color, gap, padding, onClick } = props;
  return (
    <div
      className="flex flex-col justify-center items-center hover:bg-white w-full pt-[3px] cursor-pointer active:bg-white/50 transition-all select-none"
      style={{
        gap: gap || 0,
        ...(padding ? { padding } : {}),
      }}
      onClick={onClick}
    >
      <IconFC
        className="w-5 h-5"
        style={{
          fill: color || '#000',
        }}
      />
      <span>{text}</span>
    </div>
  );
}
