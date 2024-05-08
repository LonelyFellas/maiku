import { fetchData } from '../fetch-data';
import type { GetProxyListResult, PostAddEditProxyParams } from '@api/discover/type';

/** 获取代理列表 */
export const getProxyListService: Api.IFetch<GetProxyListResult[]> = () =>
  fetchData('vpc/getAll', {
    method: 'GET',
  });
/** 添加代理列表 */
export const postAddProxyService: Api.IFetch<number, PostAddEditProxyParams> = (data) =>
  fetchData('vpc/add', {
    method: 'POST',
    data,
  });
/** 更新代理 */
export const postUpdateProxyService: Api.IFetch<GetProxyListResult, PostAddEditProxyParams<true>> = (data) =>
  fetchData('vpc/update', {
    method: 'POST',
    data,
  });
/** 删除代理 */
export const postDeleteProxyService: Api.IFetch<number, Pick<GetProxyListResult, 'id'>> = (data) =>
  fetchData('vpc/delete', {
    method: 'POST',
    data,
  });
/** 根据id查询代理 */
export const getProxyByIdService: Api.IFetch<GetProxyListResult, Pick<GetProxyListResult, 'id'>> = (data) =>
  fetchData('vpc/getById', {
    method: 'GET',
    data,
  });
