import { Button, Space, Table } from 'antd';
import type { ListProps } from '../type';
import { formaDuration } from '../utils';
import { getToken } from '/src/common';
import { debounce } from 'lodash';

export function TableDevices(props: ListProps) {
  const handleOpenDevice = debounce(({ id, name, p1, number, screenshot2 }: Pick<ListProps['deviceData'][number], 'id' | 'name' | 'p1' | 'number' | 'screenshot2'>) => {
    const imgUrl = new URL(screenshot2);
    const imgHostName = imgUrl.hostname;
    const imgPort = imgUrl.searchParams.get('port');
    const adbPort = p1.toString().slice(0, -2) + (40 + number);
    window.ipcRenderer.send('scrcpy:start', {
      adbAddr: `59.63.189.48:${adbPort}`,
      id,
      name,
      type: 'start',
      token: getToken ?? '',
      imgHostName,
      imgPort,
    });
  }, 1000);

  const columns = [
    {
      title: '开机操作',
      dataIndex: 'open-device',
      key: 'open-device',
      render: (_: string, deviceData: ListProps['deviceData'][number]) => (
        <Button
          onClick={() =>
            handleOpenDevice({
              id: deviceData.id,
              name: deviceData.name,
              p1: deviceData.p1,
              number: deviceData.number,
              screenshot2: deviceData.screenshot2,
            })
          }
          type="primary"
          ghost
          size="small"
        >
          打开云机
        </Button>
      ),
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
  return (
    <div
      className="mt-[20px]"
      style={{
        display: props.layout === 'table' ? 'block' : 'none',
      }}
    >
      <Table rowKey={'id'} size="small" columns={columns} dataSource={props.deviceData ?? []} />
    </div>
  );
}
