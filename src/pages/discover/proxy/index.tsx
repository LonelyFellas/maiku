import { useQuery } from '@tanstack/react-query';
import { Button, Space, Popconfirm } from 'antd';
import { Table, TriggerModal } from '@common';
import EditModal from './modules/edit';
import { columns as configColumns } from './config';


export default function Proxy() {
  const columns = configColumns.concat({
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 180,
    fixed: 'right',
    render: () => <Space>
      <TriggerModal renderModal={(renderProps) => <EditModal {...renderProps} title="编辑代理" />}>
        <Button type="primary" ghost>编辑</Button>
      </TriggerModal>
      <Popconfirm title="确认删除？" onConfirm={() => {
      }} okText="确认" cancelText="取消">
        <Button danger>删除</Button>
      </Popconfirm>
    </Space>,
  });

  const { data } = useQuery<Darwish.AnyObj[]>({
    queryKey: ['proxy-list'],
    queryFn: () => new Promise((resolve) => {
      import('../fake.json').then((res) => resolve(res.default));
    }),
    staleTime: Infinity,
  });

  return <div className="flex flex-col p-2 h-full">
    <div className="">
      <Button type="primary">添加代理</Button>
    </div>
    <Table className="mt-2" virtual columns={columns} dataSource={data} />
  </div>;
}
