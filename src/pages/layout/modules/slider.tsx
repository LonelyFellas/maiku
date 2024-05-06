import { useEffect, useState } from 'react';
import { Button, Menu, MenuProps, Modal, Tooltip } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@darwish/hooks-core';
import { MacScrollbar } from 'mac-scrollbar/src';
import {
  AppstoreOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  GiftOutlined,
  LinkOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SettingOutlined,
  TikTokOutlined,
} from '@ant-design/icons';
import { useI18nConfig, isMacFunc, useRouteMeta } from '@common';
import { getItem } from './profile-center';
import type { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import '@sty/button.css';
import '../style.css';

const MENU_MAP = {
  '/layout/profiles': ['primary', 'profiles'],
  '/layout/proxy': ['discover', 'proxy'],
};
const Slider = () => {
  const [lang] = useI18nConfig('config.layout.slider');
  const { pathname, title, isBack } = useRouteMeta();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const items: ItemType<MenuItemType>[] = [
    getItem(lang.menu_name_1, 'primary', <MailOutlined />, [
      getItem(lang.menu_name_1_1, 'profiles', <MailOutlined />),
      getItem(lang.menu_name_1_2, '1-2', <MailOutlined />),
    ]),
    getItem(lang.menu_name_2, 'discover', <CalendarOutlined />, [
      getItem(lang.menu_name_2_1, 'proxy', <AppstoreOutlined />),
      getItem(lang.menu_name_2_2, '2-2', <GiftOutlined />),
      getItem(lang.menu_name_2_3, '2-3', <LinkOutlined />, [
        getItem(lang.menu_name_2_3_1, '2-3-1', <LinkOutlined />),
      ]),
    ]),
    getItem(lang.menu_name_3, '3', <AppstoreOutlined />, [
      getItem(lang.menu_name_3_1, '3-1', <TikTokOutlined />),
    ]),
    getItem(lang.menu_name_4, '4', <SettingOutlined />, [
      getItem(lang.menu_name_4_1, '4-1', <SettingOutlined />),
      getItem(lang.menu_name_4_2, '4-2', <SettingOutlined />, [
        getItem(lang.menu_name_4_2_1, '4-2-1', <SettingOutlined />),
        getItem(lang.menu_name_4_2_2, '4-2-2', <SettingOutlined />),
      ]),
    ]),
  ];
  const isMac = isMacFunc();
  const [collapsed, setCollapsed] = useLocalStorage('slider_collapsed', false);

  useEffect(() => {
    if (!collapsed && !isBack) {
      try {
        const mapValue = MENU_MAP[pathname as keyof typeof MENU_MAP];
        setSelectedKeys([mapValue[1]]);
        setOpenKeys((prev) => Array.from(new Set([...prev, mapValue[0]])));
      } catch (error) {
        setSelectedKeys(['profiles']);
        setOpenKeys(['primary']);
      }
    }
  }, [pathname, collapsed, isBack]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const ToggleIcon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;

  const handleGoToNewProfiles = () => {
    navigate({ to: '/layout/new_profiles' });
  };
  const handleMenuSelected: MenuProps['onSelect'] = (props) => {
    // 只处理当前菜单和和跳转菜单不相同的情况
    if (props.key === selectedKeys[0]) return;
    confirmJump(props.key);
  };
  const handleMenuClick: MenuProps['onClick'] = (props) => {
    // 只处理当前选中菜单和跳转菜单相同的情况，但是当前路径和跳转路径不相同的情况
    if (props.key !== selectedKeys[0]) return;
    confirmJump(props.key);
  };

  /** 跳转确认 */
  const confirmJump = (selectKey: string) => {
    const nextPathName = `/layout/${selectKey}`;
    if (isBack) {
      if (selectKey === selectedKeys[0]) {
        history.back();
        return;
      }

      Modal.confirm({
        title: '取消确认框',
        icon: <ExclamationCircleOutlined />,
        content: `确认要退出${title}吗？返回后将不会保存已编辑内容`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          navigate({ to: nextPathName });
        },
      });
    } else {
      const nextPathName = `/layout/${selectKey}`;
      // 如果当前路径和跳转路径相同，则不跳转
      // 防止重复跳转
      if (pathname === nextPathName) return;
      navigate({ to: nextPathName });
    }
  };
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };
  return (
    <div
      className="flex flex-col items-center w-[220px] slider bg-bg_primary pt-3 px-[16px] overflow-hidden transition-all"
      style={{
        height: isMac ? '100vh' : 'calc(100vh - 30px)',
        width: collapsed ? '90px' : '220px',
      }}
    >
      <div
        className="flex items-end gap-2 m-1 transition-all px-2"
        style={{
          width: collapsed ? '60px' : '170px',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <img
          className="rounded-md transition-all"
          style={{
            width: collapsed ? '2.5rem' : '2rem',
            height: collapsed ? '2.5rem' : '2rem',
            objectFit: 'fill',
          }}
          src="https://avatars.githubusercontent.com/u/38754760?v=4"
          alt="add-profile-icon"
        />
        <span
          className="text-black font-bold text-xl"
          style={{ display: collapsed ? 'none' : 'unset' }}
        >
          MaiKu-Net
        </span>
      </div>
      <div className="relative">
        <Tooltip
          title={lang.new_project}
          {...(collapsed ? {} : { open: false })}
        >
          <Button
            icon={<PlusOutlined />}
            className="h-10 rounded-lg mt-2 shadow-3xl transition-all"
            type="primary"
            style={{ width: collapsed ? '43px' : '180px' }}
            onClick={handleGoToNewProfiles}
          >
            {collapsed ? '' : lang.new_project}
          </Button>
        </Tooltip>
        <div
          className="all_flex w-6 h-6
          absolute z-10 -right-[1rem] shadow-3xl top-10
          bg-bg_secondary hover:bg-bg_secondary/75 transition-all
          rounded-md  cursor-pointer"
          onClick={toggleCollapsed}
          style={{ right: collapsed ? '-1.7rem' : '-1.5rem' }}
        >
          <ToggleIcon className="text-white" />
        </div>
      </div>
      <MacScrollbar className="flex-1 mt-3 w-full">
        <Menu
          className="layout-slider-menu h-full w-full bg-bg_primary transition-all"
          defaultSelectedKeys={collapsed ? [] : ['profiles']}
          defaultOpenKeys={collapsed ? [] : ['primary']}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          inlineCollapsed={collapsed}
          onSelect={handleMenuSelected}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
          inlineIndent={10}
          items={items}
          mode="inline"
        />
      </MacScrollbar>
      {collapsed ? <SliderFooterCollapse /> : <SliderFooterUnCollapse />}
    </div>
  );
};
export default Slider;

export const SliderFooterUnCollapse = () => {
  const [lang] = useI18nConfig('config.layout.slider');
  const navigate = useNavigate();

  const handleGoToUpgrade = () => {
    navigate({ to: '/layout/upgrade_pkg' });
  };

  return (
    <div className="w-full h-[125px] pt-6 pb-2">
      <div className="w-full h-full bg-bg_secondary/50 rounded-lg p-2">
        <div className="flex justify-between items-center">
          <span className="text-bold text-white text-lg">Free</span>
          <button className="btn_outside" onClick={handleGoToUpgrade}>
            {lang.first_subs}
          </button>
        </div>
        <div className="flex justify-between items-center pr-5 text-sm mt-1 text-[#272f74]">
          <span>{lang.project_quantity}</span>
          <span>1/2</span>
        </div>
        <div className="flex justify-between items-center text-sm pr-5 text-[#272f74]">
          <span>{lang.user_quantity}</span>
          <span>1/1</span>
        </div>
      </div>
    </div>
  );
};

export const SliderFooterCollapse = () => {
  const [lang] = useI18nConfig('config.layout.slider');
  const navigate = useNavigate();
  const handleGoToUpgrade = () => {
    console.log('handleGoToUpgrade');
    navigate({ to: '/layout/upgrade_pkg' });
  };
  return (
    <div className="w-full h-[125px] pt-6 cursor-pointer">
      <Tooltip
        open={true}
        overlayClassName="slider_tooltip"
        title={lang.first_subs}
        placement="topLeft"
        trigger="click"
      >
        <div
          className="btn_outside all_flex w-14 h-14 !bg-bg_primary"
          style={{ borderRadius: '1.2rem' }}
          onClick={handleGoToUpgrade}
        >
          <GiftOutlined className="text-3xl text-gray-700" />
        </div>
      </Tooltip>
    </div>
  );
};
