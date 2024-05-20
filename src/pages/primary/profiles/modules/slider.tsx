import { useState } from 'react';
import { Button, Collapse, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { isArray } from '@darwish/utils-is';
import { Scrollbar } from '@darwish/scrollbar-react';
import { GetAllEnvListResult, getEnvByIdService } from '@api';
import { LeftOutlined } from '@ant-design/icons';
import '../index.css';
import emptyImg from '@img/phone-test.png';
import { cn, ContainerWithEmpty, toNumber } from '@common';
import DetailBackupProxy from './detail-backup-proxy';

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
  const hadnleCloseDetailModal = () => {
    setDetailModalVisible(false);
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
                  <Button size="small" onClick={() => window.adbApi.reboot('bgm8.cn:65341')}>
                    更多
                  </Button>
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
      <DetailBackupProxy open={detailModalVisible} envId={data ? data.id.toString() : ''} onCancel={hadnleCloseDetailModal} onOk={hadnleCloseDetailModal} />
    </Scrollbar>
  );
};

export default Slider;
