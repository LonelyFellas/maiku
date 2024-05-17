import React, { useRef, useState } from 'react';
import { Button, Dropdown, Space, Popconfirm, App, Input, Form } from 'antd';
import { useUpdateEffect } from '@darwish/hooks-core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Table } from '@common';
import { getBackupListByEnvIdService, postAddBackupService, postDeleteBackService, type GetBackupParams } from '@api';
import { operationItems, columns as configColumns } from '../config';
import { DataType } from '../type';

interface TableMainProps {
  deviceId: string;
  envId: number;
  isRefetching: boolean;
}

const TableMain = (props: TableMainProps) => {
  const { message } = App.useApp();
  const { deviceId, envId } = props;
  const [form] = Form.useForm();
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ['backupList', envId],
    queryFn: () => getBackupListByEnvIdService({ envId: envId + '' }),
    enabled: !!envId,
  });
  const deleteMutation = useMutation({
    mutationKey: ['deleteBackup', envId],
    mutationFn: postDeleteBackService,
    onSuccess: () => {
      message.success('删除成功');
      refetch();
    },
  });
  const addBackupMutation = useMutation({
    mutationKey: ['addBackup', envId],
    mutationFn: postAddBackupService,
    onSuccess: () => {
      message.success('备份成功');
      refetch();
    },
  });
  useUpdateEffect(() => {
    if (props.isRefetching) {
      refetch();
    }
  }, [props.isRefetching]);
  const handleGetWindowRect = () => {
    // window.ipcRenderer.send('window:scrcpy-listen', 'SM-F711N');
  };
  const handleDeleteBackup = (props: GetBackupParams) => {
    deleteMutation.mutate(props);
  };
  const handleAddBackup = (props: GetBackupParams) => {
    addBackupMutation.mutate({
      ...props,
      newName: form.getFieldValue('newName') || '',
    });
  };
  const handleBackupPopconfirmOpenChange = (visible: boolean) => {
    if (visible === false) {
      form.resetFields();
    }
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
        width: 160,
        key: 'operation',
        render: (id: string, record: DataType) => (
          <Space size={0}>
            <Button size="small" type="primary" onClick={() => handleStartScrcpy(id, record.envId)}>
              启动
            </Button>
            <Button type="text" size="small" onClick={handleGetWindowRect}>
              编辑
            </Button>
            <Popconfirm
              onOpenChange={handleBackupPopconfirmOpenChange}
              title="是否备份？"
              description={
                <Form form={form}>
                  <Form.Item name="newName" style={{ height: 10 }}>
                    <Input placeholder="新备份名字（可选）" />
                  </Form.Item>
                </Form>
              }
              onConfirm={() =>
                handleAddBackup({
                  envId: record.envId ?? '',
                  containerName: record.Names,
                })
              }
            >
              <Button type="text" size="small">
                备份
              </Button>
            </Popconfirm>

            <Popconfirm
              title="删除备份"
              description="您确定删除此备份"
              onConfirm={() =>
                handleDeleteBackup({
                  envId: record.envId ?? '',
                  containerName: record.Names,
                })
              }
            >
              <Button type="text" size="small" disabled={data && data?.length <= 1}>
                删除
              </Button>
            </Popconfirm>
            {/* <TriggerModal title="编辑代理" renderModal={(renderProps) => <BackupProxy {...renderProps} envId={record.envId ?? '0'} />}>
              <Button type="text" size="small">
                代理
              </Button>
            </TriggerModal> */}
          </Space>
        ),
      },
    ]);
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });

  const handleStartScrcpy = (id: string, envId: string) => {
    window.ipcRenderer.send('scrcpy:start', id, envId);
  };

  return (
    <div ref={scrollRef} className="flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <Table
        isFetching={isFetching || addBackupMutation.isPending}
        isRefetching={isRefetching}
        isSuccess={!isLoading}
        columns={columns
          .filter((col) => col.isVisible)
          .map((col) => ({
            ...col,
            ellipsis: true,
          }))}
        rowKey="Names"
        dataSource={data?.map((item) => ({ ...item, operation: deviceId, envId })) || []}
      />
    </div>
  );
};
export default TableMain;
