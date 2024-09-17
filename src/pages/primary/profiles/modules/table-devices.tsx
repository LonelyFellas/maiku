import { Button, Space, Table, Tag } from 'antd';
import type { ListProps } from '../type';
import { formaDuration } from '../utils';

const columns = [
  {
    title: '开机操作',
    dataIndex: 'open-device',
    key: 'open-device',
    render: () => <Tag color="blue">打开云机</Tag>,
  },
  {
    title: '云机名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '到期时间',
    dataIndex: 'expTime',
    key: 'expTime',
    render: (text: number) => <span className="w-[100px] text-nowrap text-ellipsis overflow-hidden">{formaDuration(text * 1000)} </span>,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: () => (
      <Space>
        <Button size="small" type="primary" ghost>
          实时画面
        </Button>
        <Button size="small" type="primary" ghost>
          重启
        </Button>
        <Button size="small" type="primary" ghost>
          备注
        </Button>
        <Button size="small" type="primary" ghost>
          改分组
        </Button>
        <Button size="small" type="primary" ghost>
          上传文件
        </Button>
        <Button size="small" type="primary" ghost>
          设置代理
        </Button>
        <Button size="small" type="primary" ghost>
          一键新机
        </Button>
        <Button size="small" type="primary" ghost>
          重置
        </Button>
        <Button size="small" type="primary" ghost>
          备份管理
        </Button>
        <Button size="small" type="primary" ghost>
          执行adb
        </Button>
      </Space>
    ),
  },
];
export function TableDevices(props: ListProps) {
  return (
    <div
      className="mt-[20px]"
      style={{
        display: props.layout === 'table' ? 'block' : 'none',
      }}
    >
      <Table rowKey={'id'} size="small" columns={columns} dataSource={props.deviceData} />
    </div>
  );
}
