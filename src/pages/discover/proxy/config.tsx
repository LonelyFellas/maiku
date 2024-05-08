import type { GetProxyListResult } from '@api/discover/type.ts';

export const columns: AntdColumns<GetProxyListResult> = [
  {
    title: '#',
    dataIndex: 'order',
    key: 'order',
    width: 80,
    render: (_: unknown, __: unknown, index: number) => index + 1,
  },
  {
    title: '代理信息',
    dataIndex: 'proxyInfo',
    key: 'proxyInfo',
    width: 200,
    render: (_: unknown, record: GetProxyListResult) => {
      const proxyType = record.type === '1' ? 'socks5' : 'https';
      return <span>{proxyType}://{record.address}:{record.port}</span>;
    },
  },
  {
    title: '代理类型',
    dataIndex: 'type',
    key: 'type',
    width: 150,
    render: (text: string) => text === '1' ? 'socks5' : 'https',
  },
  {
    title: '出口IP',
    dataIndex: 'address',
    key: 'address',
    width: 150,
  },
  {
    title: '序号',
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
    title: '备注',
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

export const addTableColumns = [
  {
    title: '序号',
    dataIndex: 'order',
    key: 'order',
    width: 150,
    render: (_: unknown, __: unknown, index: number) => index + 1,
  },
  {
    title: '代理类型',
    dataIndex: 'type',
    key: 'type',
    width: 150,
  },
  {
    title: '代理主机',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: '代理端口',
    dataIndex: 'port',
    key: 'port',
    width: 150,
  },
  {
    title: '代理账号',
    dataIndex: 'username',
    key: 'username',
    width: 150,
  },
  {
    title: '代理密码',
    dataIndex: 'password',
    key: 'password',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
  },
  {
    title: 'IP查询渠道',
    dataIndex: 'queryChannel',
    key: 'queryChannel',
    width: 150,
  },
  {
    title: '出口IP',
    dataIndex: 'outIp',
    key: 'outIp',
    width: 150,
  },
];
