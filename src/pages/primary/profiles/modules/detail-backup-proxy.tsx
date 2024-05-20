import { Descriptions, Button, Popconfirm } from 'antd';
import { useQueries, useMutation } from '@tanstack/react-query';
import { Modal, PROXY_TYPE, Table } from '@common';
import { GetProxyListResult, postBackupProxyService, getProxyListService, postSetBackupProxyService, postClearBackupProxyService } from '@api';

interface DetailBackupProxyProps extends AntdModalProps {
  envId: string;
}

const BackupProxy = (props: DetailBackupProxyProps) => {
  const { envId, ...restProps } = props;
  const results = useQueries({
    queries: ['detail-proxy', 'proxy-list'].map((key) => ({
      queryKey: [key],
      queryFn: () => {
        if (key === 'detail-proxy') {
          return postBackupProxyService({ envId });
        } else {
          return getProxyListService();
        }
      },
      enabled: props.open,
    })),
  });
  const setMutation = useMutation({
    mutationKey: ['set-proxy'],
    mutationFn: postSetBackupProxyService,
    onSuccess: () => {
      results[0].refetch();
    },
  });
  const clearMutation = useMutation({
    mutationKey: ['clear-proxy'],
    mutationFn: postClearBackupProxyService,
    onSuccess: () => {
      results[0].refetch();
    },
  });
  console.log('data', results);
  const handleSetVpc = () => {};
  const handleClearVpc = () => {
    clearMutation.mutate({ envId });
  };
  return (
    <Modal {...restProps} width={600}>
      <Descriptions title="">
        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
        <Descriptions.Item label="Remark">empty</Descriptions.Item>
        <Descriptions.Item label="Address">No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
      </Descriptions>
      <Table
        loading={results[1].isLoading}
        dataSource={results[1].data}
        pagination={false}
        scroll={{ y: 200 }}
        rowKey="id"
        columns={[
          { title: '代理账号', dataIndex: 'username' },
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
          {
            title: '操作',
            dataIndex: 'operation',
            render: () => (
              <Popconfirm title="确定要切换当前代理" onConfirm={() => handleSetVpc()}>
                <Button type="text" className="text-text_primary hover:!text-text_secondary">
                  切换
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />

      <div className="mt-4">
        <Popconfirm title="确定清空该备份代理？" onConfirm={handleClearVpc}>
          <Button type="primary" danger>
            清空当前代理
          </Button>
        </Popconfirm>
      </div>
    </Modal>
  );
};

export default BackupProxy;
