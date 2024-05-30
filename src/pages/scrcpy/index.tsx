import { Flex, Spin } from 'antd';
import IconRotary from '@public/images/rotary-phone.svg?react';

export default function ScrcpyWindow() {
  return (
    <div className="flex bg-[#d7dae3] h-full w-full">
      <div className="all_flex  w-[381px] bg-white">
        <div className="text-center">
          <Spin size="large" />
          <h1 className="mt-2 text-primary">正在启动云机 ...</h1>
        </div>
      </div>
      <div className="h-full flex flex-col justify-between text-[14px] items-center flex-1">
        <Flex vertical className="w-full text-center">
          <div className="hover:bg-white">
            <IconRotary />
            旋转
          </div>
          <div className="hover:bg-white">截图</div>
          <div className="hover:bg-white">上传</div>
          <div className="hover:bg-white">音量</div>
          <div className="hover:bg-white">音量</div>
          <div className="hover:bg-white">加速</div>
          <div className="hover:bg-white">更多</div>
        </Flex>
        <div className="w-full text-center hover:bg-white">更多</div>
      </div>
    </div>
  );
}
