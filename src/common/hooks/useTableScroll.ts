import { useEffect, useState, type RefObject } from 'react';
import { useWindowSize } from '@darwish/hooks-core';
import { toNumber } from '@common';

interface TableScrollProps<T> {
  scrollRef: RefObject<HTMLDivElement>;
  columns: AntdColumns<T>;
}

/**
 * 计算表格的X轴和Y轴滚动距离
 * @param props
 */
const useTableScroll = <T>(props: TableScrollProps<T>) => {
  const { scrollRef, columns } = props;
  const { height: windowHeight } = useWindowSize();
  const [scrollY, setScrollY] = useState(300);

  useEffect(() => {
    if (scrollRef.current) {
      setScrollY(scrollRef.current.clientHeight - 40);
    }
  }, [scrollRef.current, windowHeight]);

  return {
    x: columns.reduce((acc, cur) => acc + toNumber(cur.width ?? 150), 0),
    y: scrollY,
  };
};

export default useTableScroll;
