import React, { createContext, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Space,
  Popconfirm,
} from 'antd';
import { Table } from '@common';
import {
  operationItems,
  columns as configColumns,
} from '../config';

export const TableContext = createContext<{ deviceId: string }>({
  deviceId: '-1',
});


interface TableMainProps {
  deviceId: string;
}

const TableMain = (props: TableMainProps) => {
  const { deviceId } = props;
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const [columns] = useState(() => {
    const defaultColumns = configColumns.concat([
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
    ]);
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });


  const handleStartScrcpy = (id: string) => {
    window.ipcRenderer.send('startScrcpy', id);
  };

  return (
    <div ref={scrollRef} className="flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <Table
        columns={
          columns
            .filter((col) => col.isVisible)
            .map((col) => ({
              ...col,
              ellipsis: true,
            }))
        }
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
      />
    </div>
  );
};
export default TableMain;
