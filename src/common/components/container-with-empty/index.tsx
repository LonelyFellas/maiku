import React from 'react';
import { Empty, EmptyProps, Spin } from 'antd';

interface ContainerWithEmptyProps extends EmptyProps {
  isRefetching?: boolean;
  isFetching?: boolean;
  hasData?: boolean;
  className?: string;
  emptyDescription?: string;
  height?: number | string;
  size?: 'default' | 'small' | 'large';
}

const contentStyle: React.CSSProperties = {
  padding: 60,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

export function LoadingView({ tip, height, size }: { tip: string; height: number | string; size: 'default' | 'small' | 'large' }) {
  return (
    <div style={{ height }} className="relative">
      <div className="all_flex h-full w-full absolute">
        <Spin tip={tip} size={size}>
          {content}
        </Spin>
      </div>
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
  const { isFetching, height = '100%', size = 'default', isRefetching, children, className = '', hasData = false, emptyDescription = '暂无数据', ...restProps } = props;

  if (isRefetching) {
    return <LoadingView tip="正在重新获取数据" height={height} size={size} />;
  }
  if (isFetching) {
    return <LoadingView tip="正在获取数据" height={height} size={size} />;
  }

  return <div className={className}>{!hasData || children === null || children === undefined ? <Empty {...restProps} description={emptyDescription} className="all_flex_col h-full w-full" /> : children}</div>;
}
