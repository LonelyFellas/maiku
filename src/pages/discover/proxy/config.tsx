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
