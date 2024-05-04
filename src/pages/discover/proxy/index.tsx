import { useQuery } from '@tanstack/react-query';
import { Button, Table, Space, Popconfirm } from 'antd';
import { columns } from './config';


export default function Proxy() {
  const _columns = columns.concat({
    title: '操作',
    key: 'action',
    render: () => <Space>
      <Button type="primary" ghost>编辑</Button>,
      <Popconfirm title="确认删除？" onConfirm={() => {
      }} okText="确认" cancelText="取消">
        <Button danger>删除</Button>
      </Popconfirm>
    </Space>,
  });
  const { data } = useQuery({
    queryKey: ['proxy-list'],
    queryFn: () => new Promise((resolve) => {
      import('../fake.json').then((res) => resolve(res.default));
    }),
    staleTime: Infinity,
  });

  return <div className="p-2">
    <div className="">
      <Button type="primary">添加代理</Button>
    </div>
    <Table className="mt-2" columns={_columns} dataSource={data || []} />
  </div>;
}
