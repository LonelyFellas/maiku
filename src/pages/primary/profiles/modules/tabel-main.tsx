import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Button, Dropdown, Form, Input, Popconfirm, Space } from 'antd';
import { useSetState, useUpdateEffect } from '@darwish/hooks-core';
import { isBlanks, isUndef } from '@darwish/utils-is';
import { useMutation } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { getToken, MaskSpin, Table, useMap } from '@common';
import { GetBackupListByIdResult, type GetBackupParams, postAddBackupService, postDeleteBackService, postRunBackupService } from '@api';
import RunButton from '@/pages/primary/profiles/modules/run-button.tsx';
import { columns as configColumns, operationItems } from '../config';
import type { DataType, StartScrcpyParams, States } from '../type';

interface TableMainProps {
  envName: string;
  adbAddr: string;
  envId: number;
  tableData: GetBackupListByIdResult[] | undefined;
  tableIsLoading: boolean;
  tableIsFetching: boolean;
  tableIsRefetching: boolean;
  tableRefetch: () => void;
}

const TableMain = (props: TableMainProps) => {
  const { message } = App.useApp();
  const { adbAddr, envId, envName, tableData, tableIsLoading, tableRefetch, tableIsRefetching, tableIsFetching } = props;
  const [form] = Form.useForm();
  const scrollRef = useRef<React.ElementRef<'div'>>(null);
  const [states, { set: setStates }] = useMap<number, States>([]);
  const [{ stopEnvId, openEnvId, openBackupName }, setClientStates] = useSetState({
    stopEnvId: 0,
    openEnvId: 0,
    openBackupName: '',
  });
  const latestRef = useRef<number>(0);

  useEffect(() => {
    // 监听客户端的scrcpy所有线程的状态，这里只监听当前已打开的线程的关闭状态
    window.ipcRenderer.on('close-device-envId', (_, closeEnvId) => {
      setClientStates({ stopEnvId: closeEnvId });
    });
    window.ipcRenderer.on('scrcpy:start-window-open', (_, { envId: openEnvId, backupName: openBackupName }) => {
      setClientStates({ openEnvId, openBackupName });
    });
  }, []);

  // 主要还是上面的进程监听之后的一些逻辑操作，因为上面监听的回调拿到状态都不是最新的
  // 严格来说上面的回调存在一些闭包的问题。我们通过updateEffect来解决那最新的states进行逻辑处理
  useUpdateEffect(() => {
    if (stopEnvId) {
      const matchState = states.get(stopEnvId);
      // 如果当前是在切换备份的操作下，杀死的进程。我们保持当前的逻辑，不做任何多余的操作
      // 只关注手动关闭scrcpy窗口的关闭的逻辑
      if (matchState && matchState.running !== 'waiting') {
        setStates(stopEnvId, {
          loading: false,
          containerName: '',
          running: 'stop',
        });
      }
      setClientStates({ stopEnvId: -1 });
    }

    if (openEnvId) {
      setStates(openEnvId, {
        loading: false,
        containerName: openBackupName,
        running: 'running',
      });
      setClientStates({ openEnvId: -1, openBackupName: '' });
    }
  }, [stopEnvId, openEnvId]);

  const timeoutRef = useRef<
    Record<
      number,
      {
        timeId: NodeJS.Timeout;
        timer: number;
      }
    >
  >({});
  const startScrcpyRef = useRef<StartScrcpyParams>({
    adbAddr: '',
    envId: -1,
    name: '',
    states: '',
    containerName: '',
    envName: '',
  });

  const currentStates = states.get(envId);

  const switchSomeThing = async (params: StartScrcpyParams) => {
    const { adbAddr } = params;
    await window.adbApi.disconnect(adbAddr);
    await window.adbApi.connect(adbAddr);
    startScrcpyRef.current = params;
    handleScrcpyWindowOpen(params, 'switch');
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
        switchSomeThing(startScrcpyRef.current);
      }, computedTimer);
    } else {
      // handleScrcpyWindowOpen(startScrcpyRef.current, 'start');
    }
  }, [props.envId]);

  const deleteMutation = useMutation({
    mutationKey: ['deleteBackup', envId],
    mutationFn: postDeleteBackService,
    onSuccess: () => {
      message.success('删除成功');
      tableRefetch();
    },
  });
  const addBackupMutation = useMutation({
    mutationKey: ['addBackup', envId],
    mutationFn: postAddBackupService,
    onSuccess: (data) => {
      message.success(data);
      tableRefetch();
    },
  });
  const runBackupMutation = useMutation({
    mutationKey: ['runBackup', envId],
    mutationFn: postRunBackupService,
    onSuccess: (data) => {
      message.success(data);
      tableRefetch();
    },
  });

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
    if (!visible) {
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
        width: 190,
        key: 'operation',
        render: (_: string, record: DataType) => {
          let btnText = '启动';
          const isRunning = record.running === 'running';
          if (isRunning) {
            btnText = '停止';
          } else if (record.running === 'waiting') {
            btnText = '等待中';
          }
          return (
            <Space size={0}>
              <RunButton
                isRunning={isRunning}
                size="small"
                type="primary"
                danger={isRunning}
                onRestartClick={() =>
                  handleRestartScrcpy({
                    adbAddr: record.adbAddr,
                    envId: record.envId ?? -1,
                    name: record.Names,
                    containerName: record.containerName,
                    envName: record.envName,
                    states: record.State,
                  })
                }
                onClick={() =>
                  handleStartScrcpy({
                    adbAddr: record.adbAddr,
                    envId: record.envId ?? -1,
                    name: record.Names,
                    containerName: record.containerName,
                    envName: record.envName,
                    states: record.State,
                  })
                }
              >
                {btnText}
              </RunButton>
              <Button type="text" size="small">
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
                <Button type="text" size="small" disabled={tableData && tableData?.length <= 1}>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ]);
    return defaultColumns.map((col) => ({ ...col, isVisible: true }));
  });

  /**
   * 启动scrcpy的窗口的逻辑，
   * 同时增加一个500ms的延时防抖效果
   *  */
  const handleStartScrcpy = debounce((params: StartScrcpyParams) => {
    const { adbAddr, envId, name, states: startStates, containerName } = params;
    // 如果当前启动的备份和当前页面的备份一致，则停止当前的scrcpy
    if (containerName === name && startStates === 'running') {
      window.ipcRenderer.send('scrcpy:stop', { adbAddr });
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
      setStates(envId, {
        loading: true,
        running: 'waiting',
        containerName: name,
        type: 'switch',
      });
      window.ipcRenderer.send('scrcpy:stop', { adbAddr });
      runBackupMutation.mutate({
        envId,
        containerName: name,
      });
      timeoutRef.current[envId] = {
        timeId: setTimeout(async () => {
          switchSomeThing(params);
        }, 30000),
        timer: new Date().getTime(),
      };
    } else {
      handleScrcpyWindowOpen(params, 'start');
    }
  }, 500);

  /** 点击重启按钮的逻辑 */
  const handleRestartScrcpy = (params: StartScrcpyParams) => {
    handleScrcpyWindowOpen(params, 'restart');
  };
  /** 打开scrcpy窗口的逻辑, 同时发送到客户端启动或重启scrcpy窗口 */
  const handleScrcpyWindowOpen = (params: StartScrcpyParams, type: States['type'] = 'start') => {
    const { adbAddr, envId, name, envName } = params;
    window.ipcRenderer.send('scrcpy:start', {
      adbAddr,
      envId,
      backupName: name,
      envName,
      type,
      token: getToken ?? '',
    });
    setStates(envId, {
      running: 'waiting',
      loading: true,
      containerName: name,
      type,
    });
  };

  const dataSource = useMemo(() => {
    return tableData?.map((item) =>
      item.Names === currentStates?.containerName
        ? {
            ...item,
            adbAddr,
            envId,
            running: currentStates?.running,
            containerName: currentStates?.containerName,
            envName,
          }
        : { ...item, adbAddr, envId, running: 'stop', envName },
    );
  }, [adbAddr, envName, envId, Object.values(currentStates || {})]);

  let spinContent = '正在切换备份，请稍后...';
  if (currentStates && currentStates.loading) {
    switch (currentStates.type) {
      case 'start':
        spinContent = '正在启动备份，请稍后...';
        break;
      case 'restart':
        spinContent = '正在重启备份，请稍后...';
        break;
      case 'switch':
        spinContent = '正在切换备份，请稍后...';
        break;
      default:
        spinContent = '正在切换备份，请稍后...';
        break;
    }
  }

  return (
    <div ref={scrollRef} className="relative flex flex-col gap-2 flex-1 h-full bg-white rounded-md">
      <MaskSpin content={spinContent} loading={currentStates?.loading || false} />
      <Table
        isFetching={tableIsFetching || addBackupMutation.isPending}
        isRefetching={tableIsRefetching}
        isSuccess={!tableIsLoading}
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
