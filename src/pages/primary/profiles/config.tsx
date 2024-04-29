import { MenuProps } from 'antd';
import {
  BackwardOutlined,
  DeleteOutlined, DownloadOutlined,
  EditOutlined, FileAddOutlined, FileDoneOutlined,
  HomeOutlined,
  NotificationOutlined, RestOutlined, ScanOutlined, ScissorOutlined,
  SettingOutlined, StarOutlined, ToolOutlined, VerifiedOutlined,
} from '@ant-design/icons';

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
    icon: <SettingOutlined />
  }, {
    key: '2',
    label: '主屏幕',
    icon: <HomeOutlined />
  }, {
    key: '3',
    label: '返回键',
    icon: <BackwardOutlined />
  }, {
    key: '4',
    label: '通知栏',
    icon: <NotificationOutlined />
  }, {
    key:" 5",
    label: '电源键',
    icon: <StarOutlined />
  }, {
    key: '6',
    label: '旋转屏幕',
    icon: <ScanOutlined />
  }, {
    key: '7',
    label: '音量控制',
    icon: <VerifiedOutlined />
  }, {
    key: '8',
    label: '截取屏幕',
    icon: <ScissorOutlined />
  }, {
    key: '9',
    label: '重启设备',
    icon: <RestOutlined />
  }, {
    key: '10',
    label: '安装应用',
    icon: <DownloadOutlined />
  }, {
    key: '11',
    label: '文件管理',
    icon: <FileAddOutlined />
  }, {
    key: '12',
    label: '反向协同',
    icon: <FileDoneOutlined />
  }, {
    key: '13',
    label: "多向协同",
    icon: <ToolOutlined />
  }
]
