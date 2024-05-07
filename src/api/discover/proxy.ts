import { fetchData } from '../fetch-data';
import type { GetAllListResult } from '@api/discover/type';

export const getProxyList: Api.IFetch<GetAllListResult[]> = () =>
  fetchData('vpc/getAll', {
    method: 'GET',
  });
