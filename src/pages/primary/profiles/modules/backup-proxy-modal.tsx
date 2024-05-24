import { memo } from 'react';
import { App, Button, Descriptions, Popconfirm, Space } from 'antd';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ContainerWithEmpty, Modal, PopconfirmButton, PROXY_TYPE, Table } from '@common';
import { GetProxyListResult, getProxyListService, PostBackupProxyResult, postBackupProxyService, postClearBackupProxyService, postDeleteProxyService, postSetBackupProxyService } from '@api';

interface BackupProxyModalProps extends AntdModalProps {
  envId: number;
}

const BackupProxyModal = memo((props: BackupProxyModalProps) => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { envId, ...restProps } = props;
  const results = useQueries({
    queries: [`detail-proxy ${envId || 0}`, 'proxy-list'].map((key) => ({
      queryKey: [key, envId],
      queryFn: () => {
        if (key.includes('detail-proxy')) {
          return postBackupProxyService({ envId });
        } else {
          return getProxyListService();
        }
      },
      enabled: props.open && envId !== undefined && envId !== -1,
    })),
  });
  const setMutation = useMutation({
    mutationKey: ['set-proxy'],
    mutationFn: postSetBackupProxyService,
    onSuccess: () => {
      message.success('设置成功');
      results[0].refetch();
    },
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete-proxy'],
    mutationFn: postDeleteProxyService,
    onSuccess: () => {
      message.success('删除成功');
      results[1].refetch();
    },
  });
  const clearMutation = useMutation({
    mutationKey: ['clear-proxy'],
    mutationFn: postClearBackupProxyService,
    onSuccess: () => {
      message.success('清除成功');
      results[0].refetch();
    },
  });
  console.log(results[1].isRefetching);
  /** 设置当前代理 */
  const handleSetVpc = (vpcId: number) => {
    setMutation.mutate({ envId, vpcId });
  };
  /** 删除当前代理 */
  const handleDeleteVpc = (vpcId: number) => {
    deleteMutation.mutate({ id: vpcId });
  };
  /** 清空当前代理 */
  const handleClearVpc = () => {
    clearMutation.mutate({ envId });
  };
  const handleGoToProxy = () => {
    navigate({ to: '/layout/proxy' });
  };
  const detailData = results[0].data as unknown as PostBackupProxyResult;
  const proxyList = results[1].data as unknown as GetProxyListResult[];
  return (
    <Modal {...restProps} width={600}>
      <ContainerWithEmpty emptyDescription="未启动" hasData={Boolean(detailData)} isFetching={results[0].isLoading} isRefetching={results[0].isRefetching}>
        <Descriptions title="">
          <Descriptions.Item label="IP地址" span={3}>
            {detailData?.addr}
          </Descriptions.Item>
          <Descriptions.Item label="启动状态">{detailData?.statusText}</Descriptions.Item>
          <Descriptions.Item label="代理类型">{PROXY_TYPE[detailData?.type || 1]}</Descriptions.Item>
        </Descriptions>
      </ContainerWithEmpty>
      <Table
        isRefetching={results[1].isRefetching}
        isFetching={results[1].isFetching}
        className="mt-4"
        dataSource={proxyList}
        pagination={false}
        scroll={{ y: 200 }}
        rowKey="id"
        columns={[
          {
            title: '代理信息',
            dataIndex: 'proxyInfo',
            key: 'proxyInfo',
            width: 200,
            render: (_: unknown, record: GetProxyListResult) => {
              return (
                <span>
                  {PROXY_TYPE[record.type]}://{record.address}:{record.port}
                </span>
              );
            },
          },
          { title: '代理账号', dataIndex: 'username' },
          {
            title: '操作',
            dataIndex: 'operation',
            render: (_: unknown, record: GetProxyListResult) => (
              <Space>
                <Popconfirm title="确定要切换当前代理" onConfirm={() => handleSetVpc(record.id)}>
                  <Button type="text" className="text-text_primary hover:!text-text_secondary">
                    切换
                  </Button>
                </Popconfirm>
                <PopconfirmButton onConfirm={() => handleDeleteVpc(record.id)} />
              </Space>
            ),
          },
        ]}
      />

      <div className="mt-4 text-center absolute top-10 right-6 flex flex-col gap-2">
        <Popconfirm title="确定清空该云机代理？" onConfirm={handleClearVpc}>
          <Button type="primary" danger>
            清空当前代理
          </Button>
        </Popconfirm>
        <Button type="primary" onClick={handleGoToProxy}>
          去添加代理
        </Button>
      </div>
    </Modal>
  );
});

export default BackupProxyModal;
