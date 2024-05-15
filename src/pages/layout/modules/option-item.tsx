import type React from 'react';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

const OptionItem = (props: { icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>> }) => {
  return (
    <div
      className="all_flex w-9 h-9 bg-bg_secondary/20
    rounded-md shadow-sm hover:shadow-lg duration-200
    transition-shadow cursor-pointer"
    >
      <div className="all_flex bg-bg_secondary rounded-full w-6 h-6">
        <props.icon className="text-lg text-white text-bold" />
      </div>
    </div>
  );
};
export default OptionItem;
