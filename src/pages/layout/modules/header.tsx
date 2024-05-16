import { useMemo } from 'react';
import { App, Badge, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage, useSessionStorage } from '@darwish/hooks-core';
import semverCompare from 'semver/functions/compare';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProfileCenter from './profile-center';
import UpdateCenter from './update-center';
import NotificationCenter from './notification-center';
import { Constants, useRouteMeta } from '@common';
import { getReleaseService } from '@api';
import pkg from '/package.json';
import { isBlanks } from '@darwish/utils-is';

const Header = () => {
  const [currentVersion] = useLocalStorage(Constants.LOCAL_CURRENT_VERSION, pkg.version);
  const [skipVersion, setSkipVersion] = useSessionStorage(Constants.SESSION_SKIP_VERSION, {
    version: pkg.version,
    isSkip: false,
  });
  const { modal } = App.useApp();
  const { title, isBack, history } = useRouteMeta();

  const { data = [] } = useQuery({
    queryKey: ['get_release'],
    queryFn: getReleaseService,
    refetchInterval: 60 * 1000,
  });

  const isNewVersion = useMemo(() => {
    if (!isBlanks(data)) {
      const latestVersion = data[0].version;
      // 判断是否版本被跳过
      if (skipVersion.isSkip) {
        // 跳过的版本是否和新版本是一致，有可能有更新的版本
        return !(semverCompare(skipVersion.version, latestVersion) === 0);
      }
      return semverCompare(latestVersion, currentVersion) === 1;
    }
    return false;
  }, [data, currentVersion, skipVersion]);

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

  const handleSkipVersion = (version: string) => {
    setSkipVersion({ version, isSkip: true });
  };
  return (
    <div className="flex justify-between h-30px ">
      <h1 className="text-xl font-bold">
        {isBack && (
          <span>
            <span onClick={handleBackClick} className="text-sm font-normal text-text_secondary/80 underline underline-offset-4 cursor-pointer hover:text-text_secondary">
              返回
            </span>{' '}
            /{' '}
          </span>
        )}
        <span>{title}</span>
      </h1>
      <div>
        <Space size="large">
          <Badge count={isNewVersion ? '1' : ''} size="small">
            <UpdateCenter newVersionData={isBlanks(data) ? [] : data} isNewVersion={isNewVersion} handleSkipVersion={handleSkipVersion} />
          </Badge>
          <NotificationCenter />
          <ProfileCenter />
        </Space>
      </div>
    </div>
  );
};
export default Header;
