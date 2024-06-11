import { useEffect, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMap } from '@common';
import { getBackupListByEnvIdService } from '@api';
import type { States } from '@/pages/primary/profiles/type.ts';
import { postsEnvQueryOptions } from '@/routes/data';
import Slider from './modules/slider';
import TableMain from './modules/tabel-main';

async function adbConnect(deviceId: string) {
  const listDevices = await window.adbApi.listDevices();
  const findDevice = listDevices.find((device) => device.id === deviceId);
  if (findDevice === undefined) {
    console.error('No device found');
    window.adbApi.connect(deviceId);
  } else if (findDevice.type === 'offline') {
    window.adbApi.reconnect(deviceId);
  }

  return null;
}

export default function Profiles() {
  const [currentKey, setCurrentKey] = useState(0);
  const [states, { set: setStates }] = useMap<number, States>([]);
  const { data: envList, isRefetching, isFetching } = useSuspenseQuery(postsEnvQueryOptions);
  const collapsedItems = envList?.find((li) => li.id === currentKey);
  useQuery({
    queryKey: ['connect adb', currentKey, collapsedItems],
    queryFn: () => adbConnect(collapsedItems?.adbAddr ?? ''),
    enabled: currentKey > 0 && collapsedItems !== undefined,
  });

  const envId = collapsedItems?.id ?? 0;
  const envName = collapsedItems?.name ?? '';
  const adbAddr = collapsedItems?.adbAddr ?? '';
  const {
    data: tableData,
    isFetching: tableIsFetching,
    isRefetching: tableIsRefetching,
    isLoading: tableIsLoading,
    refetch: tableRefetch,
  } = useQuery({
    queryKey: ['backupList', envId, isRefetching],
    queryFn: () => getBackupListByEnvIdService({ envId }),
    enabled: !!envId && !isRefetching,
  });

  useEffect(() => {
    if (envList?.length > 0) {
      setCurrentKey(envList?.[0].id ?? 0);
    }
  }, [envList]);

  return (
    <div className="flex gap-2 h-full rounded-md p-2 overflow-hidden 2xl:p-4 2xl:gap-4">
      <Slider
        {...{
          isFetching,
          isRefetching,
          tableData,
          envList: envList ?? [],
          currentKey,
          indexSetStates: setStates,
          setCurrentKey,
        }}
      />
      <div className="flex-1 overflow-hidden">
        <TableMain
          {...{
            envName,
            adbAddr,
            envId,
            tableData,
            tableIsFetching,
            tableIsRefetching,
            tableIsLoading,
            tableRefetch,
            states,
            setStates,
          }}
        />
      </div>
    </div>
  );
}
