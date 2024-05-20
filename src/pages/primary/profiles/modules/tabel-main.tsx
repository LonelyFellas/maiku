import React, { useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Space, Popconfirm, App, Input, Form } from 'antd';
import { useUpdateEffect } from '@darwish/hooks-core';
import { isBlanks, isUndef } from '@darwish/utils-is';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaskSpin, Table, useMap } from '@common';
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
  const [form] = Form.useForm();
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const [states, { set: setStates }] = useMap<number, States>([]);
  const latestRef = useRef<number>(0);

  const timeoutRef = useRef<
    Record<
      number,
      {
        timeId: NodeJS.Timeout;
        timer: number;
      }
    >
  >({});
  const startScrcpyRef = useRef<{ envId: number; deviceId: string }>({
    envId: -1,
    deviceId: '',
  });

  const currentStates = states.get(envId);

  const switchSomeThing = async ({ deviceId, envId, name }: Omit<StartScrcpyParams, 'states' | 'containerName'>) => {
    await window.adbApi.disconnect(deviceId);
    await window.adbApi.connect(deviceId);
    setStates(envId, { loading: false, running: 'running', containerName: name });
    startScrcpyRef.current = {
      envId,
      deviceId,
    };
    window.ipcRenderer.send('scrcpy:start', {
      deviceId: startScrcpyRef.current.deviceId,
      envId: startScrcpyRef.current.envId,
      type: 'task',
    });
  };
  useUpdateEffect(() => {
    if (isUndef(currentStates)) {
      setStates(props.envId, {
        loading: false,
        running: 'stop',
        containerName: '',
      });
    }

    // 首先清楚当前的计时器，不管当前的计时器是否是在加载的状态
    if (isBlanks(latestRef.current)) return;
    clearTimeout(timeoutRef.current[latestRef.current].timeId);

    // 然后来对现在的计时器进行判断
    latestRef.current = props.envId;
    // 首先先判断当前是否有过计时器的记录
    // 如果没有的话，则不要任何逻辑
    if (!(props.envId in timeoutRef.current)) {
      return;
    }
    // 如果有的话，则要判断当前的计时器是否已经过期
    // 则我们要计算当前的计算器是否过期 过期时间为30秒
    const { timer } = timeoutRef.current[props.envId];
    const nowTimer = new Date().getTime();
    // 我们只会恢复没有过期的计时器
    const computedTimer = nowTimer - timer;
    if (computedTimer < 30000) {
      setTimeout(() => {
        switchSomeThing({
          envId: props.envId,
          deviceId: props.deviceId,
          name: currentStates?.containerName || '',
        });
      }, computedTimer);
    }
  }, [props.envId]);

  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ['backupList', envId],
    queryFn: () => getBackupListByEnvIdService({ envId }),
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
  const runBackupMutation = useMutation({
    mutationKey: ['runBackup', envId],
    mutationFn: postRunBackupService,
    onSuccess: () => {
      message.success('启动中...');
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
        render: (_: string, record: DataType) => {
          let btnText = '启动';
          if (record.running === 'running') {
            btnText = '停止';
          } else if (record.running === 'waiting') {
            btnText = '等待中';
          }
          return (
            <Space size={0}>
              <Button
                size="small"
                type="primary"
                danger={record.running === 'running'}
                onClick={() =>
                  handleStartScrcpy({
                    deviceId: record.deviceId,
                    envId: record.envId ?? -1,
                    name: record.Names,
                    containerName: record.containerName,
                    states: record.State,
                  })
                }
              >
                {btnText}
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
                    envId: record.envId ?? -1,
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
                    envId: record.envId ?? -1,
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
          );
        },
      },
    ]);
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });

  const handleStartScrcpy = ({ deviceId, envId, name, states: startStates, containerName }: StartScrcpyParams) => {
    // 如果当前启动的备份和当前页面的备份一致，则停止当前的scrcpy
    if (containerName === name && startStates === 'running') {
      window.ipcRenderer.send('scrcpy:stop', { deviceId });
      // setStates({
      //   containerName: '',
      //   running: 'stop',
      // });
      setStates(envId, {
        containerName: '',
        loading: false,
        running: 'stop',
      });
      return;
    }

    // 当前启动的备份是属于切换的状态，则需要去等待30s后再启动
    // 所以先检查是否打开的是running状态
    if (startStates !== 'running') {
      // window.adbApi.connect(deviceId);
      // 如果不是running状态，则是属于切换备份的操作，
      // 切换备份需要等待30s后再启动。
      // const newMap = structuredClone(recordData);
      // newMap.set(envId, new Date().getTime());
      // setRecordData(newMap);
      setStates(envId, {
        loading: true,
        running: 'waiting',
        containerName: name,
      });
      window.ipcRenderer.send('scrcpy:stop', { deviceId });
      runBackupMutation.mutate({
        envId,
        containerName: name,
      });
      timeoutRef.current[envId] = {
        timeId: setTimeout(async () => {
          switchSomeThing({ envId, deviceId, name });
        }, 30000),
        timer: new Date().getTime(),
      };
    } else {
      window.ipcRenderer.send('scrcpy:start', {
        deviceId,
        envId,
        type: 'notask',
      });
      setStates(envId, {
        running: 'running',
        loading: false,
        containerName: name,
      });
    }
  };

  const dataSource = useMemo(() => {
    return data?.map((item) =>
      item.Names === currentStates?.containerName
        ? {
            ...item,
            deviceId,
            envId,
            running: currentStates?.running,
            containerName: currentStates?.containerName,
          }
        : { ...item, deviceId, envId, running: 'stop' },
    );
  }, [deviceId, envId, Object.values(currentStates || {})]);

  return (
    <div ref={scrollRef} className="relative flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <MaskSpin content="正在切换备份，请稍后..." loading={currentStates?.loading || false} />
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
