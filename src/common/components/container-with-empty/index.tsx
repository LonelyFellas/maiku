import React from 'react';
import { Empty, EmptyProps } from 'antd';

interface ContainerWithEmptyProps extends EmptyProps {
  list: unknown[];
  className?: string;
}

/**
 * 在渲染一个list的view的时候，往往没有数据，我们需要一个empty组件来填空
 * 因此有了这个组件
 * @param { ContainerWithEmptyProps } props
 * @param { unknown[] } props.list 需要传入list数据，来进行计算长度
 */
export default function ContainerWithEmpty(
  props: React.PropsWithChildren<ContainerWithEmptyProps>,
) {
  const { children, className = '', list = [], ...restProps } = props;

  return (
    <div className={className}>
      {list.length === 0 ? (
        <Empty {...restProps} className="all_flex_col h-full w-full"></Empty>
      ) : (
        children
      )}
    </div>
  );
}
