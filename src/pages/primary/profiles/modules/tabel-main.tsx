import {
  Button,
  Dropdown,
  // message,
  Pagination,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
import React, { createContext, useRef, useState } from 'react';
import {
  operationItems,
} from '@/pages/primary/profiles/config';
import { MacScrollbar } from 'mac-scrollbar';

// import { DataType, TableContext } from '@/pages/primary/profiles copy';
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
  isVisble?: boolean;
  operation: string;
}

interface TableMainProps {
  deviceId: string;
}

const TableMain = (props: TableMainProps) => {
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const { deviceId } = props;
  console.log(deviceId, '222');

  const handleStartScrcpy = (id: string) => {
    window.ipcRenderer.send('startScrcpy', id);
  };


  const [columns] = useState(() => {
    const defaultColumns = [
      {
        title: '#',
        width: 80,
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
        width: 230,
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
            <Button type="text" size="small">
              删除
            </Button>
          </Space>
        ),
      },
    ];
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });
  if (scrollRef.current) {

    console.log('1111: ', scrollRef.current.clientHeight);
  }
  const scrollY = scrollRef.current && scrollRef.current.clientHeight ? scrollRef.current.clientHeight - 71 : 300;
  console.log(scrollY);
  return (
    <div ref={scrollRef} className="h-full">
      <div className="flex-1 bg-white rounded-md">
        <TableContext.Provider value={{ deviceId }}>
          <Table
            className="antd_close_overflow_auto"
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
          className="absolute bottom-[20px] right-8"
          total={85}
          showTotal={(total) => `共 ${total} 条数据`}
          defaultPageSize={20}
          defaultCurrent={1}
        />
      </div>
    </div>
  );
};
export default TableMain;
