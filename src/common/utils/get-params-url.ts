export const getQueryParams: (URL: string) => Darwish.AnyObj = (URL) => {
  try {
    return JSON.parse('{"' + decodeURI(URL.split('?')[1]?.replace(/&/g, '","')?.replace(/=/g, '":"') + '"}'));
  } catch {
    return {};
  }
};
/**
 * 获取url参数
 * @param keys 所需查询参数名的数组
 * @return 查询参数值数组
 */
export default function getParamsUrl(keys: string[]) {
  const result: (string | null)[] = [];
  if (import.meta.env.DEV) {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    for (const key of keys) {
      result.push(params.get(key));
    }
  } else if (import.meta.env.PROD) {
    const params = getQueryParams(window.location.href);

    for (const key of keys) {
      result.push(params[key]);
    }
  }

  return result;
}
