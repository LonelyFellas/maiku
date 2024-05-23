import { useRef } from 'react';
import { type TableProps as AntdTableProps } from 'antd';
import { cn, useTableScroll } from '@/common';
import { TableFetch } from '../table-fetch';

interface TableProps extends AntdTableProps {
  tableClassName?: string;
  isFetching?: boolean;
  isRefetching?: boolean;
  isSuccess?: boolean;
  paginationTop?: number;
}

/**
 * 封装了一套Table的业务逻辑，包括分页、虚拟滚动、表格样式等。
 * @param props
 * @constructor
 */
const Table = (props: TableProps) => {
  const { tableClassName, pagination, className, paginationTop = 0, ...restProps } = props;
  const { defaultPageSize = 10, total, showTotal = (total: number) => `总共${total}条`, showSizeChanger = true, ...restPagination } = pagination || {};
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useTableScroll({
    scrollRef,
    columns: props.columns || [],
    paginationTop,
  });

  return (
    <div className={cn('overflow-hidden h-full', className)} ref={scrollRef}>
      <TableFetch
        className={tableClassName}
        pagination={{
          defaultPageSize,
          total,
          showTotal,
          showSizeChanger,
          // showQuickJumper,
          ...restPagination,
        }}
        size="small"
        virtual
        scroll={scroll}
        {...restProps}
      />
    </div>
  );
};
export default Table;
