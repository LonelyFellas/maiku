import { fetchData } from '@api/fetch-data.ts';
import type { GetBackupListByIdParams, GetBackupListByIdResult } from '@api';

/** 获取备份列表 */
export const getBackupListByEnvIdService: Api.IFetch<GetBackupListByIdResult, GetBackupListByIdParams> = (data) =>
  fetchData('env/getBakList', {
    method: 'GET',
    data,
  });
