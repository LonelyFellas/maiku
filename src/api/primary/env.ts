import { fetchData } from '@api/fetch-data.ts';
import type {
  GetAllEnvListResult,
  PostAddEnvParams,
} from '@api/primary/type.ts';

/** 获取环境列表 */
export const getEnvListService: Api.IFetch<GetAllEnvListResult[]> = () =>
  fetchData('env/getAll', {
    method: 'GET',
  });
/** 添加环境 */
export const postAddEnvService: Api.IFetch<any, PostAddEnvParams> = (data) =>
  fetchData('env/add', {
    method: 'POST',
    data,
  });
