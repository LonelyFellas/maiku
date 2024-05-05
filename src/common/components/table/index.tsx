import { useRef } from 'react';
import { Pagination, type TableProps as AntdTableProps, Table as AntdTable } from 'antd';
import { cn, useTableScroll } from '@/common';

interface TableProps extends AntdTableProps {
  tableClassName?: string;
}

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
