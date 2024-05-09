import { useState } from 'react';
import { Button, Collapse, Flex } from 'antd';
import { isArray } from '@darwish/utils-is';
import { Scrollbar } from '@darwish/scrollbar-react';
import { LeftOutlined } from '@ant-design/icons';
import phone from '@img/phone-test.png';
import '../index.css';
import { cn, ContainerWithEmpty, toNumber } from '@common';
import type { GetAllEnvListResult } from '@api';
import { useNavigate } from '@tanstack/react-router';

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
  const handleChange = (indexStr: string | string[]) => {
    if (isArray(indexStr)) {
      if (indexStr.length) {
        setCurrentKey(toNumber(indexStr[0]));
      }
      setCollapse(indexStr);
    }
  };

  const handleGoToEdit = (id: number) => {
    navigate({ to: `/layout/new_profiles/${id}` });
  };

  return (
    <Scrollbar
      className="w-[230px] h-full bg-bg_primary/50 rounded-md"
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <ContainerWithEmpty className="h-full" list={envList} isRefetching={isRefetching} isFetching={isFetching}>
        <Collapse
          className="profiles-slider-collapse flex flex-col items-center"
          accordion
          expandIcon={() => <></>}
          bordered={false}
          defaultActiveKey={[envList[0].id]}
          onChange={handleChange}
          items={envList.map((item) => ({
            key: item.id,
            label: (
              <div className="flex items-center w-full text-md h-10 bg-bg_primary select-none">
                <span className="relative -left-4">{item.name}</span>
              </div>
            ),
            children: (
              <div className="flex flex-col items-center">
                <img src={phone} className="rounded-[32px] h-[400px]" />
                <Flex className="my-2" gap={10}>
                  <Button size="small" onClick={() => handleGoToEdit(item.id)}>
                    修改
                  </Button>
                  <Button size="small">切换代理</Button>
                  <Button size="small">更多</Button>
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
    </Scrollbar>
  );
};

export default Slider;
