import { fetchData } from '../fetch-data';

/** 查询我的全部文件 */
export const getFilesListService: Api.IFetch<any[]> = () =>
  fetchData('/file/getAll', {
    method: 'GET',
  });
