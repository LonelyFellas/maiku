import React from 'react';
import { Empty, EmptyProps, Spin } from 'antd';

interface ContainerWithEmptyProps extends EmptyProps {
  isRefetching?: boolean;
  isFetching?: boolean;
  hasData?: boolean;
  className?: string;
}

const contentStyle: React.CSSProperties = {
  padding: 60,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

export function LoadingView({ tip }: { tip: string }) {
  return (
    <div className="all_flex h-full w-full">
      <Spin tip={tip} size="large">
        {content}
      </Spin>
    </div>
  );
}

/**
 * 在渲染一个list的view的时候，往往没有数据，我们需要一个empty组件来填空
 * 同时还有一些数据正在获取或者重新获取的状态.
 * 因此有了这个组件
 * @param { ContainerWithEmptyProps } props
 * @param { unknown[] } props.list 需要传入list数据，来进行计算长度
 */
export default function ContainerWithEmpty(props: React.PropsWithChildren<ContainerWithEmptyProps>) {
  const { isFetching, isRefetching, children, className = '', hasData = false, ...restProps } = props;

  if (isRefetching) {
    return <LoadingView tip="正在重新获取数据" />;
  }
  if (isFetching) {
    return <LoadingView tip="正在获取数据" />;
  }

  return <div className={className}>{hasData === false || children === null || children === undefined ? <Empty {...restProps} className="all_flex_col h-full w-full" /> : children}</div>;
}
