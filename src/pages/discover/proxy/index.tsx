import { Button, Space, Popconfirm, App } from 'antd';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { PROXY_TYPE, Table, TriggerModal, useI18nConfig } from '@common';
import { type GetProxyListResult, postDeleteProxyService } from '@api';
import { postsProxyQueryOptions } from '@/routes/data';
import AddEditModal from './modules/add-edit';

export default function Proxy() {
  const { message } = App.useApp();
  const [lang] = useI18nConfig('config.proxy');
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useSuspenseQuery(postsProxyQueryOptions);
  const deleteMutation = useMutation({
    mutationKey: ['delete-proxy'],
    mutationFn: postDeleteProxyService,
    onSuccess: () => {
      message.success('删除成功');
    },
  });
  const defaultColumns: AntdColumns<GetProxyListResult> = [
    {
      title: '#',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: lang?.column_info_title,
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
      title: lang?.column_type_title,
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text: keyof typeof PROXY_TYPE) => PROXY_TYPE[text],
    },
    {
      title: lang?.column_address_title,
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: lang?.column_order_title,
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    // {
    //   title: 'ip查询渠道',
    //   dataIndex: 'queryChannel',
    //   key: 'queryChannel',
    //   width: 200,
    // },
    {
      title: lang?.column_remark_title,
      dataIndex: 'detail',
      key: 'detail',
      width: 150,
    },
    // {
    //   title: '云手机环境数',
    //   dataIndex: 'cloudPhoneEnvNum',
    //   key: 'cloudPhoneEnvNum',
    //   width: 150,
    // },
    // {
    //   title: '浏览器环境数',
    //   dataIndex: 'browserEnvNum',
    //   key: 'browserEnvNum',
    //   width: 150,
    // },
  ];
  const columns = defaultColumns.concat({
    title: lang?.tb_operation,
    dataIndex: 'action',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_: unknown, record: GetProxyListResult) => (
      <Space>
        <TriggerModal renderModal={(renderProps) => <AddEditModal {...renderProps} title={lang?.modal_edit_title} handleUpdateList={handleUpdateList} id={record.id} />}>
          <Button type="primary" ghost size="small">
            {lang?.tb_operation_edit}
          </Button>
        </TriggerModal>
        <Popconfirm title={lang?.tb_operation_delete_title} onConfirm={() => handleDelete(record.id)} okText={lang?.tb_operation_delete_okText} cancelText={lang?.tb_operation_delete_cancelText}>
          <Button danger size="small">
            {lang?.tb_operation_delete}
          </Button>
        </Popconfirm>
      </Space>
    ),
  });

  /** 更新列表数据 */
  const handleUpdateList = () => {
    refetch();
  };

  /** 跳转批量导入页面 */
  const handleGoToAddBatches = () => {
    navigate({ to: '/layout/add_batches_proxy' });
  };

  /** 删除代理 */
  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
    refetch();
  };

  return (
    <div className="flex flex-col p-2 h-full 2xl:p-4">
      <div className="">
        <TriggerModal renderModal={(renderProps) => <AddEditModal {...renderProps} title={lang?.modal_add_title} handleUpdateList={handleUpdateList} />}>
          <Button type="primary">{lang?.modal_add_title}</Button>
        </TriggerModal>
        <Button className="ml-2 2xl:ml-4" onClick={handleGoToAddBatches}>
          {lang?.modal_batch_add_title}
        </Button>
      </div>
      <Table
        loading={isLoading}
        rowKey={(record) => record.id}
        className="mt-2 2xl:mt-4"
        virtual
        columns={columns}
        dataSource={data}
        paginationTop={-40}
        pagination={{
          pageSize: 20,
        }}
      />
    </div>
  );
}
