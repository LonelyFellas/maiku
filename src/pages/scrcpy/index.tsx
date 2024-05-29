import { useEffect } from 'react';
import { Spin } from 'antd';
import { useMatch, useRouter, useParams, useSearch } from '@tanstack/react-router';

export default function ScrcpyWindow() {
  return (
    <div className="flex bg-[#d7dae3] h-full w-full">
      {/*<ContainerWithEmpty className="w-[391px] bg-amber-400" isFetching description="正在启动云机"></ContainerWithEmpty>*/}
      <div className="all_flex  w-[381px] bg-white">
        <div className="text-center">
          <Spin size="large" />
          <h1 className="mt-2 text-primary">正在启动云机 ...</h1>
        </div>
      </div>
      <div></div>
    </div>
  );
}
