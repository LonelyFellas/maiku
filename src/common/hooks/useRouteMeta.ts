import { useMemo } from 'react';
import { useMatches, useRouter } from '@tanstack/react-router';

/**
 * 获取当前路由的meta信息
 * 另外还有一些useRouter中的一些属性，比如`history`、`latestLocation`等
 */
const useRouteMeta = () => {
  const { history, latestLocation } = useRouter();
  const matchRoute = useMatches();

  return useMemo(() => {
    try {
      return {
        pathname: latestLocation.pathname,
        history,
        // @ts-ignore
        title: matchRoute?.at(-1).meta[0].title ?? '我的云手机',
        // @ts-ignore
        isBack: matchRoute?.at(-1).meta[0].isBack ?? false,
      };
    } catch {
      console.error('路由meta的标题没有设置');

      return {
        history,
        pathname: latestLocation.pathname,
        title: '我的云手机',
        isBack: false,
      };
    }
  }, [latestLocation.pathname]);
};

export default useRouteMeta;
