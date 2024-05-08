import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Button, Space, Popconfirm } from 'antd';
import { Table, TriggerModal } from '@common';
import AddEditModal from './modules/add-edit';
import { columns as configColumns } from './config';
import { postsProxyQueryOptions } from '@/routes/data';
import { useNavigate } from '@tanstack/react-router';
import type { GetProxyListResult } from '@api/discover/type';
import { postDeleteProxyService } from '@api/discover/proxy.ts';

export default function Proxy() {
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useSuspenseQuery(postsProxyQueryOptions);
  const deleteMutation = useMutation({
    mutationFn: postDeleteProxyService,
  });
  const columns = configColumns.concat({
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_: unknown, record: GetProxyListResult) => (
      <Space>
        <TriggerModal
          renderModal={(renderProps) => (
            <AddEditModal {...renderProps} title="编辑代理" handleUpdateList={handleUpdateList} id={record.id} />
          )}
        >
          <Button type="primary" ghost>
            编辑
          </Button>
        </TriggerModal>
        <Popconfirm
          title="确认删除？"
          onConfirm={() => handleDelete(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <Button danger>删除</Button>
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
        <TriggerModal
          renderModal={(renderProps) => (
            <AddEditModal {...renderProps} title="添加代理" handleUpdateList={handleUpdateList} />
          )}
        >
          <Button type="primary">添加代理</Button>
        </TriggerModal>
        <Button className="ml-2 2xl:ml-4" onClick={handleGoToAddBatches}>
          批量导入
        </Button>
      </div>
      <Table
        loading={isLoading}
        rowKey={record => record.id}
        className="mt-2 2xl:mt-4"
        virtual
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}
