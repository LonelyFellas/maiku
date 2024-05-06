import { useState } from 'react';
import Slider from './modules/slider';
import TableMain from './modules/tabel-main';
import { useQueries } from '@tanstack/react-query';

const list = [
  { order: 0, path: 'bgm8.cn:20910', name: '环境1' },
  { order: 1, path: 'bgm8.cn:20920', name: '环境2' },
  { order: 2, path: 'bgm8.cn:20930', name: '环境3' },
];
export default function Profiles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useQueries({
    queries: list.map((li) => ({
      queryKey: ['connect adb', li.order],
      queryFn: () => window.adbApi.connect(li.path),
      staleTime: Infinity,
    })),
  });

  return (
    <div className="flex gap-2 h-full rounded-md p-2 overflow-hidden 2xl:p-4 2xl:gap-4">
      <Slider {...{ list, currentIndex, setCurrentIndex }} />
      <div className="flex-1 overflow-hidden">
        <TableMain deviceId={list[currentIndex].path} />
      </div>
    </div>
  );
}
