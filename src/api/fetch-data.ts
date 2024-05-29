import { message } from 'antd';
import { isObject } from '@darwish/utils-is';
import { Constants, hasOwnProperty } from '@common';

export const fetchData = async <TData, TParams = null>(url: Api.Url, init: Api.Init<TParams>): Promise<TData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, contentType, formData, data, isProxy, ...restInit } = init;
  const defaultInit: Api.Init<unknown> = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': window.localStorage.getItem(Constants.LOCAL_TOKEN) || 'null',
    },
    redirect: 'follow',
  };

  url = `${import.meta.env[isProxy ? 'VITE_API_URL_PROXY' : 'VITE_API_URL']}/${url}`;
  // contentType
  if (init.contentType && defaultInit.headers) {
    defaultInit.headers['Content-Type'] = contentTypeConfig(contentType);
  }

  // GET请求参数放地址上
  // 其他请求参数放body上
  if (init.method === 'GET') {
    url = getSerialUrl(url as string, data ?? {});
  } else if (data !== null && formData) {
    // 处理formData
    const formData = new FormData();
    for (const key in data) {
      if (hasOwnProperty(data, key)) {
        formData.append(key, data[key] as any);
      }
    }
    delete defaultInit.headers?.['Content-Type'];
    defaultInit.body = formData;
  } else {
    defaultInit.body = JSON.stringify(data);
  }

  // 合并配置
  const options = {
    ...defaultInit,
    ...restInit,
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      /**
       * errno 编码为101，未登录，
       */
      if (res.errno === 101) {
        message.error('登录失效，请重新登录').then(() => {
          window.localStorage.setItem(Constants.LOCAL_TOKEN, '');
          window.location.href = '/login';
        });
        return null;
      } else if (isObject(res) && 'errno' in res && res.errno !== 0) {
        // 其他错误编码
        message.error(res.errmsg);
        return res.data;
      }

      return res.data;
    })
    .catch((err) => {
      message.error(`Fetch fail: ${err}`);
      return null;
    });
};

function getSerialUrl<T extends Darwish.AnyObj>(baseUrl: string, params: T) {
  if (Object.keys(params || {}).length === 0) return baseUrl;
  // 将参数对象转换为查询字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // 拼接基础 URL 和查询字符串
  return `${baseUrl}?${queryString}`;
}

function contentTypeConfig(contentType: keyof Api.ContentType | undefined) {
  switch (contentType) {
    case 'json':
      return 'application/json';
    case 'app-form':
      return 'application/x-www-form-urlencoded';
    case 'mul-form':
      return 'multipart/form-data';
    default:
      return 'application/json';
  }
}
