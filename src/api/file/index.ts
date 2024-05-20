import { GetFilesListResult } from './type';
import { fetchData } from '../fetch-data';

/** 上传文件 */
export const postUploadFileService: Api.IFetch<boolean, { files: BinaryData }> = (data) =>
  fetchData('/file/upload', {
    method: 'POST',
    data,
    formData: true,
  });
/** 查询我的全部文件 */
export const getFilesListService: Api.IFetch<GetFilesListResult[]> = () =>
  fetchData('/file/getAll', {
    method: 'GET',
  });
/** 删除文件 */
export const postDeleteFileService: Api.IFetch<boolean, { id: number }> = (data) =>
  fetchData('/file/delete', {
    method: 'POST',
    data,
  });
