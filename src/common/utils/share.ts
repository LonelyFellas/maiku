import dayjs from 'dayjs';
import prettyBytes from 'pretty-bytes';
import { Constants, toNumber } from '@/common';

/**
 * Check if an object has a property.
 */
export function hasOwnProperty(obj: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/** 检查是否有token */
export const hasToken = !['undefined', 'null'].includes(window.localStorage.getItem(Constants.LOCAL_TOKEN) || 'null');
/** 获取token */
export const getToken = window.localStorage.getItem(Constants.LOCAL_TOKEN);
/** 文件大小格式化
 * 转化成 ep: `12KB, 1MB, 1.5MB`这种有单位的
 * @param text 文件number类型
 */
export const fileSizeFormat = (text: number) => prettyBytes(text ?? 0);
/** 时间格式化到天 */
export const timeFormatDay = (text: number) => dayjs(toNumber(text)).format('YYYY-MM-DD');
/** 时间格式化到秒 */
export const timeFormatHours = (text: number) => dayjs(toNumber(text)).format('YYYY-MM-DD HH:mm:ss');
