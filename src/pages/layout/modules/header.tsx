import { Modal, Space } from 'antd';
import ProfileCenter from './profile-center';
import UpdateCenter from './update-center';
import NotificationCenter from './notification-center';
import { useMatches, useRouter } from '@tanstack/react-router';
import { isArray } from '@darwish/utils-is';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { useTagTitle } from '@common';

const Header = () => {
  const { history } = useRouter();
  const matches = useMatches();
  let title = '环境管理';
  let isBack = false;
  try {
    if (matches && isArray(matches)) {
      // @ts-ignore
      title = matches?.at(-1)?.meta[0].title ?? '';
      // @ts-ignore
      isBack = matches?.at(-1).meta[0].isBack ?? false
    }
  } catch {
    throw Error("路由meta的标题没有设置");
  }

  const handleBackClick = () => {
    Modal.confirm({
      title: '取消确认框',
      icon: <ExclamationCircleOutlined />,
      content: `确认要退出${title}吗？返回后将不会保存已编辑内容`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        history.go(-1);
      },
    });
  }
  return (
    <div className="flex justify-between h-30px ">
      <h1 className="text-xl font-bold">
        {isBack &&<span> <span onClick={handleBackClick} className='text-sm font-normal text-text_secondary/80 underline underline-offset-4 cursor-pointer hover:text-text_secondary'>返回</span> / </span>}
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
