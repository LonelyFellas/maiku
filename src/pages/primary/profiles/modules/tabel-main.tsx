import React, { useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Space, Popconfirm, App, Input, Form } from 'antd';
import { useSetState, useUnmount, useUpdateEffect } from '@darwish/hooks-core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaskSpin, Table, useScrcpyRecord } from '@common';
import { getBackupListByEnvIdService, postAddBackupService, postDeleteBackService, type GetBackupParams, postRunBackupService } from '@api';
import { operationItems, columns as configColumns } from '../config';
import type { DataType, StartScrcpyParams, States } from '../type';

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
  const [states, setStates] = useSetState<States>({
    loading: false,
    running: 'stop',
    containerName: '',
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startScrcpyRef = useRef<{ envId: string; deviceId: string }>({
    envId: '',
    deviceId: '',
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
      window.ipcRenderer.send('scrcpy:start', {
        deviceId: startScrcpyRef.current.deviceId,
        envId: startScrcpyRef.current.envId,
        type: 'task',
      });
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
        width: 170,
        key: 'operation',
        render: (_: string, record: DataType) => (
          <Space size={0}>
            <Button
              style={{ cursor: record.running === 'running' ? 'not-allowed' : 'pointer' }}
              size="small"
              type="primary"
              danger={record.running === 'running'}
              onClick={() =>
                // 当前前端在运行中，则不允许再次点击启动按钮
                record.running === 'running'
                  ? null
                  : handleStartScrcpy({
                      deviceId: record.deviceId,
                      envId: record.envId ?? '',
                      name: record.Names,
                      states: record.State,
                    })
              }
            >
              {record.running === 'running' ? '运行中' : '启动'}
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

  const handleStartScrcpy = ({ deviceId, envId, name, states }: StartScrcpyParams) => {
    // 当前启动的备份是属于切换的状态，则需要去等待30s后再启动
    // 所以先检查是否打开的是running状态
    if (states !== 'running') {
      // window.adbApi.connect(deviceId);
      // 如果不是running状态，则是属于切换备份的操作，
      // 切换备份需要等待30s后再启动。
      const newMap = structuredClone(recordData);
      newMap.set(envId, new Date().getTime());
      setRecordData(newMap);
      setStates({
        loading: true,
        running: 'waiting',
        containerName: name,
      });
      timeoutRef.current = setTimeout(() => {
        setStates({ loading: false, running: 'running', containerName: name });
        runBackupMutation.mutate({
          envId,
          containerName: name,
        });
        startScrcpyRef.current = {
          envId,
          deviceId,
        };
      }, 3000);
    } else {
      window.ipcRenderer.send('scrcpy:start', {
        deviceId,
        envId,
        type: 'notask',
      });
      setStates({
        running: 'running',
        containerName: name,
      });
    }
  };

  const dataSource = useMemo(() => {
    return data?.map((item) =>
      item.Names === states.containerName
        ? {
            ...item,
            deviceId,
            envId,
            running: states.running,
          }
        : { ...item, deviceId, envId, running: 'stop' },
    );
  }, [deviceId, envId, states.containerName, data]);

  return (
    <div ref={scrollRef} className="relative flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <MaskSpin content="正在切换备份，请稍后..." loading={states.loading} />
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
        dataSource={dataSource}
      />
    </div>
  );
};
export default TableMain;
