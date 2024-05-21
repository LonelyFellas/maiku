import { useState } from 'react';
import { Button, Collapse, Dropdown, Flex } from 'antd';
import { useSetState } from '@darwish/hooks-core';
import { Scrollbar } from '@darwish/scrollbar-react';
import { isArray } from '@darwish/utils-is';
import { LeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { cn, ContainerWithEmpty, toNumber } from '@common';
import { GetAllEnvListResult, getEnvByIdService } from '@api';
import '../index.css';
import emptyImg from '@img/phone-test.png';
import BackupProxyModal from './backup-proxy-modal';
import PushFilesModal from './push-files-modal';

interface SliderProps {
  isFetching: boolean;
  isRefetching: boolean;
  envList: GetAllEnvListResult[];
  currentKey: number;
  setCurrentKey: ReactAction<number>;
}

const Slider = (props: SliderProps) => {
  const navigate = useNavigate();
  const { isFetching, isRefetching, envList, currentKey, setCurrentKey } = props;
  const [collapse, setCollapse] = useState([`${currentKey}`]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [states, setStates] = useSetState({
    pushFilesModalVisible: false,
    backupProxyModalVisible: false,
    cullapse: [currentKey],
  });
  const { data } = useQuery({
    queryKey: ['env-detail-by-id', currentKey],
    queryFn: () => getEnvByIdService({ id: envList.find((item) => item.id === currentKey)!.id }),
    refetchInterval: 1000 * 5,
    enabled: envList.length > 0 && collapse.length > 0 && detailModalVisible === false,
  });

  const handleChange = (indexStr: string | string[]) => {
    if (isArray(indexStr)) {
      if (indexStr.length) {
        setCurrentKey(toNumber(indexStr[0]));
      }
      setCollapse(indexStr);
    }
  };

  /** 跳转修改环境 */
  const handleGoToEdit = (id: number) => {
    navigate({ to: `/layout/new_profiles/${id}` });
  };

  /** 打开备份代理 */
  const handleOpenDetailModal = () => {
    setDetailModalVisible(true);
  };
  /** 关闭备份代理 */
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };
  /** 打开推送文件弹窗 */
  const handleOpenPushFilesModal = () => {
    setStates({ pushFilesModalVisible: true });
  };
  /** 关闭推送文件弹窗 */
  const handleClosePushFilesModal = () => {
    setStates({ pushFilesModalVisible: false });
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
                <img
                  // preview={!!data?.screenShot}
                  src={data?.screenShot ? data.screenShot : emptyImg}
                  className="rounded h-[300px] 2xl:h-[400px]"
                  alt="screen shot"
                />
                <Flex className="my-2" gap={10}>
                  <Button size="small" onClick={() => handleGoToEdit(item.id)}>
                    修改
                  </Button>
                  <Button size="small" onClick={handleOpenDetailModal}>
                    代理
                  </Button>
                  <Dropdown trigger={['click']} menu={{ items: [{ key: 'push', label: '推送', onClick: handleOpenPushFilesModal }] }} overlayClassName="w-20">
                    <Button size="small" onClick={() => window.adbApi.reboot('bgm8.cn:65341')}>
                      更多
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
      <BackupProxyModal title="云机代理" open={detailModalVisible} envId={data ? data.id : -1} onCancel={handleCloseDetailModal} onOk={handleCloseDetailModal} />
      <PushFilesModal title="推送文件" open={states.pushFilesModalVisible} onCancel={handleClosePushFilesModal} onOk={handleClosePushFilesModal} />
    </Scrollbar>
  );
};

export default Slider;
