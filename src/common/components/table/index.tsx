import { useRef } from 'react';
import { TableFetch } from '../table-fetch';
import { Pagination, type TableProps as AntdTableProps } from 'antd';
import { cn, useTableScroll } from '@/common';

interface TableProps extends AntdTableProps {
  tableClassName?: string;
  isFetching?: boolean;
  isRefetching?: boolean;
  isSuccess?: boolean;
}

/**
 * 封装了一套Table的业务逻辑，包括分页、虚拟滚动、表格样式等。
 * @param props
 * @constructor
 */
const Table = (props: TableProps) => {
  const { tableClassName, pagination = true, className, ...restProps } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useTableScroll({
    scrollRef,
    columns: props.columns || [],
  });

  return (
    <>
      <div className={cn('flex-1 overflow-hidden h-full', className)} ref={scrollRef}>
        <TableFetch className={tableClassName} pagination={false} size="small" virtual scroll={scroll} {...restProps} />
      </div>
      {pagination && <Pagination className="flex justify-end" total={85} showTotal={(total) => `共 ${total} 条数据`} defaultPageSize={20} defaultCurrent={1} />}
    </>
  );
};
export default Table;
