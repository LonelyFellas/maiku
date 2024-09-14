import { memo } from 'react';
import { App, Button, Descriptions, Popconfirm, Space, Table } from 'antd';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ContainerWithEmpty, Modal, PopconfirmButton, PROXY_TYPE, useI18nConfig } from '@common';
import { GetProxyListResult, getProxyListService, PostBackupProxyResult, postBackupProxyService, postClearBackupProxyService, postDeleteProxyService, postSetBackupProxyService } from '@api';

interface BackupProxyModalProps extends AntdModalProps {
  envId: number;
}

const BackupProxyModal = memo((props: BackupProxyModalProps) => {
  const [lang] = useI18nConfig('config.profiles');
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
    onSuccess: (res) => {
      message.success(res);
      results[0].refetch();
    },
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete-proxy'],
    mutationFn: postDeleteProxyService,
    onSuccess: () => {
      message.success(lang.delete_msg);
      results[1].refetch();
    },
  });
  const clearMutation = useMutation({
    mutationKey: ['clear-proxy'],
    mutationFn: postClearBackupProxyService,
    onSuccess: (res) => {
      message.success(res);
      results[0].refetch();
    },
  });
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
      <ContainerWithEmpty height={100} emptyDescription={lang.no_starting} hasData={Boolean(detailData)} isFetching={results[0].isLoading} isRefetching={results[0].isRefetching}>
        <Descriptions title="">
          <Descriptions.Item label={lang.ip_address} span={3}>
            {detailData?.addr}
          </Descriptions.Item>
          <Descriptions.Item label={lang.start_status}>{detailData?.statusText}</Descriptions.Item>
          <Descriptions.Item label={lang.proxy_type}>{PROXY_TYPE[detailData?.type || 1]}</Descriptions.Item>
        </Descriptions>
      </ContainerWithEmpty>
      <Table
        bordered
        // isRefetching={results[1].isRefetching}
        // isFetching={results[1].isFetching}
        size="small"
        loading={results[1].isRefetching}
        className="mt-4"
        dataSource={proxyList}
        pagination={false}
        scroll={{ y: 240, x: 500 }}
        rowKey="id"
        columns={[
          {
            title: lang.column_proxy_info,
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
          { title: lang.column_proxy_account, dataIndex: 'username' },
          {
            title: lang.column_operation,
            dataIndex: 'operation',
            width: 160,
            fixed: 'right',
            render: (_: unknown, record: GetProxyListResult) => (
              <Space>
                <Popconfirm title={lang.proxy_confirm_title} onConfirm={() => handleSetVpc(record.id)}>
                  <Button type="text" className="text-text_primary hover:!text-text_secondary">
                    {lang.proxy_confirm_change}
                  </Button>
                </Popconfirm>
                <PopconfirmButton onConfirm={() => handleDeleteVpc(record.id)} />
              </Space>
            ),
          },
        ]}
      />

      <div className="mt-4 text-center absolute top-10 right-6 flex flex-col gap-2">
        <Popconfirm title={lang.clear_confirm_title} onConfirm={handleClearVpc}>
          <Button type="primary" danger>
            {lang.clear_btn}
          </Button>
        </Popconfirm>
        <Button type="primary" onClick={handleGoToProxy}>
          {lang.add_btn}
        </Button>
      </div>
    </Modal>
  );
});

export default BackupProxyModal;
