import { queryOptions } from '@tanstack/react-query';
import { getProxyListService } from '@api/discover/proxy.ts';
import { getEnvListService } from '@api/primary/env.ts';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyListService,
});
export const postsEnvQueryOptions = queryOptions({
  queryKey: ['posts-env-list'],
  queryFn: getEnvListService,
});
