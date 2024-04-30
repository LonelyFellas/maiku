import { fetchData } from '../fetch-data';
import { LoginParams, LoginResult, RegisterParams } from '@api/type';

export const loginService: Api.IFetch<LoginResult, LoginParams> = (data) =>
  fetchData('auth/login', {
    method: 'POST',
    data,
  });
export const registerService: Api.IFetch<boolean, RegisterParams> = (data) =>
  fetchData('auth/register', {
    method: 'POST',
    data,
  });
