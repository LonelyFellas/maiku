import { queryOptions } from '@tanstack/react-query';
import { getProxyListService, getEnvListService, getFilesListService } from '@api';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyListService,
});
export const postsEnvQueryOptions = queryOptions({
  queryKey: ['posts-env-list'],
  queryFn: getEnvListService,
});
export const postsFileQueryOptions = queryOptions({
  queryKey: ['posts-file-list'],
  queryFn: getFilesListService,
});
