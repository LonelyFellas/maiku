import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { postsEnvQueryOptions } from '@/routes/data';
import Slider from './modules/slider';
import TableMain from './modules/tabel-main';

export default function Profiles() {
  const [currentKey, setCurrentKey] = useState(0);
  const { data: envList, isRefetching, isFetching } = useSuspenseQuery(postsEnvQueryOptions);
  // useQueries({
  //   queries: envList?.map((li) => ({
  //     queryKey: ['connect adb', li.id],
  //     queryFn: () => window.adbApi.connect(`${li.adbAddr}:${li.adbPort}`),
  //     staleTime: Infinity,
  //     enabled: `${li.adbAddr}:${li.adbPort}`.length > 0,
  //   })),
  // });

  useEffect(() => {
    if (envList?.length > 0) {
      setCurrentKey(envList?.[0].id ?? 0);
    }
  }, [envList]);

  const collapsedItems = envList?.find((li) => li.id === currentKey);

  return (
    <div className="flex gap-2 h-full rounded-md p-2 overflow-hidden 2xl:p-4 2xl:gap-4">
      <Slider
        {...{
          isFetching,
          isRefetching,
          envList: envList ?? [],
          currentKey,
          setCurrentKey,
        }}
      />
      <div className="flex-1 overflow-hidden">
        <TableMain deviceId={collapsedItems ? `${collapsedItems.adbAddr}:${collapsedItems.adbPort}` : ''} envId={collapsedItems?.id ?? 0} />
      </div>
    </div>
  );
}
