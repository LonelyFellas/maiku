import {
  Button,
  Dropdown,
  Pagination,
  Space,
  Table,
  TableColumnsType,
  Popconfirm,
} from 'antd';
import React, { createContext, useEffect, useRef, useState } from 'react';
import {
  operationItems,
} from '@/pages/primary/profiles/config';
import { useWindowSize } from '@darwish/hooks-core';

export const TableContext = createContext<{ deviceId: string }>({
  deviceId: '-1',
});

export interface DataType {
  key: 1;
  num: React.Key;
  category: string;
  index: number;
  name: string;
  deviceInfo: string;
  remark: string;
  tags: string;
  lastOpenTime: string;
  createTime: string;
  isVisible?: boolean;
  operation: string;
}

interface TableMainProps {
  deviceId: string;
}

const TableMain = (props: TableMainProps) => {
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const [scrollY, setScrollY] = useState(300);
  const { height: windowHeight } = useWindowSize();
  const { deviceId } = props;

  const handleStartScrcpy = (id: string) => {
    window.ipcRenderer.send('startScrcpy', id);
  };


  const [columns] = useState(() => {
    const defaultColumns = [
      {
        title: '#',
        width: 45,
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '类别',
        width: 120,
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '序号',
        width: 80,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '名称',
        width: 80,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '设备信息',
        width: 80,
        dataIndex: 'deviceInfo',
        key: 'deviceInfo',
      },
      {
        title: '备注',
        width: 80,
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '标签',
        width: 80,
        dataIndex: 'tags',
        key: 'tags',
      },
      {
        title: '最近打开',
        width: 80,
        dataIndex: 'lastOpenTime',
        key: 'lastOpenTime',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 80,
        key: 'createTime',
      },
      {
        title: (
          <Dropdown menu={{ items: operationItems }} trigger={['click']}>
            <span className="cursor-pointer">操作</span>
          </Dropdown>
        ),
        dataIndex: 'operation',
        fixed: 'right',
        width: 215,
        key: 'operation',
        render: (id: string) => (
          <Space>
            <Button size="small" type="primary" onClick={() => handleStartScrcpy(id)}>
              启动
            </Button>
            <Button type="text" size="small">
              编辑
            </Button>

            <Button type="text" size="small">
              备份
            </Button>
            <Popconfirm title="删除备份" description="您确定删除此备份">
              <Button type="text" size="small">
                删除
              </Button>
            </Popconfirm>

          </Space>
        ),
      },
    ];
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });


  useEffect(() => {
    console.log('windowHeight', windowHeight);
    if (scrollRef.current) {
      setScrollY(scrollRef.current.clientHeight - 81);
    }
  }, [scrollRef.current, windowHeight]);

  return (
    <div ref={scrollRef} className="flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <TableContext.Provider value={{ deviceId }}>
        <Table
          className="antd_close_overflow_auto flex-1"
          size="small"
          virtual
          columns={
            columns
              .filter((col) => col.isVisible)
              .map((col) => ({
                ...col,
                ellipsis: true,
              })) as TableColumnsType<DataType>
          }
          pagination={false}
          dataSource={[...new Array(40).keys()].map((item, index) => ({
            key: index,
            num: item,
            category: '云手机环境',
            index: 1,
            name: '云手机1',
            deviceInfo: '设备信息',
            remark: '备注',
            tags: '标签',
            lastOpenTime: '最近打开',
            createTime: '创建时间',
            operation: deviceId,
          }))}
          scroll={{ y: scrollY, x: columns.reduce((acc, even) => acc + even.width, 0) }}
        />
      </TableContext.Provider>
      <Pagination
        className="flex justify-end"
        total={85}
        showTotal={(total) => `共 ${total} 条数据`}
        defaultPageSize={20}
        defaultCurrent={1}
      />
    </div>
  );
};
export default TableMain;
