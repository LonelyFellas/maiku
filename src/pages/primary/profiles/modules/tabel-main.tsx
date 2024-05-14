import React, { createContext, useRef, useState } from 'react';
import { Button, Dropdown, Space, Popconfirm } from 'antd';
import { Table } from '@common';
import { operationItems, columns as configColumns } from '../config';
import { useQuery } from '@tanstack/react-query';
import { getBackupListByEnvIdService } from '@api/primary/backup.ts';
import { useUpdateEffect } from '@darwish/hooks-core';

export const TableContext = createContext<{ deviceId: string }>({
  deviceId: '-1',
});

interface TableMainProps {
  deviceId: string;
  envId: number;
  isRefetching: boolean;
}

const TableMain = (props: TableMainProps) => {
  const { deviceId, envId } = props;
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const { data, isFetching, isRefetching, isFetched, refetch } = useQuery({
    queryKey: ['backupList', envId],
    queryFn: () => getBackupListByEnvIdService({ envId: envId + '' }),
    enabled: !!envId,
  });

  useUpdateEffect(() => {
    if (props.isRefetching) {
      refetch();
    }
  }, [props.isRefetching]);
  const handleGetWindowRect = () => {
    console.log('111');
    // window.ipcRenderer.send('window:scrcpy-listen', 'SM-F711N');
  };

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
            <Button type="text" size="small" onClick={handleGetWindowRect}>
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
    window.ipcRenderer.send('scrcpy:start', id, 'Test');
  };

  return (
    <div ref={scrollRef} className="flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <Table
        isFetching={isFetching}
        isRefetching={isRefetching}
        isSuccess={isFetched}
        columns={columns
          .filter((col) => col.isVisible)
          .map((col) => ({
            ...col,
            ellipsis: true,
          }))}
        rowKey="Names"
        dataSource={data?.map((item) => ({ ...item, operation: deviceId })) || []}
      />
    </div>
  );
};
export default TableMain;
