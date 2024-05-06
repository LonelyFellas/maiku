import { App, Space } from 'antd';
import ProfileCenter from './profile-center';
import UpdateCenter from './update-center';
import NotificationCenter from './notification-center';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouteMeta } from '@common';

const Header = () => {
  const { modal } = App.useApp();
  const { title, isBack, history } = useRouteMeta();

  const handleBackClick = () => {
    modal.confirm({
      title: '取消确认框',
      icon: <ExclamationCircleOutlined />,
      content: `确认要退出${title}吗？返回后将不会保存已编辑内容`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        history.go(-1);
      },
    });
  };
  return (
    <div className="flex justify-between h-30px ">
      <h1 className="text-xl font-bold">
        {isBack && (
          <span>
            <span
              onClick={handleBackClick}
              className="text-sm font-normal text-text_secondary/80 underline underline-offset-4 cursor-pointer hover:text-text_secondary"
            >
              返回
            </span>{' '}
            /{' '}
          </span>
        )}
        <span>{title}</span>
      </h1>
      <div>
        <Space size="large">
          <UpdateCenter />
          <NotificationCenter />
          <ProfileCenter />
        </Space>
      </div>
    </div>
  );
};
export default Header;
