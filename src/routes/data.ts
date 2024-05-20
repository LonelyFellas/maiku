import { queryOptions } from '@tanstack/react-query';
import { getProxyListService, getEnvListService } from '@api';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyListService,
});
export const postsEnvQueryOptions = queryOptions({
  queryKey: ['posts-env-list'],
  queryFn: getEnvListService,
});
