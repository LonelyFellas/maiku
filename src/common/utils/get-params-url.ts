/**
 * 获取url参数
 * @param keys 所需查询参数名的数组
 * @return 查询参数值数组
 */
export default function getParamsUrl(keys: string[]) {
  const result: (string | null)[] = [];
  const url = window.location.href;
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  for (const key of keys) {
    result.push(params.get(key));
  }

  return result;
}
