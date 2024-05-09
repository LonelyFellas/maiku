import { fetchData } from '@api/fetch-data.ts';
import type { GetAllEnvListResult, PostAddEnvParams } from '@api/primary/type.ts';

/** 获取环境列表 */
export const getEnvListService: Api.IFetch<GetAllEnvListResult[]> = () =>
  fetchData('env/getAll', {
    method: 'GET',
  });
/** 添加环境 */
export const postAddEnvService: Api.IFetch<number, PostAddEnvParams> = (data) =>
  fetchData('env/add', {
    method: 'POST',
    data,
  });
/** 修改环境 */
export const postUpdateEnvService: Api.IFetch<boolean, PostAddEnvParams<true>> = (data) =>
  fetchData('env/update', {
    method: 'POST',
    data,
  });
/** 删除环境 */
export const postDeleteEnvService: Api.IFetch<boolean, Pick<GetAllEnvListResult, 'id'>> = (data) =>
  fetchData('env/delete', {
    method: 'POST',
    data,
  });
/** 按照ID获取环境信息 */
export const getEnvByIdService: Api.IFetch<GetAllEnvListResult, Pick<GetAllEnvListResult, 'id'>> = (data) =>
  fetchData(`env/getById`, {
    method: 'GET',
    data,
  });
