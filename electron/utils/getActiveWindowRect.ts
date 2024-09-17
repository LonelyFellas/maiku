import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cwp = require('@darwish/captures-win32-position/lib/main.js');

interface RECT {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

/**
 * 获取当前活动窗口的位置信息
 * @param {String} winName 窗口名字
 */
export function getWindowRect(winName: string): RECT | null {
  const win = cwp.getWindowRect(winName);
  return win;
}

/**
 * 检查窗口是否存在
 * @param winName string 窗口名字
 * @returns boolean 是否存在
 */
export function checkWindowExists(winName: string) {
  const win = cwp.getWindowW(winName);
  return win !== null;
}
