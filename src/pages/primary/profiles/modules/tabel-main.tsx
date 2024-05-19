import React, { useRef, useState } from 'react';
import { Button, Dropdown, Space, Popconfirm, App, Input, Form } from 'antd';
import { useUnmount, useUpdateEffect } from '@darwish/hooks-core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaskSpin, Table, useScrcpyRecord } from '@common';
import { getBackupListByEnvIdService, postAddBackupService, postDeleteBackService, type GetBackupParams, postRunBackupService } from '@api';
import { operationItems, columns as configColumns } from '../config';
import { DataType } from '../type';

interface StartScrcpyParams {
  id: string;
  envId: string;
  name: string;
  states: string;
}

interface TableMainProps {
  deviceId: string;
  envId: number;
  isRefetching: boolean;
}

const TableMain = (props: TableMainProps) => {
  const { message } = App.useApp();
  const { deviceId, envId } = props;
  const { data: recordData, setData: setRecordData } = useScrcpyRecord();
  const [form] = Form.useForm();
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startScrcpyRef = useRef<{ envId: string; id: string }>({
    envId: '',
    id: '',
  });
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
      window.ipcRenderer.send('scrcpy:start', startScrcpyRef.current.id, startScrcpyRef.current.envId);
      refetch();
    },
  });
  const runBackupMutation = useMutation({
    mutationKey: ['runBackup', envId],
    mutationFn: postRunBackupService,
    onSuccess: () => {
      message.success('启动成功');
      refetch();
    },
  });
  useUpdateEffect(() => {
    if (props.isRefetching) {
      refetch();
    }
  }, [props.isRefetching]);

  // useUpdateEffect(() => {
  //   console.log('data', recordData);
  // }, [recordData]);
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
            <Button
              size="small"
              type="primary"
              onClick={() =>
                handleStartScrcpy({
                  id,
                  envId: record.envId ?? '',
                  name: record.Names,
                  states: record.State,
                })
              }
            >
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
  // 如果计时器存在，则清除计时器
  useUnmount(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  });

  const handleStartScrcpy = ({ id, envId, name, states }: StartScrcpyParams) => {
    // 当前启动的备份是属于切换的状态，则需要去等待30s后再启动
    // 所以先检查是否打开的是running状态
    if (states !== 'running') {
      // 如果不是running状态，则是属于切换备份的操作，
      // 切换备份需要等待30s后再启动。
      const newMap = structuredClone(recordData);
      newMap.set(envId, new Date().getTime());
      setRecordData(newMap);
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        runBackupMutation.mutate({
          envId,
          containerName: name,
        });
        startScrcpyRef.current = {
          envId,
          id,
        };
      }, 3000);
    } else {
      console.log('当前备份正在运行，无需切换');
      window.ipcRenderer.send('scrcpy:start', {
        deviceId: id,
        envId,
        type: 'notask',
      });
    }

    // setTimeout(() => {
    //   window.ipcRenderer.send('scrcpy:start', id, envId);
    // }, 1000);
  };

  return (
    <div ref={scrollRef} className="relative flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <MaskSpin content="正在切换备份，请稍后..." loading={loading} />
      <Table
        isFetching={isFetching || addBackupMutation.isPending}
        isRefetching={isRefetching}
        isSuccess={!isLoading}
        className="h-full"
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
