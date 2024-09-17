// @ts-nocheck
import { useDeferredValue } from 'react';
import { Button, Collapse, Dropdown, Flex, message } from 'antd';
import { useSetState } from '@darwish/hooks-core';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isArray, isUndef } from '@darwish/utils-is';
import { LeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { cn, ContainerWithEmpty, getToken, toNumber, useI18nConfig } from '@common';
import { type GetAllEnvListResult, type GetBackupListByIdResult, getEnvByIdService } from '@api';
import type { States } from '@/pages/primary/profiles-copy/type.ts';
import { emptyImg } from '../config.tsx';
import BackupProxyModal from './backup-proxy-modal';
import PushFilesModal from './push-files-modal';
import '../index.css';

interface SliderProps {
  isFetching: boolean;
  isRefetching: boolean;
  tableData: GetBackupListByIdResult[] | undefined;
  envList: GetAllEnvListResult[];
  currentKey: number;
  setCurrentKey: ReactAction<number>;
  indexSetStates: (key: number, entry: States) => void;
}

const Slider = (props: SliderProps) => {
  const [lang] = useI18nConfig('config.profiles');
  const navigate = useNavigate();
  const { indexSetStates, isFetching, isRefetching, envList, currentKey, setCurrentKey, tableData } = props;
  const [states, setStates] = useSetState({
    pushFilesModalVisible: false,
    backupProxyModalVisible: false,
    collapse: [`${currentKey}`],
    selectedEnvId: -1,
  });
  const { pushFilesModalVisible, backupProxyModalVisible, collapse } = states;

  // const enabled = envList.length > 0 && collapse.length > 0 && (!backupProxyModalVisible || !pushFilesModalVisible);
  const { data } = useQuery({
    queryKey: ['env-detail-by-id', currentKey],
    queryFn: () => getEnvByIdService({ id: envList.find((item) => item.id === currentKey)!.id }),
    refetchInterval: 1000 * 5,
    enabled: envList.length > 0 && collapse.length > 0,
  });
  const dataDeferredVal = useDeferredValue(data);

  const handleChange = (indexStr: string | string[]) => {
    if (isArray(indexStr)) {
      if (indexStr.length) {
        setCurrentKey(toNumber(indexStr[0]));
      }
      setStates({ collapse: indexStr });
    }
  };

  /** 跳转修改环境 */
  const handleGoToEdit = (id: number) => {
    navigate({ to: `/layout/new_profiles/${id}` });
  };

  /** 打开备份代理 */
  const handleOpenDetailModal = () => {
    setStates({ backupProxyModalVisible: true });
  };
  /** 关闭备份代理 */
  const handleCloseDetailModal = () => {
    setStates({ backupProxyModalVisible: false });
  };
  /** 打开推送文件弹窗 */
  const handleOpenPushFilesModal = (envId: number) => {
    setStates({ pushFilesModalVisible: true, selectedEnvId: envId });
  };
  /** 关闭推送文件弹窗 */
  const handleClosePushFilesModal = () => {
    setStates({ pushFilesModalVisible: false });
  };

  /** 启动scrcpy */
  const handleStartScrcpy = () => {
    const currentItem = envList.find((item) => item.id === currentKey)!;
    const { adbAddr, id, name } = currentItem;
    if (tableData) {
      const activeBackup = tableData.find((t) => t.State === 'running');
      if (isUndef(activeBackup)) {
        message.success(lang.empty_backup_msg);
      } else {
        window.ipcRenderer.send('scrcpy:start', {
          adbAddr,
          envId: id,
          backupName: activeBackup.Names,
          envName: name,
          type: 'start',
          token: getToken ?? '',
        });
        indexSetStates(id, {
          running: 'waiting',
          loading: true,
          containerName: activeBackup.Names,
          type: 'start',
        });
      }
    }
  };
  return (
    <Scrollbar className="w-[180px] h-full bg-bg_primary/50 rounded-md 2xl:w-[230px]">
      <ContainerWithEmpty className="h-full" hasData={envList?.length > 0} isRefetching={isRefetching} isFetching={isFetching}>
        <Collapse
          className="profiles-slider-collapse flex flex-col items-center"
          accordion
          expandIcon={() => <></>}
          bordered={false}
          defaultActiveKey={[envList[0]?.id]}
          onChange={handleChange}
          items={envList.map((item) => ({
            key: item.id,
            label: (
              <div className="flex items-center w-full text-md h-10 bg-bg_primary select-none">
                <span className="relative -left-4">{item.name}</span>
              </div>
            ),
            children: (
              <div className="flex flex-col items-center p-2">
                <img src={dataDeferredVal?.screenShot ? dataDeferredVal.screenShot : emptyImg} className="rounded h-[300px] 2xl:h-[400px] cursor-pointer" alt="screen shot" onClick={handleStartScrcpy} />
                <Flex className="my-2" gap={10}>
                  <Button size="small" onClick={() => handleGoToEdit(item.id)}>
                    {lang.modify_btn}
                  </Button>
                  <Button size="small" onClick={handleOpenDetailModal}>
                    {lang.proxy_btn}
                  </Button>
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: [
                        {
                          key: 'push',
                          label: lang.more_push_btn,
                          onClick: () => handleOpenPushFilesModal(item.id),
                        },
                      ],
                    }}
                    overlayClassName="w-20"
                  >
                    <Button size="small" onClick={() => window.adbApi.reboot('bgm8.cn:65341')}>
                      {lang.more_btn}
                    </Button>
                  </Dropdown>
                </Flex>
              </div>
            ),
            extra: (
              <LeftOutlined
                className={cn('transition-all', {
                  '-rotate-90': collapse[0] === item.id.toString(),
                })}
              />
            ),
          }))}
        />
      </ContainerWithEmpty>
      <BackupProxyModal title={lang.backup_proxy_modal_title} open={backupProxyModalVisible} envId={dataDeferredVal?.id ?? -1} onCancel={handleCloseDetailModal} onOk={handleCloseDetailModal} />
      <PushFilesModal
        envId={states.selectedEnvId}
        adbAddr={dataDeferredVal?.adbAddr}
        name={dataDeferredVal?.name}
        title={lang.push_files_modal_title}
        open={pushFilesModalVisible}
        onCancel={handleClosePushFilesModal}
        onOk={handleClosePushFilesModal}
      />
    </Scrollbar>
  );
};

export default Slider;
