import { MacScrollbar } from 'mac-scrollbar';
import { Button, Collapse, Flex } from 'antd';
import phone from '@img/phone-test.png';
import '../index.css';

interface SliderProps {
  list: { order: number, name: string, path: string }[];
  currenIndex: number;
  setCurrentIndex: ReactFCWithChildren<number>;
}

const Slider = (props: SliderProps) => {
  const {list} = props;
  const handleChange = (indexStr: string | string[]) => {

  };
  return (
    <MacScrollbar
      className="w-[230px] h-full bg-bg_primary/50 rounded-md"
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Collapse
        className="profiles-slider-collapse flex flex-col items-center"
        accordion
        bordered={false}
        onChange={handleChange}
      >
        {list.map((item) => (
          <Collapse.Panel
            // showArrow={false}
            header={
              <div className="flex items-center w-full pl-4 text-md h-10 bg-bg_primary select-none">
                <span>{item.name}</span>
              </div>
            }
            key={item.order}
            className="flex flex-col items-center w-full"
          >
            <div className="flex flex-col items-center">
              <img src={phone} className="rounded-[32px] h-[400px]" />
              <Flex className="my-2">
                <Button size="small">功能1</Button>
                <Button size="small">功能2</Button>
                <Button size="small">功能3</Button>
                <Button size="small">功能4</Button>
              </Flex>
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </MacScrollbar>
  );
};

export default Slider;
