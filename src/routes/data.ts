import { queryOptions } from '@tanstack/react-query';
import { getProxyList } from '@api/discover/proxy.ts';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyList,
});
