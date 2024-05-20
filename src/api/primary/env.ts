import { fetchData } from '@api/fetch-data.ts';
import type { GetBackupListByIdParams, GetBackupListByIdResult, GetAllEnvListResult, PostAddEnvParams, GetBackupParams, GetBackupToBackupParams } from '@api';

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

/** 获取备份列表 */
export const getBackupListByEnvIdService: Api.IFetch<GetBackupListByIdResult[], GetBackupListByIdParams> = (data) =>
  fetchData('env/getBakList', {
    method: 'GET',
    data,
  });

/** 启动备份 */
export const postRunBackupService: Api.IFetch<boolean, GetBackupParams> = (data) =>
  fetchData('env/runBak', {
    method: 'POST',
    data,
  });
/** 删除备份 */
export const postDeleteBackService: Api.IFetch<boolean, GetBackupParams> = (data) =>
  fetchData('env/deleteBak', {
    method: 'POST',
    data,
  });
/** 增加备份 */
export const postAddBackupService: Api.IFetch<boolean, GetBackupToBackupParams> = (data) =>
  fetchData('env/createBak', {
    method: 'POST',
    data,
  });

/** 查看当前运行中代理 */
// TODO: 类型待确认
export const postBackupProxyService: Api.IFetch<GetBackupListByIdResult[], GetBackupListByIdParams> = (data) =>
  fetchData('env/getCurrentVpc', {
    method: 'POST',
    data,
  });
/** 设置/更新云手机代理 */

// TODO: 类型待确认
export const postSetBackupProxyService: Api.IFetch<GetBackupListByIdResult[], GetBackupListByIdParams> = (data) =>
  fetchData('env/setVpc', {
    method: 'POST',
    data,
  });

/** 清空代理 */

// TODO: 类型待确认
export const postClearBackupProxyService: Api.IFetch<boolean, GetBackupListByIdParams> = (data) =>
  fetchData('env/clearVpc', {
    method: 'POST',
    data,
  });
