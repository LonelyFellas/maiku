import { MenuProps, Tag } from 'antd';
import {
  BackwardOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  HomeOutlined,
  NotificationOutlined,
  RestOutlined,
  ScanOutlined,
  ScissorOutlined,
  SettingOutlined,
  StarOutlined,
  ToolOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import type { DataType } from './type.ts';

export const settingItems: MenuProps['items'] = [
  {
    key: '1',
    label: '编辑环境',
    icon: <SettingOutlined />,
  },
  {
    key: '3',
    label: <span className="text-red-500">删除环境</span>,
    icon: <DeleteOutlined className="text-red-500" />,
  },
  {
    key: '2',
    label: '修改代理',
    icon: <EditOutlined />,
  },
];
export const operationItems = [
  {
    key: '1',
    label: '切换键',
    icon: <SettingOutlined />,
  },
  {
    key: '2',
    label: '主屏幕',
    icon: <HomeOutlined />,
  },
  {
    key: '3',
    label: '返回键',
    icon: <BackwardOutlined />,
  },
  {
    key: '4',
    label: '通知栏',
    icon: <NotificationOutlined />,
  },
  {
    key: ' 5',
    label: '电源键',
    icon: <StarOutlined />,
  },
  {
    key: '6',
    label: '旋转屏幕',
    icon: <ScanOutlined />,
  },
  {
    key: '7',
    label: '音量控制',
    icon: <VerifiedOutlined />,
  },
  {
    key: '8',
    label: '截取屏幕',
    icon: <ScissorOutlined />,
  },
  {
    key: '9',
    label: '重启设备',
    icon: <RestOutlined />,
  },
  {
    key: '10',
    label: '安装应用',
    icon: <DownloadOutlined />,
  },
  {
    key: '11',
    label: '文件管理',
    icon: <FileAddOutlined />,
  },
  {
    key: '12',
    label: '反向协同',
    icon: <FileDoneOutlined />,
  },
  {
    key: '13',
    label: '多向协同',
    icon: <ToolOutlined />,
  },
];

const TAG_MAP = {
  created: {
    color: 'blue',
    title: '已创建',
  },
  running: {
    color: 'green',
    title: '运行中',
  },
  exited: {
    color: 'yellow',
    title: '已退出',
  },
};
export const columns: AntdColumns<DataType> = [
  {
    title: '#',
    width: 45,
    dataIndex: 'num',
    key: 'num',
    render: (_, __, index) => index + 1,
  },
  // {
  //   title: '类别',
  //   width: 120,
  //   dataIndex: 'category',
  //   key: 'category',
  // },
  // {
  //   title: '序号',
  //   width: 80,
  //   dataIndex: 'index',
  //   key: 'index',
  // },
  {
    title: '名称',
    width: 150,
    dataIndex: 'Names',
    key: 'Names',
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'State',
    key: 'State',
    render: (text: keyof typeof TAG_MAP) => <Tag color={TAG_MAP[text].color}>{TAG_MAP[text].title}</Tag>,
  },
  // {
  //   title: '设备信息',
  //   width: 80,
  //   dataIndex: 'deviceInfo',
  //   key: 'deviceInfo',
  // },
  // {
  //   title: '备注',
  //   width: 80,
  //   dataIndex: 'remark',
  //   key: 'remark',
  // },
  // {
  //   title: '标签',
  //   width: 80,
  //   dataIndex: 'tags',
  //   key: 'tags',
  // },
  // {
  //   title: '最近打开',
  //   width: 80,
  //   dataIndex: 'lastOpenTime',
  //   key: 'lastOpenTime',
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 80,
  //   key: 'createTime',
  // },
];
