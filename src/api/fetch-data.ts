import { message } from 'antd';
import { isObject } from '@darwish/utils-is';
import { Constants } from '@common';

export const fetchData = async <TData, TParams = null>(url: Api.Url, init: Api.Init<TParams>): Promise<TData> => {
  const defaultInit: Api.Init<unknown> = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
      'X-Token': JSON.parse(window.localStorage.getItem(Constants.LOCAL_TOKEN) || 'null'),
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  // 拼接地址
  url = `${import.meta.env.VITE_API_URL}/${url}`;
  // GET请求参数放地址上
  // 其他请求参数放body上
  if (init.method === 'GET') {
    url = getSerialUrl(url as string, init.data ?? {});
  } else if (init.data !== null) {
    defaultInit.body = JSON.stringify(init.data);
  }

  // 删除多余参数
  delete init.data;

  // 合并配置
  const options = Object.assign(defaultInit, init);

  return fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      /**
       * errno 编码为101，未登录，
       */
      if (res.errno === 101) {
        message.error('登录失效，请重新登录').then(() => {
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
