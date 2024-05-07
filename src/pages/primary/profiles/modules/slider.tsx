import { useState } from 'react';
import { Button, Collapse, Flex } from 'antd';
import { isArray } from '@darwish/utils-is';
import { Scrollbar } from '@darwish/scrollbar-react';
import { LeftOutlined } from '@ant-design/icons';
import phone from '@img/phone-test.png';
import '../index.css';
import { cn, toNumber } from '@common';

interface SliderProps {
  list: { order: number; name: string; path: string }[];
  currentIndex: number;
  setCurrentIndex: ReactAction<number>;
}

const Slider = (props: SliderProps) => {
  const [collapse, setCollapse] = useState([`${props.currentIndex}`]);
  const { list, currentIndex, setCurrentIndex } = props;
  const handleChange = (indexStr: string | string[]) => {
    if (isArray(indexStr)) {
      if (indexStr.length) {
        setCurrentIndex(toNumber(indexStr[0]));
      }
      setCollapse(indexStr);
    }
  };
  return (
    <Scrollbar
      className="w-[230px] h-full bg-bg_primary/50 rounded-md"
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Collapse
        className="profiles-slider-collapse flex flex-col items-center"
        accordion
        expandIcon={() => <></>}
        bordered={false}
        defaultActiveKey={[`${currentIndex}`]}
        onChange={handleChange}
        items={list.map((item) => ({
          key: item.order,
          label: (
            <div className="flex items-center w-full text-md h-10 bg-bg_primary select-none">
              <span className="relative -left-4">{item.name}</span>
            </div>
          ),
          children: (
            <div className="flex flex-col items-center">
              <img src={phone} className="rounded-[32px] h-[400px]" />
              <Flex className="my-2" gap={10}>
                <Button size="small">修改</Button>
                <Button size="small">切换代理</Button>
                <Button size="small">更多</Button>
              </Flex>
            </div>
          ),
          extra: (
            <LeftOutlined
              className={cn('transition-all', {
                '-rotate-90': collapse[0] === item.order.toString(),
              })}
            />
          ),
        }))}
      >
        {/*{list.map((item, index) => (*/}
        {/*  <Collapse.Panel*/}
        {/*    extra={<LeftOutlined className={cn('transition-all', {*/}
        {/*      '-rotate-90': collapse[0] === index.toString(),*/}
        {/*    })} />}*/}
        {/*    header={*/}
        {/*      <div className="flex items-center w-full text-md h-10 bg-bg_primary select-none">*/}
        {/*        <span className="relative -left-4">{item.name}</span>*/}
        {/*      </div>*/}
        {/*    }*/}
        {/*    key={item.order}*/}
        {/*    className="flex flex-col items-center w-full"*/}
        {/*  >*/}
        {/*    <div className="flex flex-col items-center">*/}
        {/*      <img src={phone} className="rounded-[32px] h-[400px]" />*/}
        {/*      <Flex className="my-2" gap={10}>*/}
        {/*        <Button size="small">修改</Button>*/}
        {/*        <Button size="small">切换代理</Button>*/}
        {/*        <Button size="small">更多</Button>*/}
        {/*      </Flex>*/}
        {/*    </div>*/}
        {/*  </Collapse.Panel>*/}
        {/*))}*/}
      </Collapse>
    </Scrollbar>
  );
};

export default Slider;
