/**
 * 检查是否为 `Mac` 操作系统
 * 如果是 `Mac` 操作系统，返回 `true`，否则返回 `false`
 * 由于本项目只考虑 `Mac` 和 `Windows` 两种操作系统，因此只需要检查 navigator.platform 是否包含'mac'
 * `false` 则是 `Windows` 操作系统
 * @returns {boolean} 是否为 Mac 操作系统
 */
export default function isMacFunc(): boolean {
  return navigator.platform.toLowerCase().includes('mac');
}
