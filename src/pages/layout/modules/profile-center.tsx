import {
  AndroidFilled,
  CaretDownOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Flex, Menu, MenuProps, Popover, Space } from 'antd';
import '../style.less';
import { useNavigate } from '@tanstack/react-router';
import { useI18nConfig } from '@common';

const ProfileCenter = () => {
  const [lang] = useI18nConfig('config.layout.header.profile');
  return (
    <Popover
      overlayClassName="card_profile"
      content={<ContentView />}
      arrow={false}
      placement="bottomLeft"
    >
      <Space className="all_flex p-2 h-9 bg-bg_secondary/20 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="all_flex bg-bg_secondary rounded-full w-6 h-6">
          <AndroidFilled className="text-white" />
        </div>
        <Flex vertical gap={6}>
          <span className="text-sm text-[12px] leading-[12px]">
            15257294120
          </span>
          <span className="text-gray-900/50 text-[10px] leading-[10px]">
            {lang.role}
          </span>
        </Flex>
        <div className="-mt-1">
          <CaretDownOutlined className="text-[12px] text-text_secondary/40" />
        </div>
      </Space>
    </Popover>
  );
};
export default ProfileCenter;

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const ContentView = () => {
  const navigator = useNavigate({ from: '/layout' });
  const [config, setI81n] = useI18nConfig();
  const lang = config.config.layout.header.profile;
  const items: MenuItem[] = [
    getItem('15257294120', 'sub1', <AndroidFilled />),

    getItem(config.lang, 'lang', <GlobalOutlined />, [
      getItem('简体中文', 'lang-zh'),
      getItem('English', 'lang-en'),
    ]),

    getItem(lang.exit_system, 'exit system', <LogoutOutlined />),
  ];

  /** Menu item 点击事件的处理 */
  const handleMenuClick = ({ key }: { key: string }) => {
    // 退出登录
    if (key === 'exit system') {
      navigator({ to: '/login' });
    }
    // 语言切换
    if (key.includes('lang')) {
      setI81n(key.split('-')[1]);
    }
  };
  return (
    <Menu
      style={{ width: 200 }}
      mode="vertical"
      items={items}
      onClick={handleMenuClick}
    />
  );
};
