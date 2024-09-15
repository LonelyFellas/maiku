import { queryOptions } from '@tanstack/react-query';
import { getProxyListService, getListDeviceService, getFilesListService } from '@api';

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: getProxyListService,
});
export const getListDeviceOptions = queryOptions({
  queryKey: ['get-list-device'],
  queryFn: getListDeviceService,
  refetchInterval: 5000
});
export const postsFileQueryOptions = queryOptions({
  queryKey: ['posts-file-list'],
  queryFn: getFilesListService,
});
