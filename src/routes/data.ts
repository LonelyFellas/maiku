import { queryOptions } from '@tanstack/react-query';
import { getProxyListService, getListDeviceService, getFilesListService } from '@api';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyListService,
});
export const postsListDeviceOptions = queryOptions({
  queryKey: ['posts-list-device'],
  queryFn: getListDeviceService,
});
export const postsFileQueryOptions = queryOptions({
  queryKey: ['posts-file-list'],
  queryFn: getFilesListService,
});
