import { fetchData } from '../fetch-data';
import { GetReleaseResult, PostUpgradeRelease } from './type';

export const getReleaseService: Api.IFetch<GetReleaseResult[]> = () =>
  fetchData('/app/getRelease', {
    method: 'GET',
  });
export const postUpgradeReleaseService: Api.IFetch<string, PostUpgradeRelease> = (data) =>
  fetchData('/app/add', {
    method: 'POST',
    data,
  });
