import type { GetReleaseResult, PostUpgradeRelease } from './type';
import { fetchData } from '../fetch-data';

export const getReleaseService: Api.IFetch<GetReleaseResult[]> = () =>
  fetchData('/app/getRelease', {
    method: 'GET',
  });
export const postUpgradeReleaseService: Api.IFetch<string, PostUpgradeRelease> = (data) =>
  fetchData('/app/add', {
    method: 'POST',
    data,
  });
