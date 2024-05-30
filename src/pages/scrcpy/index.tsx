import { Flex, Spin } from 'antd';
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

export default function ScrcpyWindow() {
  return (
    <div className="flex bg-[#d7dae3] h-full w-full">
      <div className="all_flex  w-[381px] bg-white">
        <div className="text-center">
          <Spin size="large" />
          <h1 className="mt-2 text-primary">正在启动云机 ...</h1>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-between text-[13px] items-center flex-1 pb-3">
        <Flex vertical className="w-full text-center pt-3 gap-3">
          <OperationButton text="旋转" IconFC={IconRotary} />
          <OperationButton text="截屏" IconFC={IconScreenShot} />
          <OperationButton text="上传" IconFC={IconUpload} />
          <OperationButton text="音+" IconFC={IconVolumeUp} />
          <OperationButton text="音-" IconFC={IconVolumeDown} />
          <OperationButton text="加速" IconFC={IconSpeedUp} />
          <OperationButton text="更多" IconFC={IconMore} />
        </Flex>
        <Flex vertical className="w-full gap-3">
          <OperationButton text="" IconFC={IconBack} padding="4px 0px" />
          <OperationButton text="" IconFC={IconMainMenu} padding="4px 0px" />
          <OperationButton text="" IconFC={IconAllPid} padding="4px 0px" />
        </Flex>
        <OperationButton text="应用" gap={2} color="orange" IconFC={IconApp} />
      </div>
    </div>
  );
}

interface OperationButtonProps {
  text: string;
  IconFC: typeof IconRotary;
  gap?: number;
  color?: string;
  padding?: string;
}

function OperationButton(props: OperationButtonProps) {
  const { text, IconFC, color, gap, padding } = props;
  return (
    <div
      className="flex flex-col justify-center items-center hover:bg-white w-full pt-[3px] cursor-pointer active:bg-white/50 transition-all"
      style={{
        gap: gap || 0,
        ...(padding ? { padding } : {}),
      }}
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
