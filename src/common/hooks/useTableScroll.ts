import { type RefObject, useEffect, useState } from 'react';
import { useSize } from '@darwish/hooks-core';
import { toNumber } from '@common';

interface TableScrollProps<T> {
  scrollRef: RefObject<HTMLDivElement>;
  columns: AntdColumns<T>;
  paginationTop?: number;
}

/**
 * 计算表格的X轴和Y轴滚动距离
 * @param props
 */
const useTableScroll = <T>(props: TableScrollProps<T>) => {
  const { scrollRef, columns, paginationTop = 0 } = props;
  const { height: windowHeight } = useSize();
  const [scrollY, setScrollY] = useState(300);

  useEffect(() => {
    if (scrollRef.current) {
      setScrollY(scrollRef.current.clientHeight - 40 + paginationTop);
    }
  }, [scrollRef.current, windowHeight, paginationTop]);

  return {
    x: columns.reduce((acc, cur) => acc + toNumber(cur.width ?? 150), 0),
    y: scrollY,
  };
};

export default useTableScroll;
