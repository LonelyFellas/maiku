import { useRef } from 'react';
import {
  Pagination,
  type TableProps as AntdTableProps,
  Table as AntdTable,
} from 'antd';
import { cn, useTableScroll } from '@/common';

interface TableProps extends AntdTableProps {
  tableClassName?: string;
}

/**
 * 封装了一套Table的业务逻辑，包括分页、虚拟滚动、表格样式等。
 * @param props
 * @constructor
 */
const Table = (props: TableProps) => {
  const { tableClassName, className, ...restProps } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useTableScroll({
    scrollRef,
    columns: props.columns || [],
  });

  return (
    <>
      <div className={cn('flex-1 overflow-hidden', className)} ref={scrollRef}>
        <AntdTable
          className={tableClassName}
          pagination={false}
          size="small"
          virtual
          scroll={scroll}
          {...restProps}
        />
      </div>
      <Pagination
        className="flex justify-end"
        total={85}
        showTotal={(total) => `共 ${total} 条数据`}
        defaultPageSize={20}
        defaultCurrent={1}
      />
    </>
  );
};
export default Table;
